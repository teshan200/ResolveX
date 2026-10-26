import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppBar } from '@/components/app-bar';
import { StatCard } from '@/components/home/stat-card';
import { TicketCard } from '@/components/tickets/ticket-card';
import { Brand, InterFonts, Spacing, TicketColors } from '@/constants/theme';
import { useHomeSummary } from '@/hooks/use-home-summary';
import type { HomeSummary } from '@/types/home';
import { formatShiftEnd, getGreeting } from '@/utils/home';

const FIGMA_STATUS_BAR_HEIGHT = 44;

// Ticket detail screens are not built yet, so tickets open the Tickets tab for now.
const openTickets = () => router.navigate('/tickets');

export default function HomeScreen() {
  const { status, summary, reload } = useHomeSummary();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <AppBar title="Home" onBellPress={() => router.navigate('/alerts')} />
      <ScrollView contentContainerStyle={styles.content}>
        {status === 'ready' && summary ? (
          <HomeContent summary={summary} />
        ) : status === 'error' ? (
          <View style={styles.message}>
            <Text style={styles.messageText}>Couldn’t load your dashboard.</Text>
            <Pressable accessibilityRole="button" onPress={reload}>
              <Text style={styles.messageAction}>Try again</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.message}>
            <Text style={styles.messageText}>Loading your dashboard…</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function HomeContent({ summary }: { summary: HomeSummary }) {
  const { staff, shift, stats, urgentTickets } = summary;

  return (
    <>
      <View style={styles.greeting}>
        <Text style={styles.greetingTitle}>
          {getGreeting()}, {staff.firstName}
        </Text>
        <View style={styles.meta}>
          <Image
            source={require('@/assets/images/home/store.svg')}
            style={styles.metaIcon}
            contentFit="contain"
          />
          <Text style={styles.metaText}>
            {staff.branchName} · {staff.roleTitle}
          </Text>
        </View>
        {shift.onShift && (
          <View style={styles.shift}>
            <Image
              source={require('@/assets/images/home/shift-dot.svg')}
              style={styles.shiftDot}
              contentFit="contain"
            />
            <Text style={styles.shiftText}>On shift · until {formatShiftEnd(shift.endsAt)}</Text>
          </View>
        )}
      </View>

      <View style={styles.stats}>
        <StatCard
          icon={require('@/assets/images/home/stat-open.svg')}
          value={stats.myOpen}
          label="My open"
          backgroundColor={Brand.bgSurface}
          valueColor={Brand.textPrimary}
        />
        <StatCard
          icon={require('@/assets/images/home/stat-sla-at-risk.svg')}
          value={stats.slaAtRisk}
          label="SLA at risk"
          backgroundColor={TicketColors.sla.warning.bg}
          valueColor={TicketColors.sla.warning.fg}
        />
        <StatCard
          icon={require('@/assets/images/home/stat-escalated.svg')}
          value={stats.escalated}
          label="Escalated"
          backgroundColor={TicketColors.sla.breached.bg}
          valueColor={TicketColors.sla.breached.fg}
        />
      </View>

      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Most urgent</Text>
          <View style={styles.sectionCount}>
            <Text style={styles.sectionCountText}>{urgentTickets.length}</Text>
          </View>
        </View>
        <Pressable accessibilityRole="link" onPress={openTickets}>
          <Text style={styles.viewAll}>View all</Text>
        </Pressable>
      </View>

      {urgentTickets.length === 0 ? (
        <View style={styles.message}>
          <Text style={styles.messageText}>No urgent tickets right now.</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {urgentTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} onPress={openTickets} />
          ))}
        </View>
      )}
    </>
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
  greeting: {
    gap: Spacing.one,
    alignItems: 'flex-start',
  },
  greetingTitle: {
    fontFamily: InterFonts.semiBold,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.12,
    color: Brand.textPrimary,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaIcon: {
    width: 14,
    height: 14,
  },
  metaText: {
    fontFamily: InterFonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: Brand.textSecondary,
  },
  shift: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: 12,
    paddingVertical: Spacing.two,
    borderRadius: 999,
    backgroundColor: TicketColors.successBg,
  },
  shiftDot: {
    width: 8,
    height: 8,
  },
  shiftText: {
    fontFamily: InterFonts.semiBold,
    fontSize: 12,
    lineHeight: 16,
    color: TicketColors.successFg,
  },
  stats: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  sectionTitleText: {
    fontFamily: InterFonts.semiBold,
    fontSize: 18,
    lineHeight: 26,
    color: Brand.textPrimary,
  },
  sectionCount: {
    minWidth: 24,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: 999,
    backgroundColor: Brand.bgMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionCountText: {
    fontFamily: InterFonts.semiBold,
    fontSize: 12,
    lineHeight: 16,
    color: Brand.textSecondary,
  },
  viewAll: {
    fontFamily: InterFonts.semiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Brand.textLink,
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
