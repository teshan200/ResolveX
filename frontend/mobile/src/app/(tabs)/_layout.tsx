import { Tabs } from 'expo-router';

import { BottomNav } from '@/components/bottom-nav';
import { TAB_ITEMS } from '@/constants/navigation';

// Shared layout for the authenticated staff screens. Session handling stays in the root layout.
export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <BottomNav {...props} />}>
      {TAB_ITEMS.map((item) => (
        <Tabs.Screen key={item.name} name={item.name} options={{ title: item.label }} />
      ))}
    </Tabs>
  );
}
