import React from "react";
import { Link } from "expo-router";
import { SafeAreaView, Image, View } from "react-native";
import "nativewind";
import Input from "../../components/(common)/Input";
import { Text, TouchableOpacity } from "react-native";

export default function LoginScreen() {
  return (
    <SafeAreaView className="flex-1 justify-center items-center px-4 bg-[#c7c7c7]">
      {/* Imagen en la esquina superior derecha */}
      <View className="absolute top-0 right-0">
        <Image
          source={require("../../assets/image/login_banner.png")}
          style={{ width: 400, height: 300, resizeMode: 'contain' }}
        />
        {/* Línea diagonal morada */}
        <View
          style={{
            position: "absolute",
            top: 150,
            left: -100,
            width: 550,
            height: 15,
            backgroundColor: "purple",
            transform: [{ rotate: "24deg" }],
          }}
        />
      </View>

      <Text className="text-2xl font-bold mt-36 mb-10 text-black border-b-2 border-[purple] px-3 pb-1">
        Inicio de Sesión
      </Text>

      <Input iconName={"user"} placeholder={"Usuario"} />
      <Input iconName={"lock"} placeholder={"Contraseña"} />

      <Link asChild href="/(tabs)/dashboard">
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
      <Image
          source={require("../../assets/image/LOGO_MT_1.png")}
          style={{ width: 50, height: 'auto', resizeMode: 'contain' }}
        />
    </SafeAreaView>
  );
}
