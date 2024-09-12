import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import MenuItem from '../../components/(common)/MenuItem'; // Asegúrate de ajustar la ruta según tu estructura de carpetas

export default function Nutrition() {
  
  const menuItems = [
    { id: '1', title: 'Home', icon: 'home', active: true },
    { id: '2', title: 'Mis Metas', icon: 'flag', active: false },
    { id: '3', title: 'Mis Rutinas', icon: 'calendar', active: false },
    { id: '4', title: 'Logros', icon: 'trophy', active: false },
    { id: '5', title: 'Mi Progreso', icon: 'chart-line', active: false },
    { id: '6', title: 'Configuraciones', icon: 'cog', active: false },
  ];
  
  const renderMenuItem = ({ item }) => (
    <MenuItem title={item.title} icon={item.icon} active={item.active} screen={item.screen} />
  );
  

  return (
    <View className="flex-1 bg-[#000]">
      
      <View className="items-center flex-row space-x-10 m-auto py-5">
        <Image
          source={{ uri: 'https://www.w3schools.com/w3images/avatar2.png' }}
          className="w-24 h-24 rounded-full"
        />
        <View className="flex-col">
        <Text className="text-white text-2xl font-bold mt-2">Richard Jones</Text>
        <Text className="text-gray-400 text-base">Hombre, 28 año</Text>
        <TouchableOpacity>
          <Text className="text-[#E879F9] text-base mt-1">Edit</Text>
        </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row justify-around py-3 space-x-10">
        <View className="items-center">
          <Text className="text-[#56CCF2] text-sm">Altura</Text>
          <Text className="text-white text-2xl">1,85 cm</Text>
          <View 
      className="mt-1 border border-[#E879F9] w-full rounded-full bg-[#1E1E3F]" // Usamos NativeWind para otros estilos
      style={{
        shadowColor: '#d579ff',   // Color de la sombra (neón)
        shadowOffset: { width: 0, height: 0 }, // Sin desplazamiento
        shadowOpacity: 1,         // Opacidad completa para un brillo fuerte
        shadowRadius: 15,         // Mayor difuminado para el efecto neón
        elevation: 20,            // Para Android
      }}
    />
        </View>
        <View className="items-center">
          <Text className="text-[#56CCF2] text-sm">PESO</Text>
          <Text className="text-white text-2xl">76 kg</Text>
          <View 
      className="mt-1 border border-[#E879F9] w-full rounded-full bg-[#1E1E3F]" // Usamos NativeWind para otros estilos
      style={{
        shadowColor: '#d579ff',   // Color de la sombra (neón)
        shadowOffset: { width: 0, height: 0 }, // Sin desplazamiento
        shadowOpacity: 1,         // Opacidad completa para un brillo fuerte
        shadowRadius: 15,         // Mayor difuminado para el efecto neón
        elevation: 20,            // Para Android
      }}
    />
        </View>
      </View>

      <FlatList
        data={menuItems}
        renderItem={renderMenuItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 30, paddingVertical: 20 }}
      />

      <View className="bg-[#56CCF2] p-5 rounded-xl mx-10 mb-10 hidden">
        <Text className="text-white text-lg font-bold text-center">CONGRATULATIONS!</Text>
        <Text className="text-white text-base text-center">You have unlocked the 'Expert' level.</Text>
      </View>
    </View>
  );
}
