import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { TabPlaceholder } from '@/components/tab-placeholder';
import { Brand, InterFonts, Spacing } from '@/constants/theme';
import { useSession } from '@/hooks/use-session';

export default function ProfileScreen() {
  const { signOut } = useSession();

  return (
    <TabPlaceholder title="Profile" message="The profile screen is not built yet.">
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          signOut();
          router.replace('/login');
        }}>
        <Text style={styles.link}>Sign out</Text>
      </Pressable>
    </TabPlaceholder>
  );
}

const styles = StyleSheet.create({
  link: {
    marginTop: Spacing.three,
    fontFamily: InterFonts.medium,
    fontSize: 13,
    color: Brand.textLink,
  },
});
