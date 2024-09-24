import React from "react";
import { View, TextInput } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const Input = ({
  iconName,
  iconSize = 20,
  iconColor = "rgba(0,0,0,1)",
  iconClass = "mx-2",
  placeholder,
  ...props
}) => {
  return (
    <View className="flex-row items-center border border-black focus:border-fuchsia-400 focus:bg-fuchsia-600/30 rounded-full px-2 mb-2 w-full">
      {iconName && (
        <Icon
          name={iconName}
          size={iconSize}
          color={iconColor}
          className={iconClass}
        />
      )}
      <TextInput
        className="flex-1 p-2 text-black placeholder-black"
        placeholder={placeholder}
        autoCapitalize="none"
        {...props} // Esto permite pasar todas las propiedades adicionales al TextInput
      />
    </View>
  );
};

export default Input;
