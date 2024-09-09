import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router'; 
import { PilatesIcon } from '../../components/(common)/Icons'; 

const ExerciseDetail = () => {
  const { exercise } = useLocalSearchParams();
  const exerciseData = JSON.parse(exercise); // Convierte el string en un objeto JSON

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <PilatesIcon style={styles.icon} />  
        <Text style={styles.title}>{exerciseData.name}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.detail}>Hora: {exerciseData.time}</Text>
        <Text style={styles.detail}>Duración: {exerciseData.duration}</Text>
        <Text style={styles.detail}>Descripción: {exerciseData.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#181d1f', // Fondo oscuro
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
    color: '#610588', // Morado oscuro
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', // Texto blanco
  },
  detailsContainer: {
    backgroundColor: '#212527', // Fondo claro
    padding: 15,
    borderRadius: 10,
  },
  detail: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
});

export default ExerciseDetail;
