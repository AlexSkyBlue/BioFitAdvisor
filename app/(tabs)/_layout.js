// app/(tabs)/_layout.js
import { Tabs } from "expo-router";
import { DashboardIcon, UserIcon } from "../../components/(common)/Icons";

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
          tabBarLabelStyle: { fontSize: 11 },
          tabBarIcon: ({ color }) => <DashboardIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarLabelStyle: { fontSize: 11 },
          tabBarIcon: ({ color }) => <UserIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
