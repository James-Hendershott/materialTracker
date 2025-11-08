import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function Layout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Materials' }} />
        <Stack.Screen name="add" options={{ title: 'Add Material' }} />
        <Stack.Screen name="detail" options={{ title: 'Material Detail' }} />
        <Stack.Screen name="search" options={{ title: 'Search' }} />
      </Stack>
    </>
  );
}
