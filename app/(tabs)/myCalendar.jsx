import React, { useState, useEffect, useCallback } from "react";
import { TouchableOpacity, FlatList, Modal, Alert } from "react-native";
import { View, Text, StyleSheet } from "react-native";
import {
  ExpandableCalendar,
  CalendarProvider,
  LocaleConfig,
} from "react-native-calendars";
import { Link } from "expo-router";
import axios from "axios";
import StorageService from "../../lib/StorageService";

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

const MyCalendar = () => {
  const [UserData, setUserData] = useState(null);
  const [planData, setPlanData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("2024-09-25");
  const [items, setItems] = useState([]);
  const [markedDates, setMarkedDates] = useState({});

  // Cargar datos del usuario
  useEffect(async () => {
    const fetchUserData = async () => {
      try {
        const userData = await StorageService.getData("UserData");
        if (userData) {
          setUserData(userData);
          await fetchPlanSchedule(UserData.exercisePlan.planId);
        }
      } catch (error) {
        console.error("Error fetching UserData:", error);
      }
    };

    await fetchUserData();
  }, []);

  const fetchPlanSchedule = async (planId) => {
    try {
      const response = await fetch(
        `https://www.fitai.cl/api/PlanSchedule/GetPlanScheduleById?planId=${planId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            accesstoken: UserData.token, // Incluye el token del usuario
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Plan Schedule:", data);
        setPlanData(data); // Guarda los datos de la planificación en el estado
      } else if (response.status === 400) {
        // Si el estado es 400, mostrar modal para calendarizar plan
        console.log("No se encontró la planificación");
        setShowModal(true);
      } else {
        // Manejar otros errores
        Alert.alert("Error", "Hubo un problema al cargar la planificación.");
        console.error("Error en la API:", response.status);
      }
    } catch (error) {
      // Captura errores de red o problemas inesperados
      Alert.alert("Error", "Hubo un problema al conectar con el servidor.");
      console.error("Error al conectar con la API:", error);
    }
  };

  const handleCalendarizePlan = () => {
    // Aquí podrías realizar la lógica para calendarizar el plan.
    Alert.alert("Plan calendarizado con éxito.");
    setShowModal(false);
  };

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
          <TouchableOpacity
            style={styles.button}
            accessibilityLabel="Ver detalle del ejercicio"
            accessibilityHint="Presiona para ver los detalles del ejercicio seleccionado">
            <Text style={styles.buttonText}>Detalle de Ejercicio</Text>
          </TouchableOpacity>
        </Link>
      </View>
    ),
    []
  );

  // Marcar fechas dinámicamente en caso de datos dinámicos
  useEffect(() => {
    if (planData) {
      const newMarkedDates = {};
      planData.exercices.forEach((exercise) => {
        const date = exercise.date.split("T")[0];
        newMarkedDates[date] = {
          marked: true,
          dotColor: "#E91E63",
        };
      });
      setMarkedDates(newMarkedDates);
    }
  }, [planData]);

  return (
    <>
      <CalendarProvider
        style={{ backgroundColor: "#fff" }}
        date={selectedDate}
        accessibilityLabel="Calendario de ejercicios"
        accessibilityHint="Navega por las fechas para ver los ejercicios programados">
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
        {planData?.exercices ? (
          <FlatList
            className="px-5"
            data={planData.exercices}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            keyboardShouldPersistTaps="handled"
          />
        ) : (
          <View style={styles.noItems}>
            <Text style={{ color: "#610588", fontWeight: "600" }}>
              No hay eventos para esta fecha.
            </Text>
          </View>
        )}
      </CalendarProvider>

      {/* Modal para calendarizar */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              ¿Deseas calendarizar tu plan de ejercicios?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, { marginRight: 10 }]}
                onPress={handleCalendarizePlan}>
                <Text style={styles.buttonText}>Sí</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setShowModal(false)}>
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#c8c8c8",
    padding: 20,
    marginVertical: 10,
    borderRadius: 12,
  },
  exerciseText: {
    fontSize: 20,
    color: "#000",
    fontWeight: "600",
  },
  timeText: {
    fontSize: 16,
    color: "#000",
  },
  noItems: {
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#610588",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    width: "80%",
  },
  modalText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "center",
  },
});

export default MyCalendar;
