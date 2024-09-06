import React from "react";
import { View, TextInput } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const Input = ({
  iconName,
  iconSize = 20,
  iconColor = "rgba(256,256,256,0.9)",
  iconClass = "mx-2",
  placeholder,
  ...props
}) => {
  return (
    <View className="flex-row items-center border border-white/90 focus:border-fuchsia-400 focus:bg-fuchsia-600/30 rounded-full px-2 mb-2 w-full">
      {iconName && (
        <Icon
          name={iconName}
          size={iconSize}
          color={iconColor}
          className={iconClass}
        />
      )}
      <TextInput
        className="flex-1 p-2 text-white/90 placeholder-white/90"
        placeholder={placeholder}
        autoCapitalize="none"
        {...props} // Esto permite pasar todas las propiedades adicionales al TextInput
      />
    </View>
  );
};

export default Input;
