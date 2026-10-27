import type { ImageSource } from 'expo-image';

export type TabRouteName = 'home' | 'tickets' | 'alerts' | 'profile';

export type TabItem = {
  /** Route file name inside src/app/(tabs). */
  name: TabRouteName;
  label: string;
  icon: ImageSource;
  activeIcon: ImageSource;
};

// Order, labels and icons follow the Figma "Bottom Nav" component.
export const TAB_ITEMS: readonly TabItem[] = [
  {
    name: 'home',
    label: 'Home',
    icon: require('@/assets/images/bottom-nav/home.svg'),
    activeIcon: require('@/assets/images/bottom-nav/home-active.svg'),
  },
  {
    name: 'tickets',
    label: 'Tickets',
    icon: require('@/assets/images/bottom-nav/tickets.svg'),
    activeIcon: require('@/assets/images/bottom-nav/tickets-active.svg'),
  },
  {
    name: 'alerts',
    label: 'Alerts',
    icon: require('@/assets/images/bottom-nav/alerts.svg'),
    activeIcon: require('@/assets/images/bottom-nav/alerts-active.svg'),
  },
  {
    name: 'profile',
    label: 'Profile',
    icon: require('@/assets/images/bottom-nav/profile.svg'),
    activeIcon: require('@/assets/images/bottom-nav/profile-active.svg'),
  },
];
