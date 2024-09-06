import React from "react";
import { View, Text, Dimensions, FlatList } from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";

export function Main() {
  const screenWidth = Dimensions.get("window").width;

  // Configuración de datos para los gráficos
  const chartData = [
    {
      id: "lineChart",
      title: "Gráfico de Líneas",
      type: "line",
      data: {
        labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"],
        datasets: [{ data: [20, 45, 28, 80, 99, 43] }],
      },
    },
    {
      id: "barChart",
      title: "Gráfico de Barras",
      type: "bar",
      data: {
        labels: ["Producto A", "Producto B", "Producto C", "Producto D"],
        datasets: [{ data: [40, 60, 80, 100] }],
      },
    },
    {
      id: "pieChart",
      title: "Gráfico Circular",
      type: "pie",
      data: [
        {
          name: "Producto A",
          population: 40,
          color: "rgba(232, 121, 249, 1)",
          legendFontColor: "#E879F9",
          legendFontSize: 15,
        },
        {
          name: "Producto B",
          population: 60,
          color: "rgba(232, 121, 249, 0.8)",
          legendFontColor: "#E879F9",
          legendFontSize: 15,
        },
        {
          name: "Producto C",
          population: 80,
          color: "rgba(232, 121, 249, 0.6)",
          legendFontColor: "#E879F9",
          legendFontSize: 15,
        },
      ],
    },
  ];

  const chartConfig = {
    backgroundColor: "#000000", // Fondo negro para los gráficos
    backgroundGradientFrom: "#000000",
    backgroundGradientTo: "#000000",
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(232, 121, 249, ${opacity})`, // Color morado para los gráficos
    style: {
      borderRadius: 16,
    },
    labelColor: (opacity = 1) => `rgba(232, 121, 249, ${opacity})`, // Color de las etiquetas
  };

  const renderChart = ({ item }) => {
    return (
      <View className="flex-1 items-center p-5">
        <Text className="text-lg font-bold mb-2 text-white">{item.title}</Text>
        {item.type === "line" && (
          <LineChart
            data={item.data}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{ marginVertical: 8, borderRadius: 16 }}
          />
        )}
        {item.type === "bar" && (
          <BarChart
            data={item.data}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            verticalLabelRotation={30}
            style={{ marginVertical: 8, borderRadius: 16 }}
          />
        )}
        {item.type === "pie" && (
          <PieChart
            data={item.data}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            accessor={"population"}
            backgroundColor={"#000000"} // Fondo negro para el gráfico circular
            paddingLeft={"15"}
            absolute
            style={{ marginVertical: 8, borderRadius: 16 }}
          />
        )}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-black">
      {/* Título del Dashboard */}
      <Text className="text-white text-xl font-bold px-3 border-l-4 border-fuchsia-400">
        Dashboard
      </Text>

      <FlatList
        data={chartData}
        keyExtractor={(item) => item.id}
        renderItem={renderChart}
      />
    </View>
  );
}
