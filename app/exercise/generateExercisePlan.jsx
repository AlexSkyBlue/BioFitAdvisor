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
  const [exerciseLimitations, setExerciseLimitations] = useState("Dolor lumbar");
  const [nutritionLimitations, setNutritionLimitations] = useState("Alergía a las algas");
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
    const description = `Tengo limitaciones al hacer ejercicio por enfermedad/es como ${exerciseLimitations}. También tengo limitaciones en mi nutrición por alergias como ${nutritionLimitations}.`;

    // Enviar el plan al endpoint
    axios
      .post(
        "https://fitai.cl/api/Ai/GeneratePlan",
        { description: description },
        {
          headers: {
            "Content-Type": "application/json",
            accesstoken: UserData.token,
          },
        }
      )
      .then(async (planResponse) => {
        console.log("planResponse:", planResponse);
        UserData.planId = planResponse.data.planId;
        UserData.planExercisesDates = null;

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
