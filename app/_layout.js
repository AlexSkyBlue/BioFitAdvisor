// app/_layout.js
import { Stack } from "expo-router";
import { View } from "react-native";
import { Logo } from "../components/(common)/Logo";
import { CircleInfoIcon, UserIcon } from "../components/(common)/Icons";
import { Link, Slot } from "expo-router";
import { Pressable } from "react-native";

export default function RootLayout() {
  return (
    <View className="flex-1">
      {/* Este Stack asegura que todas las pantallas tengan un header */}
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "black" },
          headerTintColor: "white",
          headerTitle: "",
          headerLeft: () => <Logo />,
          headerRight: () => (
            <View className="flex-row justify-center items-center gap-x-2">
              <Link asChild href="/about">
                <Pressable>
                  <CircleInfoIcon />
                </Pressable>
              </Link>
              <Link asChild href="/auth/loginScreen">
                <Pressable>
                  <UserIcon />
                </Pressable>
              </Link>
            </View>
          ),
        }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}
