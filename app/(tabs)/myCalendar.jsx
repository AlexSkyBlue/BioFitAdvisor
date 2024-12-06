 import React, { useState, useEffect, useCallback } from "react";
import { TouchableOpacity, FlatList, Modal, Alert } from "react-native";
import { View, Text, StyleSheet } from "react-native";
import {
  ExpandableCalendar,
  CalendarProvider,
  LocaleConfig,
} from "react-native-calendars";
import { Link, router } from "expo-router";
import axios from "axios";
import StorageService from "../../lib/StorageService";
import { useFocusEffect } from "@react-navigation/native";
import InputCalendar from "../../components/(common)/InputCalendar";

// Importar lista de ejercicios
const listExercises = require("../../lib/list-exercices-final.json");

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
  const [errorInputModal, setInputModal] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showCalendarizeModal, setShowCalendarizeModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);// Nuevo estado para el segundo modal
  const [showDateStartModal, setShowDateStartModal] = useState(false); 
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Obtiene la fecha en formato YYYY-MM-DD
  });
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null); // Almacena el ejercicio seleccionado
  const [startDate, setStartDate] = useState(""); // Fecha de inicio seleccionada por el usuario
  const [items, setItems] = useState([]);
  const [markedDates, setMarkedDates] = useState({});

  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        try {
          const userData = await StorageService.getData("UserData");
  
          if (userData && userData.token && userData.planId) {
            setUserData(userData);
            await fetchPlanSchedule(userData);
          } else {
            console.warn("Datos incompletos en UserData:", userData);
          }
        } catch (error) {
          console.error("Error fetching UserData:", error);
        }
      };
  
      fetchUserData();

      // No retorna nada, evitando errores
      return () => {};
    }, [])
  );

  useEffect(() => {
    if (UserData?.planExercisesDates?.exercices) {
      const newMarkedDates = {};
  
      // Iterar sobre los ejercicios para marcar las fechas en el calendario
      UserData.planExercisesDates.exercices.forEach((exercise) => {
        const date = exercise.date.split("T")[0]; // Convertir la fecha al formato YYYY-MM-DD
  
        if (!newMarkedDates[date]) {
          newMarkedDates[date] = {
            marked: true,
            dotColor: "#E91E63", // Color del punto debajo de la fecha
          };
        }
      });
  
      setMarkedDates(newMarkedDates);
    }
  }, [UserData]);
  
  // Filtrar ejercicios basados en la fecha seleccionada
  useEffect(() => {
    try {
      if (UserData?.planExercisesDates?.exercices && selectedDate) {
        const exercisesForDate = UserData.planExercisesDates.exercices.filter(
          (exercise) => {
            const exerciseDate = exercise.date.split("T")[0];
            console.log("Comparando:", exerciseDate, "con", selectedDate);
            return exerciseDate === selectedDate;
          }
        );
        
        console.log("e",exercisesForDate)
        // Enriquecer los ejercicios con datos adicionales
        const enrichedExercises = exercisesForDate.map((exercise) => {
          const detailedExercise = listExercises.exercises.find(
            (item) => item.exercise === exercise.exerciseIdentifier
          );
          return {
            ...exercise,
            details: detailedExercise || {}, // Agrega los detalles si existen
          };
        });
        console.log("f",enrichedExercises)
  
        setSelectedExercises(enrichedExercises);
      } else {
        setSelectedExercises([]);
      }
    } catch (error) {
      console.error(error)
    }
  }, [UserData, selectedDate]);
  
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
  
  const fetchPlanSchedule = async (userData) => {
    if (!userData.token || !userData.planId) {
      console.error("Token o PlanId no válidos");
      return;
    }
  
    try {
      console.log("userData.planId",userData.planId)
      const response = await axios.get(
        `https://fitai.cl/api/PlanSchedule/GetPlanScheduleById`,
        {
          params: { "planId": userData.planId },
          headers: { "Content-Type": "application/json", accesstoken: userData.token },
        }
      );
  
      if (response.status === 200) {
        const data = response.data;
        console.log("Calendario Recibido", data)
        const fechaActual = new Date();
        const endDate = new Date(data.endDate);

        if (endDate <= fechaActual) {
          // Aquí llega si el plan ha expirado
          router.push("/(tabs)/dashboard");
        }

        if(!userData.planExercisesDates) {
          console.log("a",!userData.planExercisesDates);
          const updatedUserData = { ...userData, planExercisesDates: data, };
          setUserData(updatedUserData);
          await StorageService.saveData("UserData", updatedUserData);
        } else {
          console.log("b",!userData.planExercisesDates);
          setUserData(userData);
        }
      }
    } catch (error) {
      if (error.status === 400) {
        // Si el estado es 400, mostrar modal para calendarizar plan
        console.log("No se encontró la planificación");
        setShowCalendarizeModal(true);
      } else {
        Alert.alert("Error", "Hubo un problema al cargar la planificación.");
      }
    }
  };

  const handleCalendarizePlan = (calendarization) => {
    if (calendarization) {
      setShowCalendarizeModal(false);
      setShowDateStartModal(true); // Muestra el modal para seleccionar la fecha de inicio de plan
    } else {
      setShowCalendarizeModal(false);
      router.push("/(tabs)/dashboard");
    }
  };

  const confirmStartDate = async (confirm) => {
    if (confirm) {
      if (!startDate) {
        Alert.alert("Error", "Por favor selecciona una fecha de inicio.");
        return;
      }
  
      try {
        // Llamada al endpoint
        const response = await axios.post(
          "https://fitai.cl/api/PlanSchedule/UpsertPlanSchedule",
          {
            planId: UserData?.exercisePlan?.planId,
            startDate: startDate,
          },
          {
            headers: {
              "Content-Type": "application/json",
              accesstoken: UserData?.token, // Asegúrate de que el token esté definido
            },
          }
        );
  
        // Si la respuesta es 200, muestra el objeto en la consola
        if (response.status === 200) {
          await fetchPlanSchedule(UserData)
          Alert.alert("Éxito", "Tu plan ha sido calendarizado correctamente.");
        } else {
          Alert.alert(
            "Error",
            `Hubo un problema al calendarizar el plan. Código de error: ${response.status}`
          );
          console.error("Error en la API:", response.status);
        }
      } catch (error) {
        // Manejo de errores
        if (error.response) {
          console.error("Error en la respuesta de la API:", error.response.data);
          Alert.alert("Error", "Hubo un problema con el servidor.");
        } else if (error.request) {
          console.error("No se recibió respuesta del servidor:", error.request);
          Alert.alert(
            "Error",
            "No se pudo conectar con el servidor. Verifica tu conexión."
          );
        } else {
          console.error("Error desconocido:", error.message);
          Alert.alert("Error", "Ocurrió un error inesperado.");
        }
      }
  
      setShowDateStartModal(false);
    } else {
      setShowDateStartModal(false);
      router.push("/(tabs)/dashboard");
    }
  };

  // Renderizar cada ejercicio
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.exerciseText}>{item.exerciseIdentifier}</Text>
      <Text style={styles.timeText}>{item.exerciseSubIdentifier}</Text>
      {item.details && (
        <>
          <Text style={styles.description}>{item.details.description}</Text>
          <Text style={styles.level}>Nivel: {item.details.level}</Text>
          <Text style={styles.equipment}>Equipo: {item.details.equipment}</Text>
          <View style={styles.itemsButtons}>
            <TouchableOpacity
                style={styles.buttonItem}
                accessibilityLabel="Cambiar Fecha de Ejecución"
                accessibilityHint="Presiona para cambiar la fecha de ejecución del ejercicio seleccionado"
                onPress={() => {
                  setSelectedExercise(item); // Establece el ejercicio seleccionado
                  setShowDateModal(true); // Muestra el modal para cambiar la fecha
                }}>
                <Text style={styles.buttonItemText}>Cambiar Fecha Ejecución</Text>
            </TouchableOpacity>
            <Link
              href={{
                pathname: "/exercise/[exercise]",
                params: { exercise: JSON.stringify(item) },
              }}
              asChild>
              <TouchableOpacity
                style={styles.buttonItem}
                accessibilityLabel="Ver detalle del ejercicio"
                accessibilityHint="Presiona para ver los detalles del ejercicio seleccionado">
                <Text style={styles.buttonItemText}>Detalle Ejercicio</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </>
      )}
      
    </View>
  );
  
  const handleChangeDate = async () => {
    if (!startDate) {
      Alert.alert("Error", "Por favor selecciona una nueva fecha.");
      return;
    }
  
    try {
      // Actualizar la fecha del ejercicio seleccionado
      const updatedExercises = UserData.planExercisesDates.exercices.map(
        (exercise) => {
          if (exercise.exerciseIdentifier === selectedExercise.exerciseIdentifier) {
            return { ...exercise, date: startDate.toISOString() }; // Cambiar la fecha del ejercicio seleccionado
          }
          return exercise;
        }
      );
  
      // Actualizar en UserData
      const updatedUserData = {
        ...UserData,
        planExercisesDates: { ...UserData.planExercisesDates, exercices: updatedExercises },
      };
      setUserData(updatedUserData);
  
      // Guardar los datos actualizados localmente
      await StorageService.saveData("UserData", updatedUserData);
      console.log("UserData.planExercisesDates.exercices", updatedUserData.planExercisesDates.exercices)
      // Enviar al endpoint
      const response = await axios.post(
        "https://fitai.cl/api/PlanSchedule/UpsertPlanSchedule",
        {"planSchedule":updatedExercises},
        {
          headers: {
            "Content-Type": "application/json",
            accesstoken: UserData.token,
          },
        }
      );
  
      if (response.status === 200) {
        Alert.alert("Éxito", "La fecha del ejercicio se actualizó correctamente.");
      } else {
        Alert.alert("Error", "No se pudo actualizar la fecha del ejercicio.");
      }
    } catch (error) {
      console.error("Error al actualizar la fecha del ejercicio:", error);
      Alert.alert("Error", "Ocurrió un problema al intentar cambiar la fecha.");
    } finally {
      setShowDateModal(false); // Cierra el modal
    }
  };

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
        <FlatList
          data={selectedExercises}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={
            <View style={styles.noItems}>
              <Text style={{ color: "#610588", fontWeight: "600" }}>
                No hay ejercicios para esta fecha.
              </Text>
            </View>
          }
        />
      </CalendarProvider>

      {/* Modal para calendarizar */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCalendarizeModal}
        onRequestClose={() => setShowCalendarizeModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              ¿Deseas calendarizar tu plan de ejercicios?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.buttonModal, { marginRight: 10 }]}
                onPress={() => handleCalendarizePlan(true)}>
                <Text style={styles.buttonTextModal}>Sí</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonCancelModal}
                onPress={() => handleCalendarizePlan(false)}>
                <Text style={styles.buttonTextCancelModal}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para seleccionar la fecha */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showDateStartModal}
        onRequestClose={() => setShowDateStartModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Selecciona la fecha de inicio</Text>
            <InputCalendar
              placeholder="Fecha de inicio"
              value={startDate}
              onChange={setStartDate}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.buttonModal, { marginRight: 10 }]}
                onPress={() => confirmStartDate(true)}>
                <Text style={styles.buttonTextModal}>Confirmar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonCancelModal}
                onPress={() => confirmStartDate(false)}>
                <Text style={styles.buttonTextCancelModal}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para cambiar la fecha del ejercicio */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showDateModal}
        onRequestClose={() => setShowDateModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Selecciona la nueva fecha de ejecución del ejercicio
            </Text>
            <InputCalendar
              placeholder="Nueva Fecha de Ejecución"
              value={startDate}
              onChange={setStartDate}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.buttonModal, { marginRight: 10 }]}
                onPress={handleChangeDate}>
                <Text style={styles.buttonTextModal}>Confirmar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonCancelModal}
                onPress={() => setShowDateModal(false)}>
                <Text style={styles.buttonTextCancelModal}>Cancelar</Text>
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
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    margin: 10,
  },
  itemsButtons: {
    marginTop: 10,
    flexDirection: "row", // Alineación horizontal de los botones
    justifyContent: "space-between",
    width: "100%",
  },
  buttonItem: {
    backgroundColor: "#610588",
    paddingVertical: 10,
    width: "49%",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonItemText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  exerciseText: {
    fontSize: 20,
    color: "#000",
    fontWeight: "600",
  },
  timeText: {
    marginTop: 5,
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
  // Estilos para el modal
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
    paddingHorizontal: 10, // Un poco más de espacio horizontal para los botones
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
    paddingHorizontal: 10,
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

export default MyCalendar;
