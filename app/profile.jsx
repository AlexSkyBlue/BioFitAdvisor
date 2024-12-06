import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  StyleSheet,
} from "react-native";
import { AntDesign, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import StorageService from "../lib/StorageService";
import Input from "../components/(common)/Input";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";

export default function Configuration() {
  const [UserData, setUserData] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [status, setStatus] = useState({}); // Para manejar estados de validación
  const navigation = useNavigation(); // Obtén acceso a la navegación

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await StorageService.getData("UserData");
        if (data) {
          const profilePicture = `https://res.cloudinary.com/dmyzxqw3k/image/upload/v1/Users_MutaApp/${data.userId}_profile`;
          const response = await fetch(profilePicture);
          if (response.ok) {
            setUserData({ ...data, profilePicture });
          } else {
            setUserData(data);
          }
        }
      } catch (error) {
        console.error("Error fetching UserData:", error);
      }
    };
    fetchUserData();
  }, []);

  const uploadProfilePicture = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permisos requeridos", "Se necesita acceso a la galería.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const { uri } = result.assets[0];
        const publicId = `Users_MutaApp/${UserData.userId}_profile`;

        // Crear FormData para subir la imagen
        const formData = new FormData();
        formData.append("file", {
          uri,
          type: "image/jpg",
          name: `${UserData.userId}_profile.jpg`,
        });
        formData.append("upload_preset", "ml_default"); // Preset sin firma configurado
        formData.append("public_id", publicId); // Sobrescribir imagen existente

        // Subir imagen a Cloudinary
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/dmyzxqw3k/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        console.log("data",data)
        if (data.secure_url) {
          // Actualizar UserData con la nueva URL
          const updatedUserData = {
            ...UserData,
            profilePicture: `${data.secure_url}?v=${new Date().getTime()}`, // Invalidar caché
          };
          setUserData(updatedUserData);
          await StorageService.saveData("UserData", updatedUserData);
          Alert.alert("Éxito", "Imagen de perfil actualizada correctamente.");
        } else {
          throw new Error(
            data.error?.message || "No se pudo obtener la URL de la imagen."
          );
        }
      }
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      Alert.alert("Error", "No se pudo subir la imagen.");
    }
  };

  const validateFields = () => {
    let errors = {};
    if (!newPassword || newPassword.length < 6) {
      errors.newPassword = "warning";
      Alert.alert(
        "Revise su contraseña nueva",
        "Debe tener al menos 6 caracteres."
      );
    }
    if (!confirmNewPassword || confirmNewPassword.length < 6) {
      errors.confirmNewPassword = "warning";
      Alert.alert(
        "Revise la confirmación de su contraseña nueva",
        "Debe tener al menos 6 caracteres."
      );
    }
    if (newPassword !== confirmNewPassword) {
      errors.confirmNewPassword = "error";
      Alert.alert(
        "Error de confirmación",
        "La confirmación debe coincidir con la nueva contraseña."
      );
    }
    setStatus(errors);
    return Object.keys(errors).length === 0; // Retorna true si no hay errores
  };
  
  const updatePassword = async () => {
    // Detén la ejecución si la validación falla
    if (!validateFields()) {
      return;
    }
  
    try {
      const userUpdate = {
        ...UserData.userInformation,
        password: newPassword, // Actualizar contraseña
      };
  
      const response = await fetch("https://fitai.cl/api/User/UpsertUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accesstoken: UserData.token, // Token de autenticación
        },
        body: JSON.stringify(userUpdate),
      });
  
      if (response.ok) {
        Alert.alert("Éxito", "La contraseña ha sido actualizada.");
        setNewPassword("");
        setConfirmNewPassword("");
        setShowPasswordModal(false);
      } else {
        Alert.alert("Error", "No se pudo actualizar la contraseña.");
      }
    } catch (error) {
      console.error("Error actualizando contraseña:", error);
      Alert.alert("Error", "Ocurrió un problema al actualizar la contraseña.");
    }
  };
  

  return (
    <View className="flex-1 bg-[#fff]">
      {/* Información del perfil */}
      <View className="items-center flex-row space-x-10 m-auto py-5">
        <TouchableOpacity style={{width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: "#E91E63", justifyContent: "center", alignItems: "center"}} onPress={uploadProfilePicture}>
            <Image
              source={{
                uri: UserData?.profilePicture || "https://www.w3schools.com/w3images/avatar2.png",
              }}
              className="w-24 h-24 rounded-full"
            />
        </TouchableOpacity>
        <View className="flex-col">
          <Text className="text-black text-2xl font-bold mt-2">
            {UserData?.userName || "Nombre no disponible"}
          </Text>
          <Text className="text-gray-500 text-base">
            {UserData
              ? `${
                  UserData.userInformation.sex === "Female" ? "Mujer" : "Hombre"
                }, ${
                  new Date().getFullYear() -
                  UserData.userInformation.birthdate.split("T")[0].split("-")[0]
                } años`
              : "Datos no disponibles"}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 30, paddingVertical: 20 }}
      >
        <TouchableOpacity
          className="flex-row items-center border-[1px] rounded-2xl border-[#610588] p-2 py-3 mb-2"
          style={styles.buttonProfile}
          onPress={() => setShowPasswordModal(true)}
        >
          <FontAwesome5 name="user-lock" style={{marginHorizontal: 12, marginVertical: 4.5 }} size={24} color="white" />
          <Text className="text-lg text-black" style={styles.buttonTextModal}>Cambiar Contraseña</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center border-[1px] rounded-2xl border-[#610588] p-2 py-3 mb-2"
          style={styles.buttonProfile}
          onPress={() => {
            router.push({
              pathname: "/exercise/generateExercisePlan",
              params: {
                token: UserData.token,
                identifier: UserData.email,
              },
            });
          }}
        >
          <MaterialCommunityIcons name="calendar-refresh" style={{marginHorizontal: 10}} size={34} color="white" />
          <Text className="text-lg text-black" style={styles.buttonTextModal}>Generar Nuevo Plan de Ejercicios</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal para cambiar contraseña */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showPasswordModal}
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Cambiar Contraseña</Text>
            <View className="w-full">
              <Input
                iconName="lock"
                placeholder="Nueva contraseña"
                value={newPassword}
                onChangeText={setNewPassword}
                status={status.newPassword}
                secureTextEntryIconToggle={true}
                secureTextEntry
              />
            </View>
            <View className="w-full">
              <Input
                iconName="lock"
                placeholder="Confirmar nueva contraseña"
                value={confirmNewPassword}
                onChangeText={setConfirmNewPassword}
                status={status.confirmNewPassword}
                secureTextEntry
              />
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.buttonModal}
                onPress={updatePassword}
              >
                <Text style={styles.buttonTextModal}>Actualizar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonCancelModal}
                onPress={() => setShowPasswordModal(false)}
              >
                <Text style={styles.buttonTextCancelModal}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonProfile: {
    backgroundColor: "#610588",
    paddingVertical: 7,
    paddingHorizontal: 7, // Un poco más de espacio horizontal para los botones
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "left",
    flex: 1,
    marginHorizontal: 5,
  },
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
    paddingVertical: 7,
    paddingHorizontal: 7, // Un poco más de espacio horizontal para los botones
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "left",
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
    paddingVertical: 7,
    paddingHorizontal: 7,
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
