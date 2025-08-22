import ErrorBoundary from "@/components/ErrorBoundary";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import "./globals.css";

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <StatusBar hidden={true} />
      
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(movie)/[id]"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </ErrorBoundary>
  );
}