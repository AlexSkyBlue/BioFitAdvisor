import React from "react";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image, View } from "react-native";
import "nativewind";
import Input from "../../components/(common)/Input";
import { Text, TouchableOpacity } from "react-native";

export default function LoginScreen() {
  return (
    <SafeAreaView edges={{ top: "maximum", bottom: "maximum" }}>
      <View className="justify-center items-center px-4 bg-[#fff]">
        {/* Imagen en la esquina superior cubriendo todo el ancho */}
        <View className="absolute top-0 right-0 left-0">
          <Image
            source={require("../../assets/image/login_banner.png")}
            style={{ width: "100%", height: 300, resizeMode: "cover" }}
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

        <Text className="text-2xl font-bold mt-[30vh] mb-10 text-black border-b-2 border-[purple] px-3 pb-1">
          Inicio de Sesión
        </Text>

        <Input iconName={"user"} placeholder={"Usuario"} />
        <Input iconName={"lock"} placeholder={"Contraseña"} />

        <Link asChild href="/(tabs)/dashboard">
          <TouchableOpacity className="bg-fuchsia-600 p-4 rounded-full mt-4 w-full items-center">
            <Text className="text-white font-bold text-base">
              Iniciar Sesión
            </Text>
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
          style={{ width: 50, height: "auto", resizeMode: "contain" }}
        />
      </View>
    </SafeAreaView>
  );
}
