import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Audio } from "expo-av";
import { PilatesIcon } from "../../components/(common)/Icons";

const ExerciseDetail = () => {
  const { exercise } = useLocalSearchParams();
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [iteration, setIteration] = useState(1);
  var totalIterations = 0;
  var durationPerIteration = 0;
  var restDuration = 0;
  var dateExercise = "";
  var dateExerciseDescription = "";

  const [sound, setSound] = useState(null);
  console.log("exercise", exercise)
  if (!exercise) {
    return <Text>Datos no disponibles</Text>;
  }

  const exerciseData =
    typeof exercise === "string"
      ? JSON.parse(exercise)
      : Array.isArray(exercise)
      ? JSON.parse(exercise[0])
      : null;

  if (!exerciseData) {
    return (
      <Text>
        Los datos del ejercicio no están disponibles o son incorrectos.
      </Text>
    );
  } else {
    totalIterations = exerciseData.details.totalIterations;
    durationPerIteration = exerciseData.details.durationPerIteration;
    restDuration = exerciseData.details.restDuration;
    dateExercise = exerciseData.date.split("T")[0];
    // Formatear la fecha en el formato deseado
    const [year, month, day] = dateExercise.split("-");
    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    dateExerciseDescription = `${parseInt(day)} de ${months[parseInt(month) - 1]} de ${year}`;
  }

  async function playSound(soundFile: any) {
    const { sound } = await Audio.Sound.createAsync(soundFile);
    setSound(sound);
    await sound.playAsync();
  }

  async function playChangeSound() {
    await playSound(require("../../assets/sounds/change_timer_sound.mp3"));
  }

  async function playSuccessSound() {
    await playSound(require("../../assets/sounds/success_sound.mp3"));
  }

  useEffect(() => {
    let interval = null;

    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    if (time >= durationPerIteration && !isResting) {
      playChangeSound();
      setIsResting(true);
      setTime(0);
    }

    if (time >= restDuration && isResting) {
      playChangeSound();
      setIsResting(false);
      setTime(0);
      setIteration((prevIteration) => prevIteration + 1);

      if (iteration >= totalIterations) {
        playSuccessSound();
        setIsRunning(false);
        setTime(0);
        setIteration(1);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, isPaused, time, isResting]);

  useEffect(() => {
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    setIsRunning(false);
    setTime(0);
    setIteration(1);
  };
  console.log("exerciseData",exerciseData)
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}> 
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <PilatesIcon style={styles.icon} />
          <Text style={styles.title}>{exerciseData.details.exercise}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detail}>
            Músculos trabajados:{" "}
            {exerciseData.details.muscles ? exerciseData.details.muscles.join(", ") : "No especificado"}
          </Text>
          <Text style={styles.detail}>
            Equipo: {exerciseData.details.equipment || "No especificado"}
          </Text>
          <Text style={styles.detail}>
            Fecha de ejecución: {dateExerciseDescription || "No especificado"}
          </Text>
          <Text style={styles.detail}>
            Nivel: {exerciseData.details.level || "No especificado"}
          </Text>
          <Text style={styles.detail}>
            Iteraciones: {exerciseData.details.totalIterationsDescription || "No especificado"}
          </Text>
          <Text style={styles.detail}>
            Duración de iteración: {exerciseData.details.durationPerIterationDescription || "No especificado"}
          </Text>
          <Text style={styles.detail}>
            Descripción: {exerciseData.details.description || "No especificado"}
          </Text>
          <Text style={styles.detail}>
            Errores comunes:{" "}
            {exerciseData.details.common_mistakes
              ? exerciseData.details.common_mistakes.join(", ")
              : "No especificado"}
          </Text>
          <Text style={styles.detail}>
            Beneficios: {exerciseData.details.health_benefits || "No especificado"}
          </Text>
          <Text style={styles.detail}>
            Tiempo de descanso: {exerciseData.details.restDurationDescription || "No especificado"}
          </Text>
        </View>

        <View style={styles.timerContainer}>
        {dateExercise === new Date().toISOString().split("T")[0] ? (
          !isRunning ? (
            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
              <Text style={styles.buttonText}>Iniciar Ejercicio</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.controls}>
              <Text style={styles.timer}>
                {Math.floor(time / 60).toString().padStart(2, "0")}:
                {(time % 60).toString().padStart(2, "0")}
              </Text>
              <Text style={styles.detail}>
                {isResting
                  ? `Descanso de ${restDuration} segundos`
                  : `Iteración ${iteration} de ${totalIterations}`}
              </Text>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity style={styles.pauseButton} onPress={handlePause}>
                  <Text style={styles.buttonText}>
                    {isPaused ? "Reanudar" : "Pausar"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.stopButton} onPress={handleStop}>
                  <Text style={styles.buttonText}>Detener</Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        ) : (
          <View style={styles.noItems}>
            <Text style={{ color: "#610588", fontWeight: "600" }}>
              No puedes realizar este ejercicio debido a que tiene su fecha de ejecución para el día {dateExerciseDescription}.
            </Text>
          </View>
        )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
    color: "#610588", // Morado oscuro
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    textAlign: "left", // Asegura que el texto esté alineado a la izquierda
    flexShrink: 1, // Evita el desbordamiento
  },
  detailsContainer: {
    backgroundColor: "#c8c8c8",
    padding: 15,
    borderRadius: 10,
  },
  detail: {
    fontSize: 18,
    color: "#000",
    marginBottom: 10,
  },
  timerContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  timer: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#610588",
  },
  controls: {
    alignItems: "center",
  },
  noItems: {
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  startButton: {
    backgroundColor: "#610588",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  pauseButton: {
    backgroundColor: "#FFA500",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    marginRight: 20,
  },
  stopButton: {
    backgroundColor: "#FF0000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ExerciseDetail;
