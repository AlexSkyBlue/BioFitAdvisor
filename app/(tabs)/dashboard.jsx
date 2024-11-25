import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  ScrollView,
  Alert,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { LinearGradient } from "expo-linear-gradient";
import StorageService from "../../lib/StorageService";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import axios from "axios";
import { useRouter } from "expo-router";

export default function Dashboard() {
  const [UserData, setUserData] = useState(null);
  const [exercisePlan, setExercisePlan] = useState(null); // Para almacenar el plan de ejercicios
  const [showModal, setShowModal] = useState(false); // Estado para mostrar el Modal
  const router = useRouter(); // Hook para redireccionar
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await StorageService.getData("UserData");
        setUserData(userData);
        if (userData) {
          if (userData.planId > 0) {
            await fetchExercisePlan(userData);
          } else {
            setShowModal(true);
          }
        }
      } catch (error) {
        console.error("Error fetching UserData:", error);
      }
    };

    const fetchExercisePlan = async (userData) => {
      console.log("Making API call with token:", userData.token);

      await axios
        .get("https://fitai.cl/api/TrainingPlan/GetPlanById", {
          params: {
            planId: userData.planId,
          },
          headers: {
            "Content-Type": "application/json",
            accesstoken: `${userData.token}`,
          },
        })
        .then(async (response) => {
          console.log("API response", response.data);

          if (response.status === 200) {
            const planData = response.data;
            const updatedUserData = {
              ...userData,
              exercisePlan: planData,
            };
            setUserData(updatedUserData);
            setExercisePlan(planData);
            console.log("updatedUserData", updatedUserData);

            await StorageService.saveData("UserData", updatedUserData);
          } else if (response.status === 401) {
            Alert.alert(
              "Invalid token",
              "The token is not valid or has expired."
            );
          } else {
            console.error(`Unexpected error: ${response.status}`);
            Alert.alert("Error", `HTTP Error: ${response.status}`);
          }
        })
        .catch((error) => {
          if (error.response) {
            console.error("Error response:", error.response);
            console.error("Headers:", error.response.headers);
          } else if (error.request) {
            console.error("Request error:", error.request);
          } else {
            console.error("Axios error:", error.message);
          }
          Alert.alert("Error", "Unable to fetch the exercise plan.");
        });
    };

    fetchUserData();
  }, []);

  // Datos de las tarjetas
  const cardsData = [
    {
      id: "1",
      title: "10 Ejercicios",
      subtitle: "1 hora 50 minutos",
      value: "5/10",
    },
    { id: "2", title: "6 Comidas", subtitle: "1604.0 calorías", value: "4/6" },
    { id: "3", title: "Dormiste", subtitle: "8 horas", value: "Zzz" },
  ];

  const chartData = {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        strokeWidth: 5,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: "#610588",
    backgroundGradientFrom: "#E91E63",
    backgroundGradientTo: "#610588",
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: { borderRadius: 16 },
  };

  // Render de las tarjetas con efecto gradiente
  const renderCard = ({ item }) => (
    <LinearGradient
      colors={["#E91E63", "#610588", "#ff85f3"]}
      start={[0.2, 0]}
      end={[1, 2]}
      style={{
        borderRadius: 20,
        paddingHorizontal: 10,
        marginRight: 15,
        width: screenWidth * 0.35,
        height: 80,
        justifyContent: "center",
      }}>
      <Text className="text-white font-bold text-base">{item.title}</Text>
      <Text className="text-gray-300 text-sm">{item.subtitle}</Text>
      <Text className="text-white text-sm font-bold">{item.value}</Text>
    </LinearGradient>
  );
  console.log("exercisePlan", exercisePlan);
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff", padding: 15 }}>
      <View style={{ height: 80 }}>
        <FlatList
          data={cardsData}
          keyExtractor={(item) => item.id}
          renderItem={renderCard}
          horizontal
          contentContainerStyle={{ paddingHorizontal: 5 }}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View className="my-2.5">
        <Text className="text-black text-lg font-bold">
          Estadísticas de calorías del último mes
        </Text>
        <LineChart
          data={chartData}
          width={screenWidth - 30}
          height={250}
          chartConfig={chartConfig}
          bezier
          style={{ borderRadius: 16 }}
        />
      </View>

      {/* Nutritional Advice Section */}
      {exercisePlan && exercisePlan.nutritionalAdvice && (
        <View className="my-2.5">
          <View className="flex-row pl-3 space-x-3">
            <FontAwesome5 name="carrot" size={24} color="black" />
            <Text className="text-black text-lg text-left font-bold">
              Consejos Nutricionales
            </Text>
          </View>

          <View className="bg-gray-100 p-4 rounded-lg mt-3">
            <Text className="text-black text-base font-semibold">
              Proteínas:
            </Text>
            <Text className="text-black text-sm mb-3">
              {exercisePlan.nutritionalAdvice.protein}
            </Text>

            <Text className="text-black text-base font-semibold">
              Carbohidratos:
            </Text>
            <Text className="text-black text-sm mb-3">
              {exercisePlan.nutritionalAdvice.carbohidratos}
            </Text>

            <Text className="text-black text-base font-semibold">Grasas:</Text>
            <Text className="text-black text-sm mb-3">
              {exercisePlan.nutritionalAdvice.fat}
            </Text>

            <Text className="text-black text-base font-semibold">
              Hidratación:
            </Text>
            <Text className="text-black text-sm mb-3">
              {exercisePlan.nutritionalAdvice.hydration}
            </Text>

            <Text className="text-black text-base font-semibold">
              Suplementos:
            </Text>
            <Text className="text-black text-sm mb-3">
              {exercisePlan.nutritionalAdvice.supplements}
            </Text>
          </View>
        </View>
      )}

      {/* Modal de confirmación */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              ¿Deseas generar el plan de ejercicios ahora?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.buttonModal}
                onPress={() => {
                  setShowModal(false);
                  router.push({
                    pathname: "/exercise/generateExercisePlan",
                    params: {
                      token: UserData.token,
                      identifier: UserData.email,
                    },
                  });
                }}>
                <Text style={styles.buttonTextModal}>Sí</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonCancelModal}
                onPress={() => {
                  setShowModal(false);
                  router.push("/auth/loginScreen");
                }}>
                <Text style={styles.buttonTextCancelModal}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Fondo oscurecido
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20, // Borde redondeado
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold", // Texto en negritas
    textAlign: "center",
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row", // Alineación horizontal de los botones
    justifyContent: "space-between",
    width: "100%",
  },
  buttonModal: {
    backgroundColor: "#E91E63",
    paddingVertical: 10,
    paddingHorizontal: 30, // Un poco más de espacio horizontal para los botones
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  buttonTextModal: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonCancelModal: {
    backgroundColor: "#fff",
    borderColor: "#E91E63",
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  buttonTextCancelModal: {
    color: "#E91E63",
    fontWeight: "bold",
    fontSize: 16,
  },
});
