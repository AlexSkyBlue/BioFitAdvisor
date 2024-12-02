import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
} from "react-native";
import exercisesLib from "../../lib/list-exercices-final.json"; // Importamos la lista de ejercicios

const MuscleSelector = () => {
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [filteredExercises, setFilteredExercises] = useState(
    exercisesLib.exercises
  );

  const musclesScrollRef = useRef(null);
  const equipmentScrollRef = useRef(null);

  const { muscles, equipment, level } = exercisesLib.groups;

  // Función para actualizar los ejercicios filtrados
  const filterExercises = () => {
    let filtered = exercisesLib.exercises;

    if (selectedMuscle) {
      filtered = filtered.filter((exercise) =>
        exercise.muscles.includes(selectedMuscle)
      );
    }

    if (selectedEquipment) {
      filtered = filtered.filter((exercise) =>
        exercise.equipment.includes(selectedEquipment)
      );
    }

    if (selectedLevel) {
      filtered = filtered.filter(
        (exercise) => exercise.level === selectedLevel
      );
    }

    setFilteredExercises(filtered);
  };

  useEffect(() => {
    filterExercises();
  }, [selectedMuscle, selectedEquipment, selectedLevel]);

  // Función para manejar la selección/deselección
  const toggleSelection = (currentValue, setValue) => {
    setValue((prev) => (prev === currentValue ? null : currentValue));
  };

  return (
    <View style={styles.container} accessible={false}>
      <View accessible={false}>
        {/* Selector de Músculos (scroll infinito hacia la derecha) */}
        <ScrollView
          className="py-2.5"
          keyboardShouldPersistTaps="handled"
          ref={musclesScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {muscles.map((muscle, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.filterButton,
                selectedMuscle === muscle && styles.selectedButton,
              ]}
              onPress={() => toggleSelection(muscle, setSelectedMuscle)}>
              <Text
                style={[
                  styles.filterText,
                  selectedMuscle === muscle && styles.selectedText,
                ]}>
                {muscle}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Selector de Equipamiento (scroll infinito hacia la izquierda) */}
        <ScrollView
          className="py-2.5"
          keyboardShouldPersistTaps="handled"
          ref={equipmentScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          inverted>
          {equipment.map((equip, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.filterButton,
                selectedEquipment === equip && styles.selectedButton,
              ]}
              onPress={() => toggleSelection(equip, setSelectedEquipment)}>
              <Text
                style={[
                  styles.filterText,
                  selectedEquipment === equip && styles.selectedText,
                ]}>
                {equip}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Selector de Nivel (fijo) */}
        <View style={styles.levelContainer} accessible={false}>
          {level.map((lvl, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.filterButton,
                selectedLevel === lvl && styles.selectedButton,
              ]}
              onPress={() => toggleSelection(lvl, setSelectedLevel)}>
              <Text
                style={[
                  styles.filterText,
                  selectedLevel === lvl && styles.selectedText,
                ]}>
                {lvl}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Lista de Ejercicios Filtrados con scroll vertical */}
      <FlatList
        data={filteredExercises}
        keyExtractor={(item, index) => index.toString()}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <View style={styles.exerciseItem} accessible={false}>
            <Text style={styles.exerciseTitle}>{item.exercise}</Text>
            <Text style={styles.exerciseDetail}>
              Músculos: {item.muscles.join(", ")}
            </Text>
            <Text style={styles.exerciseDetail}>Equipo: {item.equipment}</Text>
            <Text style={styles.exerciseDetail}>Nivel: {item.level}</Text>
          </View>
        )}
        style={styles.flatList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  filterButton: {
    height: 30, // Reducimos la altura
    paddingVertical: 5, // Menos padding vertical para reducir la altura
    paddingHorizontal: 10, // Ajustamos el padding horizontal
    backgroundColor: "#E0E0E0",
    marginHorizontal: 5,
    borderRadius: 20,
    justifyContent: "center", // Centramos el texto verticalmente
  },
  selectedButton: {
    backgroundColor: "#610588",
  },
  filterText: {
    color: "#000",
  },
  selectedText: {
    color: "#fff", // Cambiamos el color del texto del botón seleccionado a blanco
  },
  levelContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  exerciseItem: {
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginVertical: 5,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  exerciseDetail: {
    fontSize: 14,
    color: "#333",
  },
  flatList: {
    marginTop: 10,
  },
});

export default MuscleSelector;
