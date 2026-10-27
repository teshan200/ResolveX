import { Stack } from 'expo-router';

// Keeps ticket sub-screens (such as "Update progress") inside the Tickets tab, so the shared
// bottom navigation stays visible with Tickets active, and Back returns to the list.
export default function TicketsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="[id]/claim"
        options={{ presentation: 'transparentModal', animation: 'slide_from_bottom' }}
      />
    </Stack>
  );
}
