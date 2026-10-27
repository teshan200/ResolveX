import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CountBadge } from '@/components/count-badge';
import { NotificationItem } from '@/components/notifications/notification-item';
import { Brand, InterFonts, Radius, Spacing } from '@/constants/theme';
import { useNotifications } from '@/hooks/use-notifications';
import { formatBadgeCount, groupNotificationsByDay } from '@/utils/notifications';

const FIGMA_STATUS_BAR_HEIGHT = 44;

type Filter = 'all' | 'unread';

export default function AlertsScreen() {
  const { status, notifications, unreadCount, markAsRead, markAllAsRead, reload } =
    useNotifications();
  const [filter, setFilter] = useState<Filter>('all');

  const groups = useMemo(
    () =>
      groupNotificationsByDay(
        filter === 'unread' ? notifications.filter((item) => !item.read) : notifications,
      ),
    [notifications, filter],
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.appBar}>
        <View style={styles.mark}>
          <Image
            source={require('@/assets/images/alerts/mark.svg')}
            style={styles.markIcon}
            contentFit="contain"
          />
        </View>
        <View style={styles.titles}>
          <Text style={styles.eyebrow}>ResolveX Staff</Text>
          <Text style={styles.title}>Alerts</Text>
        </View>
        <View style={styles.bell}>
          <Image
            source={require('@/assets/images/alerts/bell.svg')}
            style={styles.bellIcon}
            contentFit="contain"
          />
          <CountBadge count={unreadCount} style={styles.bellBadge} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.tabsRow}>
          <View style={styles.tabs}>
            <FilterTab label="All" active={filter === 'all'} onPress={() => setFilter('all')} />
            <FilterTab
              label="Unread"
              count={unreadCount}
              active={filter === 'unread'}
              onPress={() => setFilter('unread')}
            />
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: unreadCount === 0 }}
            disabled={unreadCount === 0}
            onPress={markAllAsRead}
            style={[styles.markAll, unreadCount === 0 && styles.markAllDisabled]}>
            <Image
              source={require('@/assets/images/alerts/check.svg')}
              style={styles.markAllIcon}
              contentFit="contain"
            />
            <Text style={styles.markAllText}>Mark all read</Text>
          </Pressable>
        </View>

        {status === 'loading' || status === 'idle' ? (
          <Message text="Loading notifications…" />
        ) : status === 'error' ? (
          <Message
            text="Couldn’t load notifications."
            actionLabel="Try again"
            onAction={reload}
          />
        ) : groups.length === 0 ? (
          <Message text={filter === 'unread' ? 'You’re all caught up.' : 'No notifications yet.'} />
        ) : (
          groups.map((group) => (
            <View key={group.title} style={styles.group}>
              <Text style={styles.groupTitle}>{group.title}</Text>
              <View style={styles.list}>
                {group.items.map((item, index) => (
                  <NotificationItem
                    key={item.id}
                    notification={item}
                    isLast={index === group.items.length - 1}
                    onPress={(pressed) => {
                      markAsRead(pressed.id);
                      router.push({ pathname: '/tickets/[id]', params: { id: pressed.ticketId } });
                    }}
                  />
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

function FilterTab({
  label,
  count,
  active,
  onPress,
}: {
  label: string;
  count?: number;
  active: boolean;
  onPress: () => void;
}) {
  const countLabel = count === undefined ? null : formatBadgeCount(count);
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={styles.tab}>
      <View style={styles.tabContent}>
        <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
        {countLabel && (
          <View style={[styles.tabCount, active && styles.tabCountActive]}>
            <Text style={[styles.tabCountText, active && styles.tabCountTextActive]}>
              {countLabel}
            </Text>
          </View>
        )}
      </View>
      <View style={[styles.tabIndicator, active && styles.tabIndicatorActive]} />
    </Pressable>
  );
}

function Message({
  text,
  actionLabel,
  onAction,
}: {
  text: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.message}>
      <Text style={styles.messageText}>{text}</Text>
      {actionLabel && (
        <Pressable accessibilityRole="button" onPress={onAction}>
          <Text style={styles.messageAction}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Brand.bgCanvas,
    paddingTop: FIGMA_STATUS_BAR_HEIGHT,
  },
  appBar: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    backgroundColor: Brand.bgSurface,
    borderBottomWidth: 1,
    borderBottomColor: Brand.borderSubtle,
  },
  mark: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Brand.bgBrand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markIcon: {
    width: 20,
    height: 20,
  },
  titles: {
    flex: 1,
  },
  eyebrow: {
    fontFamily: InterFonts.semiBold,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.66,
    textTransform: 'uppercase',
    color: Brand.textBrand,
  },
  title: {
    fontFamily: InterFonts.semiBold,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.05,
    color: Brand.textPrimary,
  },
  bell: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellIcon: {
    width: 20,
    height: 20,
  },
  bellBadge: {
    position: 'absolute',
    top: 6,
    left: 28,
  },
  content: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Brand.borderDefault,
  },
  tabs: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  tab: {
    paddingTop: 12,
    gap: Spacing.two,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.one,
  },
  tabLabel: {
    fontFamily: InterFonts.medium,
    fontSize: 14,
    lineHeight: 20,
    color: Brand.textSecondary,
  },
  tabLabelActive: {
    color: Brand.textBrand,
  },
  tabCount: {
    paddingHorizontal: 6,
    borderRadius: 999,
    backgroundColor: Brand.bgMuted,
  },
  tabCountActive: {
    backgroundColor: Brand.bgBrandMuted,
  },
  tabCountText: {
    fontFamily: InterFonts.semiBold,
    fontSize: 12,
    lineHeight: 16,
    color: Brand.textSecondary,
  },
  tabCountTextActive: {
    color: Brand.textBrand,
  },
  tabIndicator: {
    height: 2,
  },
  tabIndicatorActive: {
    backgroundColor: Brand.bgBrand,
  },
  markAll: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    marginBottom: Spacing.one,
    borderRadius: Radius.md,
  },
  markAllDisabled: {
    opacity: 0.4,
  },
  markAllIcon: {
    width: 16,
    height: 16,
  },
  markAllText: {
    fontFamily: InterFonts.medium,
    fontSize: 13,
    lineHeight: 18,
    color: Brand.textSecondary,
  },
  group: {
    gap: Spacing.two,
  },
  groupTitle: {
    fontFamily: InterFonts.semiBold,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.66,
    textTransform: 'uppercase',
    color: Brand.textTertiary,
  },
  list: {
    borderWidth: 1,
    borderColor: Brand.borderSubtle,
    borderRadius: Radius.xl,
    overflow: 'hidden',
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
