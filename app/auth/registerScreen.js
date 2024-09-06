import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Link } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";
import "nativewind";
import Input from "../../components/(common)/Input";

export default function RegisterScreen() {
  return (
    <SafeAreaView className="flex-1 justify-center items-center px-4 bg-black">
      <ScrollView
        className="w-full"
        contentContainerStyle={{ alignItems: "center" }}>
        <Text className="text-2xl font-bold mb-4 text-white">Registro</Text>

        {/* Campo para Peso */}
        <View className="w-full mb-4">
          <Text className="text-white/90 mb-2">Peso (kg)</Text>
          <Input
            iconName={"balance-scale"}
            iconClass="mx-1"
            placeholder={"Ingrese su peso"}
          />
        </View>

        {/* Campo para Altura */}
        <View className="w-full mb-4">
          <Text className="text-white/90 mb-2">Altura (cm)</Text>
          <Input iconName={"arrows-v"} placeholder={"Ingrese su altura"} />
        </View>

        {/* Campo para Composición Corporal */}
        <View className="w-full mb-4">
          <Text className="text-white/90 mb-2">Composición Corporal</Text>
          <Input
            iconName={"child"}
            placeholder={"Ingrese su composición corporal"}
          />
        </View>

        {/* Campo para Objetivos de Entrenamiento */}
        <View className="w-full mb-4">
          <Text className="text-white/90 mb-2">Objetivos de Entrenamiento</Text>
          <Input
            iconName={"bullseye"}
            placeholder={"Ingrese sus objetivos de entrenamiento"}
          />
        </View>

        {/* Campo para Tiempo Disponible para Entrenar */}
        <View className="w-full mb-4">
          <Text className="text-white/90 mb-2">
            Tiempo Disponible para Entrenar (horas)
          </Text>
          <Input
            iconName={"clock-o"}
            placeholder={"Ingrese el tiempo disponible por día"}
          />
        </View>

        {/* Campo para Días de Entrenamiento por Semana */}
        <View className="w-full mb-4">
          <Text className="text-white/90 mb-2">
            Días de Entrenamiento por Semana
          </Text>
          <Input
            iconName={"calendar"}
            placeholder={"Ingrese los días de entrenamiento por semana"}
          />
        </View>

        {/* Campo para Nivel de Experiencia */}
        <View className="w-full mb-4">
          <Text className="text-white/90 mb-2">Nivel de Experiencia</Text>
          <Input
            iconName={"line-chart"}
            placeholder={"Ingrese su nivel de experiencia"}
          />
        </View>

        {/* Campo para Restricciones Físicas o Lesiones */}
        <View className="w-full mb-4">
          <Text className="text-white/90 mb-2">
            Restricciones Físicas o Lesiones
          </Text>
          <Input
            iconName={"medkit"}
            placeholder={"Ingrese restricciones físicas o lesiones"}
          />
        </View>

        {/* Botón de Registro */}
        <TouchableOpacity className="bg-fuchsia-600 p-4 rounded-full mt-4 w-full items-center">
          <Text className="text-white font-bold text-base">Registrar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
