import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppBar } from '@/components/app-bar';
import { FilterSortSheet } from '@/components/tickets/filter-sort-sheet';
import { TicketCard } from '@/components/tickets/ticket-card';
import type { TicketActionId } from '@/components/tickets/ticket-card';
import { TicketEmptyState } from '@/components/tickets/ticket-empty-state';
import { ActiveFilters, TicketsToolbar } from '@/components/tickets/tickets-toolbar';
import { Brand, InterFonts, Spacing } from '@/constants/theme';
import { useTickets } from '@/hooks/use-tickets';
import type { TicketSummary } from '@/types/ticket';
import type { TicketFilters, TicketSort } from '@/types/ticket-filters';
import {
  DEFAULT_FILTERS,
  DEFAULT_SORT,
  SORT_LABELS,
  clearFilter,
  filterTickets,
  formatTicketCount,
  getActiveFilters,
  sortTickets,
} from '@/utils/tickets';

const FIGMA_STATUS_BAR_HEIGHT = 44;

// Only "Update" has a screen so far; Claim and Resolve are not built yet.
const ACTION_HANDLERS: Partial<Record<TicketActionId, (ticket: TicketSummary) => void>> = {
  update: (ticket) =>
    router.push({ pathname: '/tickets/[id]/update-progress', params: { id: ticket.id } }),
};

export default function TicketsScreen() {
  const { status, tickets, reload } = useTickets();
  const [filters, setFilters] = useState<TicketFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<TicketSort>(DEFAULT_SORT);
  const [sheetVisible, setSheetVisible] = useState(false);

  const activeFilters = useMemo(() => getActiveFilters(filters), [filters]);
  const visibleTickets = useMemo(
    () => sortTickets(filterTickets(tickets, filters), sort),
    [tickets, filters, sort],
  );

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <AppBar title="Tickets" onBellPress={() => router.navigate('/alerts')} />
      <ScrollView contentContainerStyle={styles.content}>
        {status === 'loading' ? (
          <View style={styles.message}>
            <Text style={styles.messageText}>Loading your tickets…</Text>
          </View>
        ) : status === 'error' ? (
          <View style={styles.message}>
            <Text style={styles.messageText}>Couldn’t load your tickets.</Text>
            <Pressable accessibilityRole="button" onPress={reload}>
              <Text style={styles.messageAction}>Try again</Text>
            </Pressable>
          </View>
        ) : tickets.length === 0 ? (
          <TicketEmptyState
            title="You’re all caught up"
            message="No tickets assigned to you right now. New complaints for you will appear here instantly."
            actionLabel="Refresh"
            onAction={reload}
          />
        ) : (
          <>
            <TicketsToolbar
              activeFilterCount={activeFilters.length}
              sortLabel={SORT_LABELS[sort]}
              countText={formatTicketCount(
                visibleTickets.length,
                tickets.length,
                activeFilters.length > 0,
              )}
              onOpenSheet={() => setSheetVisible(true)}
            />
            {activeFilters.length > 0 && (
              <ActiveFilters
                filters={activeFilters}
                onRemove={(key) => setFilters((current) => clearFilter(current, key))}
                onReset={resetFilters}
              />
            )}
            <View style={styles.note}>
              <Image
                source={require('@/assets/images/tickets/lock.svg')}
                style={styles.noteIcon}
                contentFit="contain"
              />
              <Text style={styles.noteText}>
                All tickets assigned to you are listed. Escalated or SLA-breached tickets are view
                only: you can’t claim, update or resolve them.
              </Text>
            </View>
            {visibleTickets.length === 0 ? (
              <TicketEmptyState
                title="No matching tickets"
                message="No tickets match your filters. Try changing or resetting them."
                actionLabel="Reset filters"
                onAction={resetFilters}
              />
            ) : (
              <View style={styles.list}>
                {visibleTickets.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} actionHandlers={ACTION_HANDLERS} />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>

      <FilterSortSheet
        visible={sheetVisible}
        tickets={tickets}
        filters={filters}
        sort={sort}
        onApply={(nextFilters, nextSort) => {
          setFilters(nextFilters);
          setSort(nextSort);
          setSheetVisible(false);
        }}
        onClose={() => setSheetVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Brand.bgCanvas,
    paddingTop: FIGMA_STATUS_BAR_HEIGHT,
  },
  content: {
    gap: Spacing.three,
    padding: Spacing.three,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Brand.bgNote,
    borderRadius: 10,
  },
  noteIcon: {
    width: 14,
    height: 14,
  },
  noteText: {
    flex: 1,
    fontFamily: InterFonts.regular,
    fontSize: 12,
    lineHeight: 17,
    color: Brand.textSecondary,
  },
  list: {
    gap: 12,
  },
  message: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.five,
  },
  messageText: {
    fontFamily: InterFonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: Brand.textSecondary,
    textAlign: 'center',
  },
  messageAction: {
    fontFamily: InterFonts.medium,
    fontSize: 13,
    color: Brand.textLink,
  },
});
