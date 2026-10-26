import { Image } from 'expo-image';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FilterChip } from '@/components/tickets/filter-chip';
import { Brand, InterFonts, Radius } from '@/constants/theme';
import type { TicketSummary } from '@/types/ticket';
import type {
  EscalationFilter,
  PriorityFilter,
  SlaFilter,
  TicketFilters,
  TicketSort,
} from '@/types/ticket-filters';
import {
  DEFAULT_FILTERS,
  DEFAULT_SORT,
  SORT_LABELS,
  STATUS_FILTER_OPTIONS,
  filterTickets,
  toggleStatusFilter,
} from '@/utils/tickets';

const ESCALATION_OPTIONS: { value: EscalationFilter; label: string }[] = [
  { value: 'any', label: 'Any' },
  { value: 'escalated', label: 'Escalated' },
  { value: 'notEscalated', label: 'Not escalated' },
];

const SLA_OPTIONS: { value: SlaFilter; label: string }[] = [
  { value: 'any', label: 'Any' },
  { value: 'onTrack', label: 'On track' },
  { value: 'atRisk', label: 'At risk' },
  { value: 'breached', label: 'Breached' },
];

const PRIORITY_OPTIONS: { value: PriorityFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'normal', label: 'Normal' },
];

const SORT_OPTIONS = Object.keys(SORT_LABELS) as TicketSort[];

type FilterSortSheetProps = {
  visible: boolean;
  /** Tickets the draft selection is counted against ("Show N tickets"). */
  tickets: readonly TicketSummary[];
  filters: TicketFilters;
  sort: TicketSort;
  onApply: (filters: TicketFilters, sort: TicketSort) => void;
  onClose: () => void;
};

/**
 * Bottom sheet from the Figma "Tickets — Filter & Sort" frame. Selections are drafted inside the
 * sheet and only applied with the primary button; closing discards them.
 */
export function FilterSortSheet({ visible, ...props }: FilterSortSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={props.onClose}>
      <SheetContent {...props} />
    </Modal>
  );
}

function SheetContent({ tickets, filters, sort, onApply, onClose }: Omit<FilterSortSheetProps, 'visible'>) {
  const insets = useSafeAreaInsets();
  // The Modal unmounts its children when hidden, so the draft starts fresh on every open.
  const [draftFilters, setDraftFilters] = useState(filters);
  const [draftSort, setDraftSort] = useState(sort);

  const matchCount = filterTickets(tickets, draftFilters).length;

  return (
    <View style={styles.overlay}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close filters"
        onPress={onClose}
        style={styles.scrim}
      />
      <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 24) }]}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <Text style={styles.title}>Filter &amp; sort</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            onPress={onClose}
            style={styles.close}>
            <Image
              source={require('@/assets/images/tickets/close.svg')}
              style={styles.closeIcon}
              contentFit="contain"
            />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.sections} showsVerticalScrollIndicator={false}>
          <Section title="Status">
            <FilterChip
              label="All"
              selected={draftFilters.statuses.length === 0}
              onPress={() => setDraftFilters((current) => ({ ...current, statuses: [] }))}
            />
            {STATUS_FILTER_OPTIONS.map((option) => (
              <FilterChip
                key={option.value}
                label={option.label}
                selected={draftFilters.statuses.includes(option.value)}
                onPress={() => setDraftFilters((current) => toggleStatusFilter(current, option.value))}
              />
            ))}
          </Section>

          <Section title="Escalation">
            {ESCALATION_OPTIONS.map((option) => (
              <FilterChip
                key={option.value}
                label={option.label}
                selected={draftFilters.escalation === option.value}
                onPress={() => setDraftFilters((current) => ({ ...current, escalation: option.value }))}
              />
            ))}
          </Section>

          <Section title="SLA">
            {SLA_OPTIONS.map((option) => (
              <FilterChip
                key={option.value}
                label={option.label}
                selected={draftFilters.sla === option.value}
                onPress={() => setDraftFilters((current) => ({ ...current, sla: option.value }))}
              />
            ))}
          </Section>

          <Section title="Priority">
            {PRIORITY_OPTIONS.map((option) => (
              <FilterChip
                key={option.value}
                label={option.label}
                selected={draftFilters.priority === option.value}
                onPress={() => setDraftFilters((current) => ({ ...current, priority: option.value }))}
              />
            ))}
          </Section>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sort by</Text>
            <View style={styles.radios}>
              {SORT_OPTIONS.map((option) => (
                <Radio
                  key={option}
                  label={SORT_LABELS[option]}
                  selected={draftSort === option}
                  onPress={() => setDraftSort(option)}
                />
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setDraftFilters(DEFAULT_FILTERS);
              setDraftSort(DEFAULT_SORT);
            }}
            style={[styles.footerButton, styles.reset]}>
            <Text style={styles.resetText}>Reset</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => onApply(draftFilters, draftSort)}
            style={[styles.footerButton, styles.apply]}>
            <Text style={styles.applyText}>
              Show {matchCount} {matchCount === 1 ? 'ticket' : 'tickets'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.chips}>{children}</View>
    </View>
  );
}

function Radio({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={styles.radio}>
      {selected ? (
        <Image
          source={require('@/assets/images/tickets/radio-selected.svg')}
          style={styles.radioMark}
          contentFit="contain"
        />
      ) : (
        <View style={[styles.radioMark, styles.radioEmpty]} />
      )}
      <Text style={styles.radioLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrim: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: Brand.scrim,
  },
  sheet: {
    maxHeight: '92%',
    gap: 14,
    paddingTop: 12,
    paddingHorizontal: 16,
    backgroundColor: Brand.bgSurface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Brand.sheetHandle,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: InterFonts.semiBold,
    fontSize: 18,
    lineHeight: 25,
    color: Brand.textPrimary,
  },
  close: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    width: 18,
    height: 18,
  },
  sections: {
    gap: 14,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontFamily: InterFonts.semiBold,
    fontSize: 12,
    lineHeight: 17,
    color: Brand.textSecondary,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  radios: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 14,
    rowGap: 10,
  },
  radio: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioMark: {
    width: 18,
    height: 18,
  },
  radioEmpty: {
    backgroundColor: Brand.bgSurface,
    borderWidth: 1.5,
    borderColor: Brand.borderStrong,
    borderRadius: 999,
  },
  radioLabel: {
    fontFamily: InterFonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: Brand.textPrimary,
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
  },
  footerButton: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: Radius.md,
  },
  reset: {
    backgroundColor: Brand.bgSurface,
    borderWidth: 1,
    borderColor: Brand.borderDefault,
  },
  resetText: {
    fontFamily: InterFonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
    color: Brand.textPrimary,
  },
  apply: {
    backgroundColor: Brand.bgBrand,
  },
  applyText: {
    fontFamily: InterFonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
    color: Brand.textOnBrand,
  },
});
