import React, { useState, useEffect, useCallback } from 'react';
import { TouchableOpacity, FlatList } from 'react-native';
import { View, Text, StyleSheet } from 'react-native';
import { ExpandableCalendar, CalendarProvider, LocaleConfig } from 'react-native-calendars';
import { useRouter } from 'expo-router'; 

// Configuración de localización
LocaleConfig.locales['es'] = {
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

const exerciseData = {
  '2024-09-25': [
    { name: 'Yoga', time: '8 AM - 9 AM', duration: '1h', description: 'Sesión de Yoga' },
    { name: 'Cardio', time: '10 AM - 11 AM', duration: '1h', description: 'Cardio de alta intensidad' }
  ],
  '2024-09-26': [
    { name: 'Pilates', time: '9 AM - 10 AM', duration: '1h', description: 'Pilates Reformer' },
    { name: 'Entrenamiento de fuerza', time: '11 AM - 12 PM', duration: '1h', description: 'Entrenamiento de cuerpo completo' }
  ],
  '2024-09-27': [
    { name: 'TRX', time: '10 AM - 11 AM', duration: '1h', description: 'Entrenamiento en suspensión' }
  ]
};

const MyCalendar = () => {
  const [selectedDate, setSelectedDate] = useState('2024-09-25');
  const [items, setItems] = useState([]);
  const [markedDates, setMarkedDates] = useState({
    '2024-09-25': { selected: true, marked: true, selectedColor: '#E879F9', selectedTextColor: '#fff' },
    '2024-09-26': { marked: true, dotColor: '#E879F9' },
    '2024-09-27': { marked: true, dotColor: '#E879F9' }
  });
  
  const router = useRouter();

  useEffect(() => {
    setItems(exerciseData[selectedDate] || []);
    const newMarkedDates = {
      [selectedDate]: { selected: true, selectedColor: '#E879F9', selectedTextColor: '#fff' }
    };
    Object.keys(exerciseData).forEach(date => {
      if (!newMarkedDates[date]) {
        newMarkedDates[date] = { marked: true, dotColor: '#E879F9' };
      }
    });
    setMarkedDates(newMarkedDates);
  }, [selectedDate]);

  const renderItem = useCallback(
    ({ item }) => (
      <View style={styles.item}>
        <Text style={styles.exerciseText}>{item.name}</Text>
        <Text style={styles.timeText}>{item.time} - {item.duration}</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push({ pathname: '/exercise/[exercise]', params: { exercise: JSON.stringify(item) } })}
        >
          <Text style={styles.buttonText}>Info</Text>
        </TouchableOpacity>
      </View>
    ),
    []
  );

  return (
    <CalendarProvider style={{ backgroundColor: '#000' }} date={selectedDate}>
      <ExpandableCalendar
        firstDay={1}
        theme={{
          calendarBackground: '#181d1f',
          selectedDayBackgroundColor: '#610588',
          selectedDayTextColor: '#fff',
          todayTextColor: '#E879F9',
          dayTextColor: '#fff',
          monthTextColor: '#fff',
          arrowColor: '#E879F9',
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
          <Text style={{ color: '#fff' }}>No hay eventos para esta fecha.</Text>
        </View>
      )}
    </CalendarProvider>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#181d1f', // Fondo morado oscuro
    padding: 20,
    marginVertical: 10,
    borderRadius: 12, // Esquinas más redondeadas
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  exerciseText: {
    fontSize: 20, // Tamaño de fuente más grande para mejor visibilidad
    color: '#fff',
    fontWeight: '600', // Fuente más gruesa
    marginBottom: 5, // Espacio entre el texto y la hora
  },
  timeText: {
    fontSize: 16, // Texto de la hora ligeramente más grande
    color: '#d1d1d1', // Texto gris claro para contraste
    marginBottom: 10, // Espacio entre el texto de la hora y la descripción
  },
  noItems: {
    backgroundColor: '#181d1f', // Fondo más oscuro cuando no hay eventos
    paddingVertical: 30, // Más espacio cuando no hay eventos
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    backgroundColor: '#610588', // Mantenemos el botón en rosa vibrante
    padding: 12, // Espacio adicional en el botón
    borderRadius: 8, // Botón con esquinas más redondeadas
    alignItems: 'center', // Centramos el texto del botón
    justifyContent: 'center',
    shadowColor: '#000', // Sombra para mayor efecto de profundidad
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16, // Texto del botón ligeramente más grande
  },
});

export default MyCalendar;
