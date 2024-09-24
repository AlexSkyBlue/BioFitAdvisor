import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Platform,
} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";

export default function RegisterScreen() {
  const [step, setStep] = useState(1);
  const [selectedSexo, setSelectedSexo] = useState(null);

  // Animaciones de los pasos
  const shadowAnim = useRef(new Animated.Value(1)).current; // Valor inicial para la sombra
  const colorAnim = useRef(new Animated.Value(0)).current; // Valor inicial para el color

  useEffect(() => {
    // Animar el cambio de sombra y color al cambiar de paso
    Animated.timing(shadowAnim, {
      toValue: step, // Cambia de acuerdo al paso actual
      duration: 500, // Duración de la animación
      useNativeDriver: true, // Para propiedades como 'shadow' y 'backgroundColor', se debe usar false
    }).start();

    Animated.timing(colorAnim, {
      toValue: step,
      duration: 500, // Cambia la duración para hacerlo más suave o rápido
      useNativeDriver: true,
    }).start();
  }, [step]);

  // Función para obtener el color suavizado (interpolado)
  const interpolatedColor = colorAnim.interpolate({
    inputRange: [1, 2, 3],
    outputRange: ["#c7c7c7", "#8B5CF6", "#8B5CF6"], // Cambiar colores entre los pasos
  });

  // Función para obtener la sombra suavizada
  const interpolatedShadow = shadowAnim.interpolate({
    inputRange: [1, 2, 3],
    outputRange: [2, 10, 20], // Sombra de menor a mayor según el paso
  });

  const selectSexo = (sexo) => {
    setSelectedSexo(sexo);
  };

  const selectStep = (step) => {
    setStep(step);
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // Estilo dinámico para el círculo del paso
  const getStepCircleStyle = (item) => {
    return {
      height: 50,
      width: 50,
      borderRadius: 25,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: step >= item ? "#8B5CF6" : "#E5E7EB", // Cambiar a púrpura o gris dependiendo del paso
      shadowColor: step === item ? "purple" : "transparent", // Agregar sombra solo al paso activo
      shadowOffset: { width: 0, height: step === item ? 10 : 0 }, // Sombra más controlada
      shadowOpacity: 0.5,
      shadowRadius: 10,
      elevation: step === item ? 10 : 0, // Para Android, agrega 'elevation' en el paso activo
    };
  };

  return (
    <SafeAreaView edges={{ top: "maximum", bottom: "maximum" }}>
      <View className="justify-center items-center px-4 bg-[#fff]">
        {/* Imagen en la esquina superior cubriendo todo el ancho */}
        <View className="absolute top-0 right-0 left-0">
          <Image
            source={require("../../assets/image/login_banner.png")}
            style={{ width: "100%", height: 300, resizeMode: "cover" }}
          />
          {/* Línea diagonal morada */}
          <View
            style={{
              position: "absolute",
              top: 150,
              left: -100,
              width: 550,
              height: 15,
              backgroundColor: "purple",
              transform: [{ rotate: "24deg" }],
            }}
          />
        </View>

        <Text
          style={{
            marginTop: 250,
            marginBottom: 25,
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

        {/* Círculos de pasos */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            width: "100%",
            height: "auto",
            marginBottom: 20,
          }}>
          {[1, 2, 3].map((item) => (
            <TouchableOpacity onPress={() => selectStep(item)}>
              <Animated.View
                key={item}
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: 25,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: step >= item ? "#8B5CF6" : "#E5E7EB",
                  shadowColor: step === item ? "purple" : "transparent",
                  shadowOffset: { width: 0, height: step === item ? 10 : 0 },
                  shadowOpacity: step === item ? 0.5 : 0, // Ajusta este valor si la sombra está haciendo que el texto se vea borroso
                  shadowRadius: 10,
                  elevation: step === item ? 10 : 0,
                }} // Aplicar estilo dinámico
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 20, // Aumenta el tamaño del texto para mejorar la visibilidad
                    color: step >= item ? "#FFFFFF" : "#000000", // Mejora el contraste entre el fondo y el texto
                  }}>
                  {item}
                </Text>
              </Animated.View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sección del Paso 1: Selección de sexo */}
        {step === 1 && (
          <>
            <Text style={{ fontSize: 18, marginBottom: 20, color: "black" }}>
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
                  borderWidth: selectedSexo === "hombre" ? 2 : 0,
                  borderColor: "purple",
                }}
                onPress={() => selectSexo("hombre")}>
                <Ionicons
                  name="man"
                  size={50}
                  color={
                    selectedSexo === "hombre"
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
                      color: selectedSexo === "hombre" ? "purple" : "black",
                      marginRight: 4,
                      marginVertical: "auto",
                    }}>
                    Hombre
                  </Text>
                  <AntDesign
                    name="man"
                    size={20}
                    color={
                      selectedSexo === "hombre"
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
                  borderWidth: selectedSexo === "mujer" ? 2 : 0,
                  borderColor: "purple",
                }}
                onPress={() => selectSexo("mujer")}>
                <Ionicons
                  name="woman"
                  size={50}
                  color={
                    selectedSexo === "mujer" ? "rgba(168, 85, 247, 1)" : "black"
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
                      color: selectedSexo === "mujer" ? "purple" : "black",
                      marginRight: 4,
                      marginTop: 8,
                    }}>
                    Mujer
                  </Text>
                  <AntDesign
                    name="woman"
                    size={20}
                    color={
                      selectedSexo === "mujer"
                        ? "rgba(168, 85, 247, 1)"
                        : "black"
                    }
                  />
                </View>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Sección del Paso 2: Formulario de datos */}
        {step === 2 && (
          <>
            <Text style={{ fontSize: 18, marginBottom: 20, color: "black" }}>
              Introduce tus datos
            </Text>
            {/* Aquí se pueden agregar los inputs correspondientes */}
          </>
        )}

        {/* Sección del Paso 3: Confirmación */}
        {step === 3 && (
          <>
            <Text style={{ fontSize: 18, marginBottom: 20, color: "black" }}>
              Confirmación
            </Text>
            {/* Aquí puedes mostrar la confirmación de los datos */}
          </>
        )}

        {/* Navegación entre pasos */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: step === 1 ? "flex-end" : "space-between",
            width: "100%",
            marginTop: 10,
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
                  marginLeft: 10,
                }}>
                Anterior
              </Text>
            </TouchableOpacity>
          )}
          {step <= 3 && (
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
                  marginRight: 10,
                }}>
                Siguiente
              </Text>
              <AntDesign name="right" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>

        {/* Imagen al pie */}
        <Image
          source={require("../../assets/image/LOGO_MT_1.png")}
          style={{
            width: 60,
            height: 70,
            resizeMode: "contain",
          }}
        />
      </View>
    </SafeAreaView>
  );
}
