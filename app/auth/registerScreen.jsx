import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Platform,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  Modal, // Importamos Modal
  ScrollView,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { Ionicons, AntDesign, FontAwesome6 } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import TakeImage from "../../components/(common)/TakeImage";
import axios from "axios";
import StorageService from "../../lib/StorageService";
import Input from "../../components/(common)/Input";
import InputCalendar from "../../components/(common)/InputCalendar";

export default function RegisterScreen() {
  const [step, setStep] = useState(1);

  const [usuario, setUsuario] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedSexo, setSelectedSexo] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [hasPermissions, setHasPermissions] = useState(true);
  const [imageUri, setImageUri] = useState(null);
  const [showTakeImage, setShowTakeImage] = useState(false);
  const [height, setHeight] = useState(0.0);
  const [weight, setWeight] = useState(0.0);
  const [showModal, setShowModal] = useState(false); // Estado para mostrar el Modal
  const [status, setStatus] = useState({}); // Para manejar estados de validación
  const router = useRouter(); // Hook para redireccionar

  useEffect(() => {
    if (imageUri) {
      estimateHeightAndWeight(imageUri);
    }
  }, [imageUri]);

  const handlePictureSaved = (uri) => {
    setImageUri(uri); // Guardar la URI de la imagen
    setShowTakeImage(false); // Ocultar la cámara después de guardar la foto
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || fechaNacimiento;
    setShowDatePicker(Platform.OS === "ios");
    setFechaNacimiento(currentDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // Función para hacer la petición a la API de estimación de altura/peso
  const estimateHeightAndWeight = async (uri) => {
    console.log("Iniciando estimación con imagen URI:", uri);
    let formData = new FormData();
    formData.append("image", {
      uri: uri,
      type: "image/jpeg",
      name: "image.jpg",
    });

    try {
      const response = await axios.post(
        "https://api-body-scanner-4fc73e30271c.herokuapp.com/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = response.data;

      console.log("Datos recibidos de la API:", data);
      setHeight(data.altura_cm);
      setWeight(data.peso_kg);
    } catch (error) {
      console.log("Error en la llamada a la API:", error);
      Alert.alert("Error", "Hubo un problema con la estimación");
    }
  };

  const validateFields = () => {
    let errors = {};
    if (!usuario) errors.usuario = "warning";
    if (!nombre) errors.nombre = "warning";
    if (!apellido) errors.apellido = "warning";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "error"; // Validación de formato de correo
    if (!telefono || !/^\+?\d{10,12}$/.test(telefono))
      errors.telefono = "error"; // Validación de teléfono
    if (!password || password.length < 6) errors.password = "warning";
    if (!confirmPassword || confirmPassword.length < 6)
      errors.confirmPassword = "warning";
    if (password !== confirmPassword) errors.confirmPassword = "error";

    setStatus(errors);
    return Object.keys(errors).length === 0;
  };

  // Función para registrar al usuario
  const registerUser = async () => {
    if (!validateFields()) {
      Alert.alert(
        "Verifica los campos del registro",
        "Faltan algunos por llenar o cumplan con los requisitos. "
      );
      return;
    }
    if (height <= 0 || weight <= 0) {
      Alert.alert(
        "Debes estimar tu altura",
        "Debes tomarte una foto para estimar tu altura y peso antes de continuar."
      );
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Las contraseñas no coinciden");
      return;
    }

    const user = {
      userId: 0,
      userName: usuario,
      firstName: nombre,
      lastName: apellido,
      sex: selectedSexo,
      birthdayDate: fechaNacimiento.toISOString(),
      email: email,
      password: password,
      phone: telefono,
      height: height, // Asignar el valor de altura aquí
      weight: weight, // Asignar el valor de peso aquí
      createdBy: 0,
      creationDate: new Date().toISOString(),
      modifiedBy: 0,
      modificationDate: new Date().toISOString(),
      status: true,
    };

    await axios
      .post("https://fitai.cl/api/User/UpsertUser", user, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const data = response.data;
        console.log("Response Body:", data); // Log del cuerpo de la respuesta
        setShowModal(true); // Mostramos el modal cuando el registro es exitoso
      })
      .catch((error) => {
        console.log("Error en el registro:", error);
        Alert.alert("Error", "Hubo un problema al procesar el registro");
      });
  };

  // Animaciones de los pasos
  const shadowAnim = useRef(new Animated.Value(1)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(shadowAnim, {
      toValue: step,
      duration: 500,
      useNativeDriver: true,
    }).start();

    Animated.timing(colorAnim, {
      toValue: step,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [step]);

  return (
    <SafeAreaView
      edges={{ top: "maximum", bottom: "maximum" }}
      style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"} // Ajuste para evitar que el teclado oculte elementos
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled">
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}>
            <View className="items-center px-4 bg-white" style={{ flex: 1 }}>
              <Text
                className="mt-[15vh]"
                style={{
                  marginBottom: 15,
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "black",
                  borderBottomWidth: 2,
                  borderBottomColor: "purple",
                  paddingBottom: 5,
                  paddingHorizontal: 16,
                }}>
                Registrarse
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  width: "100%",
                  height: "auto",
                  marginBottom: 15,
                }}>
                {[1, 2, 3, 4].map((item) => (
                  <TouchableOpacity onPress={() => setStep(item)} key={item}>
                    <Animated.View
                      style={{
                        height: 40,
                        width: 40,
                        borderRadius: 25,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: step >= item ? "#8B5CF6" : "#E5E7EB",
                        shadowColor: step === item ? "purple" : "transparent",
                        shadowOffset: {
                          width: 0,
                          height: step === item ? 10 : 0,
                        },
                        shadowOpacity: step === item ? 0.5 : 0,
                        shadowRadius: 10,
                        elevation: step === item ? 10 : 0,
                      }}>
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 20,
                          color: step >= item ? "#FFFFFF" : "#000000",
                        }}>
                        {item}
                      </Text>
                    </Animated.View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Sección del Paso 1: Nombre Usuario y Cumpleaños */}
              {step === 1 && (
                <>
                  <View className="w-full px-10 flex-col items-center align-middle">
                    <View className="w-full">
                      <Text
                        className="font-bold text-center"
                        style={{
                          fontSize: 16,
                          marginBottom: 10,
                          color: "black",
                        }}>
                        Ingresa tu usuario
                      </Text>
                      <Input
                        iconName="user"
                        placeholder="Usuario"
                        value={usuario}
                        onChangeText={setUsuario}
                        status={status.usuario}
                      />
                    </View>

                    {/* Campo de Nombre */}
                    <View className="w-full">
                      <Text
                        className="font-bold text-center"
                        style={{
                          fontSize: 16,
                          marginBottom: 10,
                          color: "black",
                        }}>
                        Ingresa tu nombre
                      </Text>
                      <Input
                        iconName="user"
                        placeholder="Nombre"
                        value={nombre}
                        onChangeText={setNombre}
                        status={status.nombre}
                      />
                    </View>

                    {/* Campo de Apellido */}
                    <View className="w-full">
                      <Text
                        className="font-bold text-center"
                        style={{
                          fontSize: 16,
                          marginBottom: 10,
                          color: "black",
                        }}>
                        Ingresa tu apellido
                      </Text>
                      <Input
                        iconName="user"
                        placeholder="Apellido"
                        value={apellido}
                        onChangeText={setApellido}
                        status={status.apellido}
                      />
                    </View>

                    {/* Campo de Fecha de Nacimiento */}
                    <View className="w-full items-center">
                      <Text
                        className="font-bold text-center"
                        style={{
                          fontSize: 16,
                          marginBottom: 10,
                          color: "black",
                        }}>
                        ¿Cuál es tu fecha de nacimiento?
                      </Text>
                      <InputCalendar
                        placeholder="Fecha de nacimiento"
                        value={fechaNacimiento}
                        onChange={setFechaNacimiento}
                      />
                    </View>

                    {/* Mostrar el DateTimePicker */}
                    {showDatePicker && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={fechaNacimiento}
                        mode="date"
                        display="default"
                        onChange={onChangeDate}
                      />
                    )}
                  </View>
                </>
              )}

              {/* Sección del Paso 2: Selección de sexo */}
              {step === 2 && (
                <>
                  <Text
                    className="font-bold"
                    style={{ fontSize: 16, marginBottom: 20, color: "black" }}>
                    ¿Con qué sexo te identificas?
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                      marginBottom: 20,
                    }}>
                    {/* Cuadro Hombre */}
                    <TouchableOpacity
                      style={{
                        backgroundColor: "white",
                        padding: 16,
                        borderRadius: 8,
                        alignItems: "center",
                        width: 130,
                        borderWidth: selectedSexo === "Male" ? 2 : 0,
                        borderColor: "purple",
                      }}
                      onPress={() => setSelectedSexo("Male")}>
                      <Ionicons
                        name="man-sharp"
                        size={50}
                        color={
                          selectedSexo === "Male"
                            ? "rgba(168, 85, 247, 1)"
                            : "black"
                        }
                      />
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            color: selectedSexo === "Male" ? "purple" : "black",
                            marginRight: 4,
                            marginVertical: "auto",
                          }}>
                          Hombre
                        </Text>
                        <AntDesign
                          name="man"
                          size={20}
                          color={
                            selectedSexo === "Male"
                              ? "rgba(168, 85, 247, 1)"
                              : "black"
                          }
                        />
                      </View>
                    </TouchableOpacity>

                    {/* Cuadro Mujer */}
                    <TouchableOpacity
                      style={{
                        backgroundColor: "white",
                        padding: 16,
                        borderRadius: 8,
                        alignItems: "center",
                        width: 130,
                        borderWidth: selectedSexo === "Female" ? 2 : 0,
                        borderColor: "purple",
                      }}
                      onPress={() => setSelectedSexo("Female")}>
                      <Ionicons
                        name="woman"
                        size={50}
                        color={
                          selectedSexo === "Female"
                            ? "rgba(168, 85, 247, 1)"
                            : "black"
                        }
                      />
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            color:
                              selectedSexo === "Female" ? "purple" : "black",
                            marginRight: 4,
                          }}>
                          Mujer
                        </Text>
                        <AntDesign
                          name="woman"
                          size={20}
                          color={
                            selectedSexo === "Female"
                              ? "rgba(168, 85, 247, 1)"
                              : "black"
                          }
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {/* Sección del Paso 3: Confirmación */}
              {step === 3 && (
                <>
                  <View className="w-full px-10 flex-col items-center align-middle">
                    {/* Campo de Correo Electrónico */}
                    <View className="w-full">
                      <Text
                        className="font-bold text-center"
                        style={{
                          fontSize: 16,
                          marginBottom: 10,
                          color: "black",
                        }}>
                        Ingresa tu correo electrónico
                      </Text>
                      <Input
                        iconName="envelope"
                        placeholder="Correo electrónico"
                        value={email}
                        onChangeText={setEmail}
                        status={status.email}
                        keyboardType="email-address"
                      />
                    </View>

                    {/* Campo de Teléfono */}
                    <View className="w-full">
                      <Text
                        className="font-bold text-center"
                        style={{
                          fontSize: 16,
                          marginBottom: 10,
                          color: "black",
                        }}>
                        Ingresa tu número de telefono
                      </Text>
                      <Input
                        iconName="phone"
                        placeholder="+56900000000"
                        value={telefono}
                        onChangeText={setTelefono}
                        status={status.telefono}
                        keyboardType="phone-pad"
                      />
                    </View>

                    {/* Campo de Contraseña */}
                    <View className="w-full">
                      <Text
                        className="font-bold text-center"
                        style={{
                          fontSize: 16,
                          marginBottom: 10,
                          color: "black",
                        }}>
                        Ingresa tu contraseña
                      </Text>
                      <Input
                        iconName="lock"
                        placeholder="Contraseña"
                        value={password}
                        onChangeText={setPassword}
                        status={status.password}
                        secureTextEntry
                      />
                    </View>

                    {/* Campo de Confirmación de Contraseña */}
                    <View className="w-full">
                      <Text
                        className="font-bold text-center"
                        style={{
                          fontSize: 16,
                          marginBottom: 10,
                          color: "black",
                        }}>
                        Confirma tu contraseña
                      </Text>
                      <Input
                        iconName="lock"
                        placeholder="Confirmar contraseña"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        status={status.confirmPassword}
                      />
                    </View>
                  </View>
                </>
              )}

              {/* Paso 4: Tomar Foto */}
              {step === 4 && (
                <View style={styles.stepContainer}>
                  <Text style={styles.title}>Tómate una foto</Text>
                  {/* Botón para tomar foto */}
                  {hasPermissions && (
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => setShowTakeImage(true)}>
                      {imageUri ? (
                        <>
                          <Text style={styles.buttonText}>Retomar Foto</Text>
                          <Ionicons
                            name="camera-reverse-sharp"
                            size={24}
                            style={{ marginLeft: 10 }}
                            color="white"
                          />
                        </>
                      ) : (
                        <>
                          <Text style={styles.buttonText}>Tomar Foto</Text>
                          <Ionicons
                            name="camera-sharp"
                            size={24}
                            style={{ marginLeft: 10 }}
                            color="white"
                          />
                        </>
                      )}
                    </TouchableOpacity>
                  )}

                  {/* Mostrar imagen tomada */}
                  {imageUri && (
                    <View
                      style={{ flexDirection: "row", marginVertical: "auto" }}>
                      {/* Mostrar la imagen tomada */}
                      <Image source={{ uri: imageUri }} style={styles.image} />

                      {/* Mostrar la altura y peso estimado */}
                      <View
                        style={{
                          marginLeft: 10,
                          marginVertical: "auto",
                        }}>
                        <Text style={{ fontSize: 18 }}>
                          Altura: {height ? `${height} cm` : "Estimando..."}
                        </Text>
                        <Text style={{ fontSize: 18 }}>
                          Peso: {weight ? `${weight} kg` : "Estimando..."}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Modal para abrir la cámara */}
                  <Modal
                    animationType="slide"
                    transparent={false}
                    visible={showTakeImage}
                    onRequestClose={() => setShowTakeImage(false)}>
                    <View style={styles.modalContainer}>
                      {/* Componente TakeImage dentro del modal */}
                      <TakeImage
                        onPictureSaved={(uri) => {
                          handlePictureSaved(uri);
                          setShowTakeImage(false); // Cierra el modal al guardar la imagen
                        }}
                        setPermissionsReady={setHasPermissions}
                      />

                      {/* Botón para cerrar el modal */}
                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setShowTakeImage(false)}>
                        <Text style={styles.closeButtonText}>Cerrar</Text>
                      </TouchableOpacity>
                    </View>
                  </Modal>
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
                        onPress={async () => {
                          setShowModal(false);
                          // Realizar la autenticación
                          await axios
                            .post("https://fitai.cl/api/User/Autentication", {
                              identifier: usuario,
                              password: password,
                            })
                            .then(async (authResponse) => {
                              console.log(
                                "authResponse.data",
                                authResponse.data
                              );
                              await StorageService.saveData(
                                "UserData",
                                authResponse.data
                              );
                              // Redirigir a GenerateExercisePlan con los parámetros
                              router.push("/exercise/generateExercisePlan");
                            })
                            .catch((error) => {
                              console.log(
                                "Error durante la autenticación:",
                                error
                              );
                              Alert.alert(
                                "Error",
                                "Hubo un problema durante la autenticación"
                              );
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

              {/* Navegación entre pasos */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: step === 1 ? "flex-end" : "space-between",
                  width: "100%",
                  marginTop: 5,
                  paddingHorizontal: 20,
                }}>
                {step > 1 && (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      backgroundColor: "#E91E63",
                      paddingVertical: 10,
                      paddingHorizontal: 5,
                      borderRadius: 50,
                      justifyContent: "center",
                      alignItems: "center",
                      width: "40%",
                    }}
                    onPress={prevStep}>
                    <AntDesign name="left" size={20} color="white" />
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 16,
                      }}>
                      Anterior
                    </Text>
                  </TouchableOpacity>
                )}
                {step < 4 && (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      backgroundColor: "#E91E63",
                      paddingVertical: 10,
                      paddingHorizontal: 5,
                      borderRadius: 50,
                      justifyContent: "center",
                      alignItems: "center",
                      width: "40%",
                    }}
                    onPress={nextStep}>
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 16,
                      }}>
                      Siguiente
                    </Text>
                    <AntDesign name="right" size={20} color="white" />
                  </TouchableOpacity>
                )}
                {step === 4 && (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      backgroundColor: "#E91E63",
                      paddingVertical: 10,
                      paddingHorizontal: 5,
                      borderRadius: 50,
                      justifyContent: "center",
                      alignItems: "center",
                      width: "40%",
                    }}
                    onPress={registerUser}>
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 16,
                      }}>
                      Registrarme
                    </Text>
                    <AntDesign name="right" size={20} color="white" />
                  </TouchableOpacity>
                )}
              </View>

              <Image
                source={require("../../assets/image/LOGO_MT_1.png")}
                style={{
                  marginTop: "auto",
                  marginBottom: 25,
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
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "black", // Fondo negro para que coincida con la cámara
    justifyContent: "center",
    alignItems: "center",
  },
  stepContainer: {
    flex: 0.7,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#E91E63",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  image: {
    marginVertical: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#E91E63",
    width: 150,
    height: 250,
    resizeMode: "cover",
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
