import { Image, type ImageSource } from 'expo-image';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { TicketContextCard } from '@/components/tickets/ticket-context-card';
import { Brand, Feedback, InterFonts, Radius, Ring, Spacing } from '@/constants/theme';
import type { TicketEscalationRequest, TicketResolution, TicketSummary } from '@/types/ticket';
import {
  ESCALATION_REASONS,
  ESCALATION_TARGET,
  RESOLUTION_REVIEWER,
  RESOLVE_NOTE_MAX_LENGTH,
  canSubmitResolve,
  type ResolveOutcome,
} from '@/utils/ticket-resolve';

type ResolveFormProps = {
  ticket: TicketSummary;
  saving: boolean;
  onResolve: (resolution: TicketResolution) => void;
  onEscalate: (request: TicketEscalationRequest) => void;
  onDiscard: () => void;
};

/** Body and action bar of the "Resolve ticket" screen, for both outcomes. */
export function ResolveForm({ ticket, saving, onResolve, onEscalate, onDiscard }: ResolveFormProps) {
  const [outcome, setOutcome] = useState<ResolveOutcome>('resolved');
  const [resolutionNote, setResolutionNote] = useState('');
  const [reason, setReason] = useState<string>(ESCALATION_REASONS[0]);
  const [escalationNote, setEscalationNote] = useState('');
  const [focused, setFocused] = useState(false);
  const [reasonOpen, setReasonOpen] = useState(false);

  const resolving = outcome === 'resolved';
  const note = resolving ? resolutionNote : escalationNote;
  const canSubmit = canSubmitResolve(note) && !saving;

  function submit() {
    if (resolving) {
      onResolve({ note: resolutionNote.trim() });
    } else {
      onEscalate({ reason, note: escalationNote.trim() });
    }
  }

  function discard() {
    if (resolutionNote.trim() === '' && escalationNote.trim() === '') {
      onDiscard();
      return;
    }
    Alert.alert('Discard this resolution?', 'What you wrote will be lost.', [
      { text: 'Keep editing', style: 'cancel' },
      { text: 'Discard', style: 'destructive', onPress: onDiscard },
    ]);
  }


  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        {resolving && <TicketContextCard ticket={ticket} />}

        <View style={styles.field}>
          <Text style={styles.label}>Outcome</Text>
          <View style={styles.options}>
            <ChoiceTile
              label="Resolved"
              selected={resolving}
              icon={
                resolving
                  ? require('@/assets/images/resolve/tile-check-selected.svg')
                  : require('@/assets/images/resolve/tile-check-unselected.svg')
              }
              onPress={() => setOutcome('resolved')}
            />
            <ChoiceTile
              label="Unable to resolve"
              selected={!resolving}
              icon={
                resolving
                  ? require('@/assets/images/resolve/tile-x-unselected.svg')
                  : require('@/assets/images/resolve/tile-x-selected.svg')
              }
              onPress={() => setOutcome('unableToResolve')}
            />
          </View>
        </View>

        {!resolving && (
          <View style={styles.textarea}>
            <Text style={styles.label}>Reason</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Reason: ${reason}`}
              accessibilityState={{ expanded: reasonOpen }}
              onPress={() => setReasonOpen((open) => !open)}
              style={styles.select}>
              <Text style={styles.selectValue} numberOfLines={1}>
                {reason}
              </Text>
              <Image
                source={require('@/assets/images/resolve/chevron-down.svg')}
                style={[styles.chevron, reasonOpen && styles.chevronOpen]}
                contentFit="contain"
              />
            </Pressable>
            {reasonOpen && (
              <View style={styles.menu}>
                {ESCALATION_REASONS.map((option) => (
                  <Pressable
                    key={option}
                    accessibilityRole="button"
                    accessibilityState={{ selected: option === reason }}
                    onPress={() => {
                      setReason(option);
                      setReasonOpen(false);
                    }}
                    style={[styles.menuItem, option === reason && styles.menuItemSelected]}>
                    <Text style={styles.selectValue}>{option}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        )}

        <View style={styles.textarea}>
          <Text style={styles.label}>{resolving ? 'Resolution note' : 'What happened?'}</Text>
          <TextInput
            accessibilityLabel={resolving ? 'Resolution note' : 'What happened?'}
            multiline
            maxLength={RESOLVE_NOTE_MAX_LENGTH}
            value={note}
            onChangeText={resolving ? setResolutionNote : setEscalationNote}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            textAlignVertical="top"
            style={[styles.input, focused && styles.inputFocused]}
          />
          <View style={styles.meta}>
            <Text style={styles.metaText}>
              {resolving
                ? 'Included in the resolution email to the guest'
                : `Goes to the ${ESCALATION_TARGET.role}`}
            </Text>
            <Text style={styles.metaText}>
              {note.length} / {RESOLVE_NOTE_MAX_LENGTH}
            </Text>
          </View>
        </View>

        {resolving ? (
          <View style={[styles.banner, styles.bannerInfo]}>
            <Image
              source={require('@/assets/images/resolve/info.svg')}
              style={styles.bannerIcon}
              contentFit="contain"
            />
            <View style={styles.bannerText}>
              <Text style={[styles.infoTitle, { color: Feedback.info.fg }]}>
                Manager review, then the guest is emailed
              </Text>
              <Text style={styles.infoBody}>
                {RESOLUTION_REVIEWER} approves the resolution. The ticket then closes and the guest
                gets one email that it’s resolved, with a short survey.
              </Text>
            </View>
          </View>
        ) : (
          <View style={[styles.banner, styles.bannerWarning]}>
            <Image
              source={require('@/assets/images/resolve/warning-triangle.svg')}
              style={styles.bannerIcon}
              contentFit="contain"
            />
            <View style={styles.bannerText}>
              <Text style={[styles.warningTitle, { color: Feedback.warning.fg }]}>
                This will escalate the ticket
              </Text>
              <Text style={styles.warningBody}>
                {ESCALATION_TARGET.name} ({ESCALATION_TARGET.role}) takes over. The guest is emailed
                only when the complaint is finally resolved.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.actionBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !canSubmit }}
          disabled={!canSubmit}
          onPress={submit}
          style={[styles.primary, !canSubmit && styles.primaryDisabled]}>
          <Image
            source={
              resolving
                ? require('@/assets/images/resolve/submit-check.svg')
                : require('@/assets/images/resolve/submit-escalate.svg')
            }
            style={styles.primaryIcon}
            contentFit="contain"
          />
          <Text style={styles.primaryText}>{resolving ? 'Submit resolution' : 'Submit & escalate'}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          disabled={saving}
          onPress={resolving ? discard : () => setOutcome('resolved')}
          style={styles.secondary}>
          <Text style={styles.secondaryText}>{resolving ? 'Discard' : 'Back'}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

type ChoiceTileProps = {
  label: string;
  selected: boolean;
  icon: ImageSource;
  onPress: () => void;
};

/** Figma "Choice Tile": a 56px tile with a round icon and a label. */
function ChoiceTile({ label, selected, icon, onPress }: ChoiceTileProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.tile, selected ? styles.tileSelected : styles.tileOutline]}>
      <View style={[styles.tileIconWrap, selected && styles.tileIconWrapSelected]}>
        <Image source={icon} style={styles.tileIcon} contentFit="contain" />
      </View>
      <Text style={styles.tileLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    gap: Spacing.three,
    padding: Spacing.three,
  },
  field: {
    gap: Spacing.two,
  },
  label: {
    fontFamily: InterFonts.medium,
    fontSize: 13,
    lineHeight: 18,
    color: Brand.textPrimary,
  },
  options: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  tile: {
    flex: 1,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    borderRadius: Radius.lg,
  },
  tileOutline: {
    backgroundColor: Brand.bgSurface,
    borderWidth: 1,
    borderColor: Brand.borderDefault,
  },
  tileSelected: {
    backgroundColor: Brand.bgBrandMuted,
    borderWidth: 1.5,
    borderColor: Brand.borderBrand,
  },
  tileIconWrap: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.bgBrandSubtle,
    borderRadius: 999,
  },
  tileIconWrapSelected: {
    backgroundColor: Brand.bgBrand,
  },
  tileIcon: {
    width: 16,
    height: 16,
  },
  tileLabel: {
    flex: 1,
    fontFamily: InterFonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
    color: Brand.textPrimary,
  },
  textarea: {
    gap: 6,
  },
  select: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: 12,
    backgroundColor: Brand.bgSurface,
    borderWidth: 1,
    borderColor: Brand.borderDefault,
    borderRadius: Radius.md,
  },
  selectValue: {
    flex: 1,
    fontFamily: InterFonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: Brand.textPrimary,
  },
  chevron: {
    width: 18,
    height: 18,
  },
  chevronOpen: {
    transform: [{ rotate: '180deg' }],
  },
  menu: {
    backgroundColor: Brand.bgSurface,
    borderWidth: 1,
    borderColor: Brand.borderDefault,
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  menuItem: {
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: Spacing.two,
  },
  menuItemSelected: {
    backgroundColor: Brand.bgBrandMuted,
  },
  input: {
    height: 120,
    paddingHorizontal: 12,
    paddingVertical: Spacing.two,
    backgroundColor: Brand.bgSurface,
    borderWidth: 1,
    borderColor: Brand.borderDefault,
    borderRadius: Radius.md,
    fontFamily: InterFonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: Brand.textPrimary,
  },
  inputFocused: {
    borderWidth: 1.5,
    borderColor: Brand.borderFocus,
    boxShadow: `0 0 0 3px ${Ring.focus}`,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  metaText: {
    fontFamily: InterFonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: Brand.textTertiary,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: Radius.lg,
  },
  bannerInfo: {
    backgroundColor: Feedback.info.bg,
    borderColor: Feedback.info.border,
  },
  bannerWarning: {
    backgroundColor: Feedback.warning.bg,
    borderColor: Feedback.warning.border,
  },
  bannerIcon: {
    width: 20,
    height: 20,
  },
  bannerText: {
    flex: 1,
    gap: Spacing.half,
  },
  infoTitle: {
    fontFamily: InterFonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
  },
  infoBody: {
    fontFamily: InterFonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: Brand.textSecondary,
  },
  warningTitle: {
    fontFamily: InterFonts.semiBold,
    fontSize: 13,
    lineHeight: 18,
  },
  warningBody: {
    fontFamily: InterFonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: Brand.textSecondary,
  },
  actionBar: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    backgroundColor: Brand.bgSurface,
    borderTopWidth: 1,
    borderTopColor: Brand.borderSubtle,
  },
  primary: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingHorizontal: 20,
    backgroundColor: Brand.bgBrand,
    borderRadius: Radius.md,
  },
  primaryDisabled: {
    opacity: 0.6,
  },
  primaryIcon: {
    width: 20,
    height: 20,
  },
  primaryText: {
    fontFamily: InterFonts.medium,
    fontSize: 16,
    lineHeight: 24,
    color: Brand.textOnBrand,
  },
  secondary: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: Radius.md,
  },
  secondaryText: {
    fontFamily: InterFonts.medium,
    fontSize: 16,
    lineHeight: 24,
    color: Brand.textSecondary,
  },
});
