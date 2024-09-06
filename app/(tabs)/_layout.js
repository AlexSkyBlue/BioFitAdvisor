// app/(tabs)/_layout.js
import { Tabs } from "expo-router";
import { DashboardIcon, CircleInfoIcon } from "../../components/(common)/Icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Oculta el encabezado para las pantallas de las pestañas
        tabBarStyle: { backgroundColor: "#000" },
        tabBarActiveTintColor: "#e879f9",
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: "Dashboard",
          tabBarLabelStyle: { fontSize: 11.5 },
          tabBarIcon: ({ color }) => <DashboardIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarLabelStyle: { fontSize: 11.5 },
          tabBarIcon: ({ color }) => <CircleInfoIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
