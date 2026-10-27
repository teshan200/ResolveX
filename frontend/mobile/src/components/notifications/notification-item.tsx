import { Image } from 'expo-image';
import type { ImageSource } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Brand, InterFonts, Spacing } from '@/constants/theme';
import type { Notification, NotificationKind } from '@/types/notification';
import { formatNotificationTime } from '@/utils/notifications';

const KIND_STYLE: Record<NotificationKind, { icon: ImageSource; background: string }> = {
  slaWarning: { icon: require('@/assets/images/alerts/timer.svg'), background: '#fffbeb' },
  escalated: { icon: require('@/assets/images/alerts/escalate.svg'), background: '#fef2f2' },
  assigned: { icon: require('@/assets/images/alerts/ticket.svg'), background: '#f5f3ff' },
  resolved: { icon: require('@/assets/images/alerts/check-circle.svg'), background: '#f0fdf4' },
};

type NotificationItemProps = {
  notification: Notification;
  onPress: (notification: Notification) => void;
  /** Hides the bottom divider on the last row of a group. */
  isLast?: boolean;
};

export function NotificationItem({ notification, onPress, isLast = false }: NotificationItemProps) {
  const { icon, background } = KIND_STYLE[notification.kind];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${notification.read ? '' : 'Unread. '}${notification.title}. ${notification.message}`}
      accessibilityHint={notification.read ? undefined : 'Marks this notification as read'}
      onPress={() => onPress(notification)}
      style={[styles.row, !notification.read && styles.rowUnread, !isLast && styles.rowDivider]}>
      <View style={[styles.iconWrap, { backgroundColor: background }]}>
        <Image source={icon} style={styles.icon} contentFit="contain" />
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{notification.title}</Text>
        <Text style={styles.message}>{notification.message}</Text>
        <Text style={styles.time}>{formatNotificationTime(notification.createdAt)}</Text>
      </View>
      {!notification.read && (
        <Image
          source={require('@/assets/images/alerts/unread-dot.svg')}
          style={styles.dot}
          contentFit="contain"
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    backgroundColor: Brand.bgSurface,
  },
  rowUnread: {
    backgroundColor: Brand.bgBrandSubtle,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Brand.borderSubtle,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 18,
    height: 18,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: InterFonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
    color: Brand.textPrimary,
  },
  message: {
    fontFamily: InterFonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: Brand.textSecondary,
  },
  time: {
    fontFamily: InterFonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: Brand.textTertiary,
  },
  dot: {
    width: 8,
    height: 8,
    marginTop: 6,
  },
});
