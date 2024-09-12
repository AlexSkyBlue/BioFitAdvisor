import { Feather, FontAwesome5, FontAwesome } from "@expo/vector-icons";

// Ícono de Información
export const CircleInfoIcon = (props) => (
  <FontAwesome5 name="info-circle" size={24} color="white" {...props} />
);

// Ícono del Dashboard
export const DashboardIcon = (props) => (
  <FontAwesome name="tachometer" size={32} color="white" {...props} />
);

// Ícono del Usuario
export const UserIcon = (props) => (
  <Feather name="user" size={24} color="white" {...props} />
);

// Ícono de los Objetivos (Pesas)
export const GoalsIcon = (props) => (
  <FontAwesome5 name="dumbbell" size={24} color="white" {...props} />
);

// Ícono de Calendario
export const CalendarIcon = (props) => (
  <Feather name="calendar" size={24} color="white" {...props} />
);

// Ícono de Logros (Trofeo)
export const TrophyIcon = (props) => (
  <FontAwesome5 name="trophy" size={24} color="white" {...props} />
);

// Ícono de Configuración (Engranaje)
export const SettingsIcon = (props) => (
  <Feather name="settings" size={24} color="white" {...props} />
);

export const LogOutIcon = (props) => (
  <FontAwesome5 
    name="sign-out-alt" 
    size={24} 
    color="white" 
    {...props}
  />
);

export const PilatesIcon = (props) => (
  <FontAwesome5 name="dumbbell" size={24} color="white" {...props} />
);

export const ArrowLeftIcon = (props) => (
  <Feather name="arrow-left" size={24} color="white" {...props} />
);

export const ArrowRightIcon = (props) => (
  <Feather name="arrow-right" size={24} color="white" {...props} />
);