import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Link } from 'expo-router';

export default function Configuation() {
  const navigation = useNavigation(); // Obtén acceso a la navegación

  return (
    <View className="flex-1 bg-[#fff]">
      {/* Información del perfil */}
      <View className="items-center flex-row space-x-10 m-auto py-5">
        <Image
          source={{ uri: 'https://www.w3schools.com/w3images/avatar2.png' }}
          className="w-24 h-24 rounded-full"
        />
        <View className="flex-col">
          <Text className="text-black text-2xl font-bold mt-2">Richard Jones</Text>
          <Text className="text-gray-500 text-base">Hombre, 28 años</Text>
          <TouchableOpacity>
            <Text className="text-[#610588] text-base mt-1">Editar Perfil</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 30, paddingVertical: 20 }}>
        {/* Configuraciones */}
        <TouchableOpacity
          className="flex-row items-center mb-5"
          onPress={() => navigation.navigate('configuration')} // Usa navigation.navigate
        >
          <FontAwesome5 name="cog" size={20} color="black" />
          <Text className="ml-4 text-lg text-black">Configuraciones</Text>
        </TouchableOpacity>

        {/* Cerrar Sesión */}
        <Link href="/auth/loginScreen">
        <TouchableOpacity
          className="flex-row items-center mb-5"
        >
          <FontAwesome5 name="sign-out-alt" size={20} color="black" />
          <Text className="ml-4 text-lg text-black">Cerrar Sesión</Text>
        </TouchableOpacity>
        </Link>
        
      </ScrollView>
    </View>
  );
}
