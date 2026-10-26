import { Image } from 'expo-image';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { SegmentedControl } from '@/components/segmented-control';
import { FilterChip } from '@/components/tickets/filter-chip';
import { TicketContextCard } from '@/components/tickets/ticket-context-card';
import { Brand, InterFonts, Radius, Ring, Spacing } from '@/constants/theme';
import type { ProgressStatus, TicketProgressUpdate, TicketSummary } from '@/types/ticket';
import {
  NOTE_MAX_LENGTH,
  PROGRESS_STATUS_OPTIONS,
  QUICK_SNIPPETS,
  appendSnippet,
} from '@/utils/ticket-progress';

type ProgressFormProps = {
  ticket: TicketSummary;
  saving: boolean;
  onSubmit: (update: TicketProgressUpdate) => void;
};

/** Body and action bar of the "Update progress" screen. */
export function ProgressForm({ ticket, saving, onSubmit }: ProgressFormProps) {
  const [status, setStatus] = useState<ProgressStatus>(
    ticket.status === 'claimed' ? 'claimed' : 'inProgress',
  );
  const [note, setNote] = useState('');
  const [focused, setFocused] = useState(false);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <TicketContextCard ticket={ticket} />

        <View style={styles.field}>
          <Text style={styles.label}>Status</Text>
          <SegmentedControl options={PROGRESS_STATUS_OPTIONS} value={status} onChange={setStatus} />
        </View>

        <View style={styles.textarea}>
          <Text style={styles.label}>What did you do?</Text>
          <TextInput
            accessibilityLabel="What did you do?"
            multiline
            maxLength={NOTE_MAX_LENGTH}
            value={note}
            onChangeText={setNote}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            textAlignVertical="top"
            style={[styles.input, focused && styles.inputFocused]}
          />
          <View style={styles.meta}>
            <Text style={styles.metaText}>Visible to supervisors and duty managers instantly</Text>
            <Text style={styles.metaText}>
              {note.length} / {NOTE_MAX_LENGTH}
            </Text>
          </View>
        </View>

        <View style={styles.snippets}>
          <Text style={styles.overline}>Quick snippets</Text>
          <View style={styles.chips}>
            {QUICK_SNIPPETS.map((snippet) => (
              <FilterChip
                key={snippet}
                label={snippet}
                selected={false}
                onPress={() => setNote((current) => appendSnippet(current, snippet))}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.actionBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: saving }}
          disabled={saving}
          onPress={() => onSubmit({ status, note: note.trim() })}
          style={[styles.save, saving && styles.saving]}>
          <Image
            source={require('@/assets/images/tickets/save-check.svg')}
            style={styles.saveIcon}
            contentFit="contain"
          />
          <Text style={styles.saveText}>Save update</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
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
  textarea: {
    gap: 6,
  },
  input: {
    minHeight: 120,
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
  snippets: {
    gap: Spacing.two,
  },
  overline: {
    fontFamily: InterFonts.semiBold,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.66,
    textTransform: 'uppercase',
    color: Brand.textTertiary,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  actionBar: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    backgroundColor: Brand.bgSurface,
    borderTopWidth: 1,
    borderTopColor: Brand.borderSubtle,
  },
  save: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingHorizontal: 20,
    backgroundColor: Brand.bgBrand,
    borderRadius: Radius.md,
  },
  saving: {
    opacity: 0.6,
  },
  saveIcon: {
    width: 20,
    height: 20,
  },
  saveText: {
    fontFamily: InterFonts.medium,
    fontSize: 16,
    lineHeight: 24,
    color: Brand.textOnBrand,
  },
});
