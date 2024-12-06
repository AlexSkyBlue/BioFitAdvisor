import React, { useState } from "react";
import { Link, useRouter } from "expo-router"; // useRouter para redirigir al dashboard
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import Input from "../../components/(common)/Input"; // Input actualizado con estados
import StorageService from "../../lib/StorageService"; // Adjust the path based on your structure

export default function LoginScreen() {
  const [username, setUsername] = useState("AlexParra");
  const [password, setPassword] = useState("alexparra");
  const [errors, setErrors] = useState({ username: false, password: false });
  const [status, setStatus] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    const hasErrors = {
      username: username === "",
      password: password === "",
    };
    setErrors(hasErrors);

    if (hasErrors.username || hasErrors.password) {
      setStatus("warning");
      Alert.alert("Error", "Por favor complete todos los campos");
      return;
    }

    // Llamada a la API
    fetch("https://fitai.cl/api/User/Autentication", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier: username.trim(),
        password: password.trim(),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            // Manejar error de credenciales incorrectas
            Alert.alert(
              "Error",
              "Usuario o contraseña incorrectos. Intente de nuevo."
            );
            setStatus("error");
          } else {
            // Manejar otros errores
            Alert.alert(
              "Error",
              "Hubo un problema al intentar iniciar sesión."
            );
            setStatus("error");
          }
          return null;
        }
        return response.json();
      })
      .then(async (data) => {
        if (data && data.token) {
          // Si el login es exitoso, cambiar a estado success y redirigir al dashboard
          setStatus("success");
          
          console.log(
            "objeto guarado en loginscreen saveData como UserData",
            data
          ); // Muestra el token u otros datos si es necesario
          
          const userResponse = await fetch(`https://fitai.cl/api/User/GetUser?userId=${data.userId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              accesstoken: data.token, // Token obtenido del login
            }
          });
          
          if (userResponse.ok) {
            const userInformation = await userResponse.json();
          
            // Agregar el atributo userInformation usando spread operator
            data = { ...data, userInformation };
            console.log("Información del usuario obtenida:", data);
            
            // Guardar el objeto actualizado en SecureStore
            await StorageService.saveData("UserData", data);
          
            // Redirigir al dashboard
            router.push("/(tabs)/dashboard");
          } else {
            console.warn(
              "No se pudo obtener la información del usuario",
              userResponse.status
            );
          }
        }
      })
      .catch((error) => {
        setStatus("error");
        Alert.alert("Error", "Hubo un problema con el login.");
        console.error(error);
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
              style={{ flex: 1 }}
              className="justify-center items-center px-14 bg-[#fff]">
              <Text
                className="mt-[20vh]"
                style={{
                  marginBottom: 50,
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "black",
                  borderBottomWidth: 2,
                  borderBottomColor: "purple",
                  paddingBottom: 5,
                  paddingHorizontal: 16,
                }}>
                Inicio de Sesión
              </Text>

              <Input
                iconName="user"
                placeholder="Usuario"
                value={username}
                onChangeText={setUsername}
                status={errors.username ? "warning" : status} // Mostrar estado de warning si el campo está vacío
              />
              <Input
                iconName="lock"
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                secureTextEntryIconToggle={true}
                status={errors.password ? "warning" : status} // Mostrar estado de warning si el campo está vacío
              />

              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  backgroundColor: "#E91E63",
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                  borderRadius: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  width: "50%",
                  marginTop: 40,
                }}
                onPress={handleLogin}>
                <Text className="text-white font-bold text-base">
                  Iniciar Sesión
                </Text>
              </TouchableOpacity>

              <Link asChild href="/auth/registerScreen">
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    backgroundColor: "white",
                    paddingVertical: 10,
                    borderColor: "#E91E63",
                    borderWidth: 2,
                    paddingHorizontal: 20,
                    borderRadius: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    width: "50%",
                    marginTop: 15,
                  }}>
                  <Text className="text-[#E91E63] font-bold text-base">
                    Registrarse
                  </Text>
                </TouchableOpacity>
              </Link>

              <Image
                source={require("../../assets/image/LOGO_MT_1.png")}
                style={{
                  marginTop: "auto",
                  marginBottom: 15,
                  width: 60,
                  height: 70,
                  resizeMode: "contain",
                }}
              />
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
