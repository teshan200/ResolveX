import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { FilterChip } from '@/components/tickets/filter-chip';
import { Brand, InterFonts, Radius, Spacing } from '@/constants/theme';
import type { TicketStatus, TicketSummary } from '@/types/ticket';

// The Figma "Live" ellipse fill. It has no token in the theme yet.
const LIVE_DOT_COLOR = '#16a34a';

const STATUS_CHIPS: { label: string; status: TicketStatus }[] = [
  { label: 'New', status: 'assigned' },
  { label: 'Claimed', status: 'claimed' },
  { label: 'In progress', status: 'inProgress' },
  { label: 'Escalated', status: 'escalated' },
];

type EmptyToolbarProps = {
  tickets: readonly TicketSummary[];
  onSortPress: () => void;
};

/**
 * Figma "Tickets — Empty": status count chips and the "Live · sorted by priority & SLA" row with
 * the Sort button. Shown above the empty state when no tickets are assigned.
 */
export function EmptyToolbar({ tickets, onSortPress }: EmptyToolbarProps) {
  return (
    <>
      {/* Bleeds to the screen edges so the chip row scrolls past the page padding, as in Figma. */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroll}
        contentContainerStyle={styles.chips}>
        <FilterChip label="All" selected count={tickets.length} />
        {STATUS_CHIPS.map(({ label, status }) => (
          <FilterChip
            key={status}
            label={label}
            selected={false}
            count={tickets.filter((ticket) => ticket.status === status).length}
          />
        ))}
      </ScrollView>
      <View style={styles.sortRow}>
        <View style={styles.live}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Live · sorted by priority &amp; SLA</Text>
        </View>
        <Pressable accessibilityRole="button" onPress={onSortPress} style={styles.sortButton}>
          <Image
            source={require('@/assets/images/tickets/sort.svg')}
            style={styles.sortIcon}
            contentFit="contain"
          />
          <Text style={styles.sortText}>Sort</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  chipScroll: {
    flexGrow: 0,
    marginHorizontal: -Spacing.three,
  },
  chips: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  live: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: LIVE_DOT_COLOR,
  },
  liveText: {
    fontFamily: InterFonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: Brand.textSecondary,
  },
  sortButton: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
  },
  sortIcon: {
    width: 16,
    height: 16,
  },
  sortText: {
    fontFamily: InterFonts.medium,
    fontSize: 13,
    lineHeight: 18,
    color: Brand.textSecondary,
  },
});
