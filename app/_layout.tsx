import React from 'react';
import { Stack } from "expo-router";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Logo } from "../components/(common)/Logo";
import { ArrowLeftIcon, LogOutIcon, UserIcon } from "../components/(common)/Icons";
import { Link } from "expo-router";
import { Pressable } from "react-native";

export default function RootLayout() {
  return (
    <View style={styles.container}>
      {/* Este Stack asegura que todas las pantallas tengan un header */}
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#000" },
          headerTintColor: "white",
          headerTitle: "",
          headerLeft: () => <Logo />,
          headerRight: () => (
            <View style={styles.headerRight}>
              <Link asChild href="/profile">
                <Pressable>
                  <UserIcon />
                </Pressable>
              </Link>
            </View>
          ),
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={({ navigation }) => ({
            headerShown: true,
            title: 'Detalle del Ejercicio',
            headerBackTitleVisible: false, // Ocultamos el texto predeterminado de "volver"
            headerTitleAlign: 'center',
            headerLeft: () => (
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <ArrowLeftIcon size={24} color="white" />
                <Text style={styles.backButtonText}>Volver</Text>
              </TouchableOpacity>
            ),
          })} />
        <Stack.Screen
          name="exercise/[exercise]"
          options={({ navigation }) => ({
            headerShown: true,
            title: 'Detalle del Ejercicio',
            headerBackTitleVisible: false, // Ocultamos el texto predeterminado de "volver"
            headerTitleAlign: 'center',
            headerLeft: () => (
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <ArrowLeftIcon size={24} color="white" />
                <Text style={styles.backButtonText}>Volver</Text>
              </TouchableOpacity>
            ),
          })}
        />

      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  backButtonText: {
    color: '#fff',
    paddingLeft: 5,
    fontSize: 16,  // Tamaño de fuente ajustado
  },
});