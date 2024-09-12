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
      backgroundColor: '#000', // Fondo oscuro
    },
    tabBarIndicatorStyle: {
      backgroundColor: '#E879F9', // Indicador morado
      height: 4, // Ancho del indicador
    },
    tabBarActiveTintColor: '#E879F9', // Color del texto activo
    tabBarInactiveTintColor: '#fff', // Color del texto inactivo
    tabBarLabelStyle: {
      fontSize: 9,
      fontWeight: 'bold',
      textTransform: 'uppercase', // Texto en mayúsculas
    },
    tabBarPressColor: '#610588', // Efecto de presionar en morado
  }}>
    <MaterialTopTabs.Screen name="dashboard" options={{ title: 'Dashboard' }} />
    <MaterialTopTabs.Screen name="nutrition" options={{ title: 'Nutrición' }} />
    <MaterialTopTabs.Screen name="myCalendar" options={{ title: 'Mi Calendario' }} />
    <MaterialTopTabs.Screen name="configuration" options={{ title: 'Configuración' }} />
  </MaterialTopTabs>;
};
export default Layout;