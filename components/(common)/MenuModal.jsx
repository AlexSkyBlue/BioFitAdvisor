import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Componente del Modal
export default function MenuModal({ isVisible, onClose }) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalView}>
        <View style={styles.menuContainer}>
          {/* Opciones del menú */}
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Mis Rutinas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Mi Calendario</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Mi Nutrición</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Temporizador</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Configuración</Text>
          </TouchableOpacity>

          {/* Botón de cerrar */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// Estilos
const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)', // Fondo más oscuro para destacar el modal
  },
  menuContainer: {
    backgroundColor: '#212527', // Color claro para el fondo del menú
    width: '90%', 
    height: '85%',
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center', // Centra el contenido del menú
    alignItems: 'center',
  },
  menuItem: {
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#610588', // Color morado oscuro para los ítems del menú
    width: '80%',
    borderRadius: 10, // Bordes redondeados para los botones del menú
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8, // Elevación para dar un efecto de sombra
  },
  menuText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 40,
    backgroundColor: '#610588', // Mismo color para el botón de cierre
    borderRadius: 50, // Círculo
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  closeText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
});
