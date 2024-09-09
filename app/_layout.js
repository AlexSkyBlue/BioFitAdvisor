import { Stack } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { Logo } from "../components/(common)/Logo";
import { LogOutIcon, UserIcon } from "../components/(common)/Icons";
import { Link } from "expo-router";
import { Pressable } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import ExerciseDetail from "./exercise/[exercise]";

export default function RootLayout() {
  return (
    <View className="flex-1">
      {/* Este Stack asegura que todas las pantallas tengan un header */}
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#000" },
          headerTintColor: "white",
          headerTitle: "",
          headerLeft: () => <Logo />,
          headerRight: () => (
            <View className="flex-row justify-center items-center gap-x-2">
              <Link asChild href="/auth/loginScreen">
                <Pressable>
                  <LogOutIcon />
                </Pressable>
              </Link>
            </View>
          ),
        }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}
