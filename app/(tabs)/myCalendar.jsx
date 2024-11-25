import React, { useState, useEffect, useCallback } from "react";
import { TouchableOpacity, FlatList } from "react-native";
import { View, Text, StyleSheet } from "react-native";
import {
  ExpandableCalendar,
  CalendarProvider,
  LocaleConfig,
} from "react-native-calendars";
import { Link } from "expo-router";
import exercisesLib from "../../lib/list-exercices-final.json"; // Importamos la lista de ejercicios

// Configuración de localización
LocaleConfig.locales["es"] = {
  monthNames: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
  monthNamesShort: [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ],
  dayNames: [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ],
  dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
  today: "Hoy",
};
LocaleConfig.defaultLocale = "es";

const exerciseData = {
  "2024-09-25": [
    {
      name: "Yoga",
      time: "8 AM - 9 AM",
      duration: "1h",
      description: "Sesión de Yoga",
    },
    {
      name: "Cardio",
      time: "10 AM - 11 AM",
      duration: "1h",
      description: "Cardio de alta intensidad",
    },
  ],
  "2024-09-26": [
    {
      name: "Pilates",
      time: "9 AM - 10 AM",
      duration: "1h",
      description: "Pilates Reformer",
    },
    {
      name: "Entrenamiento de fuerza",
      time: "11 AM - 12 PM",
      duration: "1h",
      description: "Entrenamiento de cuerpo completo",
    },
  ],
  "2024-09-27": [
    {
      name: "TRX",
      time: "10 AM - 11 AM",
      duration: "1h",
      description: "Entrenamiento en suspensión",
    },
  ],
};

const MyCalendar = () => {
  const [selectedDate, setSelectedDate] = useState("2024-09-25");
  const [items, setItems] = useState([]);
  const [markedDates, setMarkedDates] = useState({
    "2024-09-25": {
      selected: true,
      marked: true,
      selectedColor: "#E879F9",
      selectedTextColor: "#fff",
    },
    "2024-09-26": { marked: true, dotColor: "#E879F9" },
    "2024-09-27": { marked: true, dotColor: "#E879F9" },
  });

  useEffect(() => {
    // Aquí llamamos a la función para obtener los ejercicios aleatorios
    const randomExercises = getRandomExercises();
    setItems(randomExercises); // Guardamos los ejercicios seleccionados en el estado

    const newMarkedDates = {
      [selectedDate]: {
        selected: true,
        selectedColor: "#E91E63",
        selectedTextColor: "#fff",
      },
    };
    Object.keys(exerciseData).forEach((date) => {
      if (!newMarkedDates[date]) {
        newMarkedDates[date] = { marked: true, dotColor: "#E91E63" };
      }
    });
    setMarkedDates(newMarkedDates);
  }, [selectedDate]);

  const renderItem = useCallback(
    ({ item }) => (
      <View style={styles.item}>
        <Text style={styles.exerciseText}>{item.exercise}</Text>
        <Text style={styles.timeText}>Nivel: {item.level}</Text>
        <Link
          href={{
            pathname: "/exercise/[exercise]",
            params: { exercise: JSON.stringify(item) },
          }}
          asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Detalle de Ejercicio</Text>
          </TouchableOpacity>
        </Link>
      </View>
    ),
    []
  );

  // Función para seleccionar ejercicios aleatorios
  const getRandomExercises = () => {
    const numberOfExercises = Math.floor(Math.random() * 8) + 1; // Número aleatorio entre 1 y 8
    const randomIndices = [];

    while (randomIndices.length < numberOfExercises) {
      const randomIndex = Math.floor(
        Math.random() * exercisesLib.exercises.length
      ); // Índices ajustados a la longitud de ejercicios
      if (!randomIndices.includes(randomIndex)) {
        randomIndices.push(randomIndex);
      }
    }

    return randomIndices.map((index) => exercisesLib.exercises[index]);
  };

  return (
    <CalendarProvider style={{ backgroundColor: "#fff" }} date={selectedDate}>
      <ExpandableCalendar
        firstDay={1}
        theme={{
          calendarBackground: "#fff",
          selectedDayBackgroundColor: "#610588",
          selectedDayTextColor: "#fff",
          todayTextColor: "#610588",
          dayTextColor: "#000",
          monthTextColor: "#000",
          arrowColor: "#E91E63",
        }}
        markedDates={markedDates}
        onDayPress={(day) => setSelectedDate(day.dateString)}
      />
      {items.length > 0 ? (
        <FlatList
          className="px-5"
          data={items}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <View style={styles.noItems}>
          <Text style={{ color: "#610588", fontWeight: "600" }}>
            No hay eventos para esta fecha.
          </Text>
        </View>
      )}
    </CalendarProvider>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#c8c8c8", // Fondo morado oscuro
    padding: 20,
    marginVertical: 10,
    borderRadius: 12, // Esquinas más redondeadas
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  exerciseText: {
    fontSize: 20, // Tamaño de fuente más grande para mejor visibilidad
    color: "#000",
    fontWeight: "600", // Fuente más gruesa
    marginBottom: 5, // Espacio entre el texto y la hora
  },
  timeText: {
    fontSize: 16, // Texto de la hora ligeramente más grande
    color: "#000", // Texto gris claro para contraste
    marginBottom: 10, // Espacio entre el texto de la hora y la descripción
  },
  noItems: {
    paddingVertical: 30, // Más espacio cuando no hay eventos
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#610588", // Mantenemos el botón en rosa vibrante
    padding: 12, // Espacio adicional en el botón
    borderRadius: 8, // Botón con esquinas más redondeadas
    alignItems: "center", // Centramos el texto del botón
    justifyContent: "center",
    shadowColor: "#000", // Sombra para mayor efecto de profundidad
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16, // Texto del botón ligeramente más grande
  },
});

export default MyCalendar;
