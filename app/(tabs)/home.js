import React from 'react';
import { View, Text, FlatList, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';

export default function Dashboard() {
  const screenWidth = Dimensions.get("window").width;

  // Datos de las tarjetas
  const cardsData = [
    { id: '1', title: '10 Exercises', subtitle: '1 hour 50 minutes', value: '5/10' },
    { id: '2', title: '6 Meals', subtitle: '1604.0 cal', value: '4/6' },
    { id: '3', title: 'Sleep', subtitle: '8 hours', value: 'Zzz' },
  ];

  const chartData = {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"],
    datasets: [
      { data: [20, 45, 28, 80, 99, 43], strokeWidth: 2, color: (opacity = 1) => `rgba(97, 5, 136, ${opacity})` }
    ]
  };

  const chartConfig = {
    backgroundColor: "#181d1f",
    backgroundGradientFrom: "#181d1f",
    backgroundGradientTo: "#181d1f",
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: { borderRadius: 16 }
  };

  // Render de las tarjetas con efecto gradiente
  const renderCard = ({ item }) => (
    <LinearGradient
      colors={['#610588', '#E879F9', '#ff85f3']} // Gradiente de color más extendido
      start={[0.2, 0]} // Empieza el gradiente desde la esquina superior izquierda
      end={[1, 2]} // Termina el gradiente en la parte inferior
      style={{
        borderRadius: 20,
        paddingHorizontal: 10,
        marginRight: 15,
        width: screenWidth * 0.35,
        height: 80,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
      }}
    >
      <Text className="text-white font-bold text-base">{item.title}</Text>
      <Text className="text-gray-300 text-sm">{item.subtitle}</Text>
      <Text className="text-white text-sm font-bold">{item.value}</Text>
    </LinearGradient>
  );

  return (
    <View className="flex-1 bg-[#000] p-5">
      <Text className="text-white text-2xl font-bold mb-3">Dashboard</Text>

      <View style={{ height: 80 }}>
        <FlatList
          data={cardsData}
          keyExtractor={item => item.id}
          renderItem={renderCard}
          horizontal
          contentContainerStyle={{ paddingHorizontal: 5 }}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View className="my-5">
        <Text className="text-white text-lg font-bold">Statistics - Last Month</Text>
        <LineChart
          data={chartData}
          width={screenWidth - 30}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={{ borderRadius: 16}}
        />
      </View>
    </View>
  );
}
