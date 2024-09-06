import { Feather, FontAwesome6 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

export const CircleInfoIcon = (props) => (
  <FontAwesome6 name="circle-info" size={24} color="white" {...props} />
);

export const DashboardIcon = (props) => (
  <FontAwesome name="tachometer" size={32} color="white" {...props} />
);

export const UserIcon = (props) => (
  <Feather name="user" size={24} color="white" {...props} />
);
