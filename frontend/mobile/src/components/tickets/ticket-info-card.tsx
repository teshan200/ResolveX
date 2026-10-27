import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Brand, InterFonts, Radius, Spacing } from '@/constants/theme';
import type { TicketGuest } from '@/types/ticket';

type TicketInfoCardProps = {
  title: string;
  description: string;
  category?: string;
  guest?: TicketGuest;
};

export function TicketInfoCard({ title, description, category, guest }: TicketInfoCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{title}</Text>
        {category ? (
          <View style={styles.tag}>
            <Image
              source={require('@/assets/images/tickets/detail-tag-utensils.svg')}
              style={styles.tagIcon}
              contentFit="contain"
            />
            <Text style={styles.tagText}>{category}</Text>
          </View>
        ) : null}
      </View>
      {description !== '' && (
        <View style={styles.quote}>
          <Text style={styles.quoteText}>{description}</Text>
        </View>
      )}
      {guest && (
        <View style={styles.guest}>
          <Image
            source={require('@/assets/images/tickets/detail-guest.svg')}
            style={styles.guestIcon}
            contentFit="contain"
          />
          <Text style={styles.guestText}>
            {guest.name} · {guest.notification}
          </Text>
          {guest.photoCount > 0 && (
            <>
              <Image
                source={require('@/assets/images/tickets/detail-photo.svg')}
                style={styles.guestIcon}
                contentFit="contain"
              />
              <Text style={styles.photoText}>
                {guest.photoCount} {guest.photoCount === 1 ? 'photo' : 'photos'}
              </Text>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
    padding: 16,
    backgroundColor: Brand.bgSurface,
    borderWidth: 1,
    borderColor: Brand.borderSubtle,
    borderRadius: Radius.xl,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  title: {
    flexShrink: 1,
    fontFamily: InterFonts.semiBold,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.05,
    color: Brand.textPrimary,
  },
  tag: {
    height: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    backgroundColor: Brand.bgBrandSubtle,
    borderRadius: Radius.xs,
  },
  tagIcon: {
    width: 12,
    height: 12,
  },
  tagText: {
    fontFamily: InterFonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: Brand.textBrand,
  },
  quote: {
    padding: 12,
    backgroundColor: Brand.bgCanvas,
    borderRadius: Radius.md,
  },
  quoteText: {
    fontFamily: InterFonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: Brand.textSecondary,
  },
  guest: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  guestIcon: {
    width: 14,
    height: 14,
  },
  guestText: {
    flex: 1,
    fontFamily: InterFonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: Brand.textSecondary,
  },
  photoText: {
    fontFamily: InterFonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: Brand.textSecondary,
  },
});
