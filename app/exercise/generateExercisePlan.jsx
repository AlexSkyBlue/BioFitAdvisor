import React, { useEffect, useState } from "react";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Alert,
  Modal,
} from "react-native";
import StorageService from "../../lib/StorageService";
import { useRouter } from "expo-router";

export default function GenerateExercisePlan() {
  const [exerciseLimitations, setExerciseLimitations] = useState("");
  const [nutritionLimitations, setNutritionLimitations] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [UserData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const obtenerUserData = async () => {
      try {
        const data = await StorageService.getData("UserData");
        if (data) {
          setUserData(data);
          console.log("UserData obtenido:", data);
        } else {
          Alert.alert(
            "Error",
            "No se ha podido obtener los datos del usuario de manera correcta."
          );
          router.push("/auth/loginScreen"); // Redirigir al login si no hay datos
        }
      } catch (error) {
        console.log("Error al obtener UserData:", error);
        Alert.alert(
          "Error",
          "Ocurrió un error al obtener los datos del usuario."
        );
      } finally {
        setIsLoading(false);
      }
    };

    obtenerUserData();
  }, []);

  if (isLoading) {
    // Puedes mostrar un indicador de carga aquí
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (!UserData) {
    // Si después de cargar, UserData sigue siendo null, muestra el error
    Alert.alert(
      "Error",
      "No se ha podido obtener los datos del usuario de manera correcta."
    );
    return null; // O puedes redirigir al usuario
  }

  const handleSubmit = () => {
    if (!UserData) {
      Alert.alert(
        "Error",
        "No se ha podido obtener los datos del usuario de manera correcta."
      );
      return;
    }

    // Generar el texto de las limitaciones
    const story = `Tengo limitaciones al hacer ejercicio por enfermedad/es como ${exerciseLimitations}. También tengo limitaciones en mi nutrición por alergias como ${nutritionLimitations}.`;

    // Crear el objeto del plan sin el userId
    const plan = {
      planId: 0,
      userId: 0,
      name: "Entrenamiento para pérdida de peso",
      language: "español",
      description:
        "Este plan de entrenamiento está diseñado para una persona de 1.85 m y 100 kg, con el objetivo de alcanzar un peso ideal mediante ejercicios de fuerza, resistencia y cardiovasculares.",
      status: true,
      numberOfWeeks: 12,
      exercises: [
        {
          exerciseId: 1,
          planId: 1,
          dayNumber: 1,
          exerciseIdentifier: "Saltos de tijera (Jumping Jacks)",
          exerciseSubIdentifier: "Peso corporal",
          duration: 2,
          repetitions: 20,
          sets: 3,
          weightPercentage: "0%",
        },
        {
          exerciseId: 2,
          planId: 1,
          dayNumber: 1,
          exerciseIdentifier: "Sentadillas (Squats)",
          exerciseSubIdentifier: "Barra o mancuernas",
          duration: 0,
          repetitions: 12,
          sets: 4,
          weightPercentage: "70%",
        },
        {
          exerciseId: 3,
          planId: 1,
          dayNumber: 1,
          exerciseIdentifier: "Prensa de pierna (Leg Press)",
          exerciseSubIdentifier: "Máquina de prensa",
          duration: 0,
          repetitions: 15,
          sets: 3,
          weightPercentage: "80%",
        },
        {
          exerciseId: 4,
          planId: 1,
          dayNumber: 3,
          exerciseIdentifier: "Peso muerto (Deadlifts)",
          exerciseSubIdentifier: "Barra",
          duration: 0,
          repetitions: 8,
          sets: 4,
          weightPercentage: "80%",
        },
        {
          exerciseId: 5,
          planId: 1,
          dayNumber: 3,
          exerciseIdentifier: "Zancadas (Lunges)",
          exerciseSubIdentifier: "Mancuernas",
          duration: 0,
          repetitions: 12,
          sets: 3,
          weightPercentage: "70%",
        },
        {
          exerciseId: 6,
          planId: 1,
          dayNumber: 5,
          exerciseIdentifier: "Burpees",
          exerciseSubIdentifier: "Peso corporal",
          duration: 1,
          repetitions: 12,
          sets: 3,
          weightPercentage: "0%",
        },
        {
          exerciseId: 7,
          planId: 1,
          dayNumber: 5,
          exerciseIdentifier: "Dominadas (Pull-ups)",
          exerciseSubIdentifier: "Barra de dominadas",
          duration: 0,
          repetitions: 5,
          sets: 4,
          weightPercentage: "70%",
        },
        {
          exerciseId: 8,
          planId: 1,
          dayNumber: 5,
          exerciseIdentifier: "Elevación de talones (Calf Raises)",
          exerciseSubIdentifier: "Mancuernas o peso corporal",
          duration: 0,
          repetitions: 20,
          sets: 3,
          weightPercentage: "50%",
        },
      ],
      recommendation: {
        recommendationId: 1,
        planId: 1,
        recommendation:
          "Se recomienda combinar estos ejercicios con actividades cardiovasculares diarias como caminar, correr o bicicleta para aumentar el gasto calórico. Mantenerse hidratado y descansar entre 7-8 horas por noche.",
      },
      nutritionalAdvice: {
        adviceId: 1,
        planId: 1,
        protein: "150-180g diarios",
        carbohidratos:
          "300-350g diarios (en su mayoría carbohidratos complejos)",
        fat: "60-80g diarios (grasas saludables)",
        hydration: "2.5-3 litros diarios",
        supplements: "Multivitamínico, omega-3, proteína en polvo (opcional)",
      },
      precautions: {
        precautionId: 1,
        planId: 1,
        precaution:
          "Si experimentas dolor en las articulaciones o fatiga extrema, reduce la intensidad de los ejercicios. Consulta a un profesional si el dolor persiste.",
      },
    };

    // Enviar el plan al endpoint
    axios
      .post("https://fitai.cl/api/TrainingPlan/UpsertPlan", plan, {
        headers: {
          "Content-Type": "application/json",
          accesstoken: UserData.token,
        },
      })
      .then(async (planResponse) => {
        UserData.planId = planResponse.data;
        console.log("Datos del Usuario actualizados:", UserData);

        await StorageService.saveData("UserData", UserData);
        setShowModal(true); // Mostrar el modal
      })
      .catch((error) => {
        console.log("Error al generar el plan:", error);
        Alert.alert("Error", "Hubo un problema al generar el plan");
      });
  };

  return (
    <SafeAreaView
      edges={{ top: "maximum", bottom: "maximum" }}
      style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                paddingHorizontal: 16,
                backgroundColor: "#fff",
              }}>
              <Text style={styles.title}>Generar Plan de Ejercicio</Text>
              <Text style={styles.label}>
                Tengo limitaciones al hacer ejercicio por enfermedad/es como...
              </Text>
              <TextInput
                style={styles.textInput}
                multiline
                numberOfLines={7}
                value={exerciseLimitations}
                onChangeText={setExerciseLimitations}
                placeholder="Escribe tus limitaciones al hacer ejercicio"
              />
              <Text style={styles.label}>
                También tengo limitaciones en mi nutrición por alergias como...
              </Text>
              <TextInput
                style={styles.textInput}
                multiline
                numberOfLines={7}
                value={nutritionLimitations}
                onChangeText={setNutritionLimitations}
                placeholder="Escribe tus alergias o limitaciones en la dieta"
              />
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Generar Plan</Text>
              </TouchableOpacity>

              {/* Modal de confirmación */}
              <Modal
                animationType="slide"
                transparent={true}
                visible={showModal}
                onRequestClose={() => setShowModal(false)}>
                <View style={styles.modalOverlay}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>
                      El plan ha sido generado con éxito
                    </Text>
                    <TouchableOpacity
                      style={styles.buttonModal}
                      onPress={() => {
                        setShowModal(false);
                        router.push("/(tabs)/dashboard");
                      }}>
                      <Text style={styles.buttonTextModal}>Aceptar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

              {/* Logo al fondo */}
              <View style={styles.logoContainer}>
                <Image
                  source={require("../../assets/image/LOGO_MT_1.png")}
                  style={styles.logo}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 50,
    marginBottom: 15,
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    borderBottomWidth: 2,
    borderBottomColor: "purple",
    paddingBottom: 5,
    textAlign: "center",
  },
  label: {
    width: "100%",
    fontSize: 16,
    textAlign: "justify",
    marginBottom: 10,
    color: "black",
  },
  textInput: {
    width: "100%",
    minHeight: 100,
    borderColor: "#8B5CF6",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#E91E63",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  logoContainer: {
    marginTop: "auto",
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 60,
    height: 70,
    resizeMode: "contain",
  },
  // Estilos para el modal
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // Fondo semitransparente
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonModal: {
    backgroundColor: "#E91E63",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonTextModal: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
