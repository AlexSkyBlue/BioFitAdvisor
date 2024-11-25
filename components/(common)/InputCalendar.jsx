import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/FontAwesome";

const InputCalendar = ({ placeholder, value, onChange }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const showPicker = () => setShowDatePicker(true);

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <>
      <TouchableOpacity onPress={showPicker} style={styles.inputContainer}>
        <Icon name="calendar" size={20} style={styles.icon} />
        <Text style={styles.inputText}>
          {value ? value.toLocaleDateString() : placeholder}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}
    </>
  );
};

const styles = {
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
    width: "100%",
    borderColor: "black",
    backgroundColor: "#FFF",
  },
  icon: {
    marginRight: 10,
  },
  inputText: {
    fontSize: 16,
    color: "black",
    textAlign: "center", // Centra el texto horizontalmente
    flex: 1, // Esto asegura que el texto ocupe el espacio restante
  },
};

export default InputCalendar;
