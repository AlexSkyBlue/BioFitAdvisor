import { View, Image, Text } from "react-native";
import Svg, { Path } from "react-native-svg";

export const Logo = (props) => (
  <Image
      source={require("../../assets/image/LOGO_MT_1.png")}
      style={{
        top: 0.5,
        width: 70,
        height: 40,
        resizeMode: "contain",
      }}
    />
);
