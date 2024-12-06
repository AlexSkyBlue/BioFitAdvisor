import React, { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const Input = ({
  iconName,
  iconSize = 20,
  iconClass = "mx-2",
  placeholder,
  secureTextEntry = false, // Indicador si el input es de tipo contraseña
  secureTextEntryIconToggle = false,
  status = "default", // "warning", "success", "error"
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry); // Controla si la contraseña es visible

  let borderColor = isFocused ? "rgb(200,80,220)" : "black";
  let backgroundColor = isFocused ? "rgba(222,68,241,0.15)" : "#FFF";
  let iconColor = isFocused ? "rgb(200,80,220)" : "rgba(0,0,0,1)";
  let statusIconName = null;

  // Cambiar colores e íconos según el estado
  switch (status) {
    case "warning":
      borderColor = "orange";
      backgroundColor = "#FFFBEA";
      iconColor = "orange";
      statusIconName = "warning";
      break;
    case "success":
      borderColor = "green";
      backgroundColor = "#E6FFED";
      iconColor = "green";
      statusIconName = "check";
      break;
    case "error":
      borderColor = "red";
      backgroundColor = "#FFEDED";
      iconColor = "red";
      statusIconName = "times-circle";
      break;
    default:
      borderColor = borderColor;
      backgroundColor = backgroundColor;
      iconColor = iconColor;
      statusIconName = statusIconName;
      break;
  }

  // Función para alternar la visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View
      style={[
        styles.inputContainer,
        {
          borderColor: borderColor,
          backgroundColor: backgroundColor,
        },
      ]}>
      {iconName && (
        <Icon
          name={iconName}
          size={iconSize}
          color={iconColor}
          style={styles.icon}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="rgba(0,0,0,0.5)"
        autoCapitalize="none"
        secureTextEntry={secureTextEntry && !isPasswordVisible} // Oculta la contraseña si `secureTextEntry` es verdadero
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {/* Mostrar icono de ojo si es una contraseña */}
      {secureTextEntry && secureTextEntryIconToggle && (
        <TouchableOpacity onPress={togglePasswordVisibility}>
          <Icon
            name={isPasswordVisible ? "eye" : "eye-slash"}
            size={iconSize}
            color={iconColor}
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
      {statusIconName && (
        <Icon name={statusIconName} size={iconSize} color={iconColor} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 50,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: "100%",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "black",
  },
  icon: {
    marginRight: 10,
  },
});

export default Input;
