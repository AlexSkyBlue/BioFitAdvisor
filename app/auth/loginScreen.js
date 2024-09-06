// app/auth/loginScreen.js
import React from "react";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import "nativewind";
import Input from "../../components/(common)/Input";
import { Text, TouchableOpacity } from "react-native";

export default function LoginScreen() {
  return (
    <SafeAreaView className="flex-1 justify-center items-center px-4 bg-black">
      <Text className="text-2xl font-bold mb-4 text-white">
        Inicio de Sesión
      </Text>

      <Input iconName={"user"} placeholder={"Usuario"} />
      <Input iconName={"lock"} placeholder={"Contraseña"} />

      <Link asChild href="/(tabs)/home">
        <TouchableOpacity className="bg-fuchsia-600 p-4 rounded-full mt-4 w-full items-center">
          <Text className="text-white font-bold text-base">Iniciar Sesión</Text>
        </TouchableOpacity>
      </Link>

      <Link asChild href="/auth/registerScreen">
        <TouchableOpacity className="mt-4">
          <Text className="text-fuchsia-600 font-bold text-base">
            Registrarse
          </Text>
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
}
