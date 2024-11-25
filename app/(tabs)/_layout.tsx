import React from 'react';
import { createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap
 } from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { withLayoutContext } from "expo-router";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
 MaterialTopTabNavigationOptions,
 typeof Navigator,
 TabNavigationState<ParamListBase>,
 MaterialTopTabNavigationEventMap
>(Navigator);

const Layout = () => {
  return <MaterialTopTabs  screenOptions={{
    tabBarStyle: {
      backgroundColor: '#fff', // Fondo oscuro
    },
    tabBarIndicatorStyle: {
      backgroundColor: '#610588', // Indicador morado
      height: 4, // Ancho del indicador
    },
    tabBarActiveTintColor: '#610588', // Color del texto activo
    tabBarInactiveTintColor: '#000', // Color del texto inactivo
    tabBarLabelStyle: {
      fontSize: 9,
      fontWeight: 'bold',
      textTransform: 'uppercase', // Texto en mayúsculas
    },
    tabBarPressColor: '#E91E63', // Efecto de presionar en morado
  }}>
    <MaterialTopTabs.Screen name="dashboard" options={{ title: 'Dashboard' }} />
    <MaterialTopTabs.Screen name="muscleSelector" options={{ title: 'Ejercicios' }} />
    <MaterialTopTabs.Screen name="myCalendar" options={{ title: 'Mi Calendario' }} />
    <MaterialTopTabs.Screen name="configuration" options={{ title: 'Configuración' }} />
  </MaterialTopTabs>;
};
export default Layout;