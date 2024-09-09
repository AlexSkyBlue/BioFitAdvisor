import { Tabs } from "expo-router";
import { CalendarIcon, DashboardIcon, UserIcon } from "../../components/(common)/Icons";
import { TouchableOpacity, View, Text } from 'react-native';
import MenuModal from '../../components/(common)/MenuModal'; // Importa el modal
import { useState } from "react";

export default function TabsLayout() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { 
            backgroundColor: "#181d1f", // Dark background for the tab bar
            display: "flex",
            justifyContent: "center", 
            alignItems: "center", 
            height: 70, 
            paddingBottom: 10, // Increased padding for button placement
            paddingTop: 10, 
          },
          tabBarActiveTintColor: "#610588", // Dark purple for active tab icons
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Dashboard",
            tabBarLabelStyle: { fontSize: 11 },
            tabBarIcon: ({ color }) => <DashboardIcon color={color} />,
          }}
        />
        <Tabs.Screen 
          name="myCalendar" 
          options={{
            title:"Mi Calendario", 
            tabBarLabelStyle: { fontSize: 11 },
            tabBarIcon: ({ color }) => <CalendarIcon color={color} />,
        }} />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Perfil",
            tabBarLabelStyle: { fontSize: 11 },
            tabBarIcon: ({ color }) => <UserIcon color={color} />,
          }}
        />
      </Tabs>

      {/* Floating Menu Button */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 60, // Adjusts height above the tab bar
          left: '52.5%',
          transform: [{ translateX: -32.5 }],
          backgroundColor: '#610588', // Dark purple button color
          width: 45,
          height: 46,
          borderRadius: 35,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        }}
        onPress={() => setModalVisible(true)}  // Display modal
      >
        <Text style={{ color: 'white', fontSize: 35 }}>≡</Text>
      </TouchableOpacity>

      {/* Modal with menu */}
      <MenuModal isVisible={modalVisible} onClose={() => setModalVisible(false)} />
    </>
  );
}
