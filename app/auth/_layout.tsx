// app/auth/_layout.js
import React from 'react';
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Oculta el encabezado en las pantallas de autenticación
      }}
    />
  );
}
