import { Link } from "expo-router";
import { Pressable, ScrollView, Text } from "react-native";
import { HomeIcon } from "../../components/(common)/Icons";
import { styled } from "nativewind";
import { Screen } from "../../components/Screen";

const StyledPressable = styled(Pressable);

export default function About() {
  return (
    <Screen>
      <ScrollView>
        <Link asChild href="/Index">
          <StyledPressable className={`active:opacity-50`}>
            <HomeIcon />
          </StyledPressable>
        </Link>
        <Text className="text-white font-bold mb-8 text-2xl">
          Sobre el proyecto
        </Text>
        <Text className="text-white text-white/90 mb-4">
          Lorem ipsum dolor sit cuchuflí barquillo bacán jote gamba listeilor po
          cahuín, luca melón con vino pichanga coscacho ni ahí peinar la muñeca
          chuchada al chancho achoclonar. Chorrocientos pituto ubicatex huevo
          duro bolsero cachureo el hoyo del queque en cana huevón el año del
          loly hacerla corta impeque de miedo quilterry la raja longi ñecla.
          Hilo curado rayuela carrete quina guagua lorea piola ni ahí.
        </Text>
        <Text className="text-white text-white/90 mb-4">
          Lorem ipsum dolor sit cuchuflí barquillo bacán jote gamba listeilor po
          cahuín, luca melón con vino pichanga coscacho ni ahí peinar la muñeca
          chuchada al chancho achoclonar. Chorrocientos pituto ubicatex huevo
          duro bolsero cachureo el hoyo del queque en cana huevón el año del
          loly hacerla corta impeque de miedo quilterry la raja longi ñecla.
          Hilo curado rayuela carrete quina guagua lorea piola ni ahí.
        </Text>
        <Text className="text-white text-white/90 mb-4">
          Lorem ipsum dolor sit cuchuflí barquillo bacán jote gamba listeilor po
          cahuín, luca melón con vino pichanga coscacho ni ahí peinar la muñeca
          chuchada al chancho achoclonar. Chorrocientos pituto ubicatex huevo
          duro bolsero cachureo el hoyo del queque en cana huevón el año del
          loly hacerla corta impeque de miedo quilterry la raja longi ñecla.
          Hilo curado rayuela carrete quina guagua lorea piola ni ahí.
        </Text>
        <Text className="text-white text-white/90 mb-4">
          Lorem ipsum dolor sit cuchuflí barquillo bacán jote gamba listeilor po
          cahuín, luca melón con vino pichanga coscacho ni ahí peinar la muñeca
          chuchada al chancho achoclonar. Chorrocientos pituto ubicatex huevo
          duro bolsero cachureo el hoyo del queque en cana huevón el año del
          loly hacerla corta impeque de miedo quilterry la raja longi ñecla.
          Hilo curado rayuela carrete quina guagua lorea piola ni ahí.
        </Text>
        <Text className="text-white text-white/90 mb-4">
          Lorem ipsum dolor sit cuchuflí barquillo bacán jote gamba listeilor po
          cahuín, luca melón con vino pichanga coscacho ni ahí peinar la muñeca
          chuchada al chancho achoclonar. Chorrocientos pituto ubicatex huevo
          duro bolsero cachureo el hoyo del queque en cana huevón el año del
          loly hacerla corta impeque de miedo quilterry la raja longi ñecla.
          Hilo curado rayuela carrete quina guagua lorea piola ni ahí.
        </Text>
        <Text className="text-white text-white/90 mb-4">
          Lorem ipsum dolor sit cuchuflí barquillo bacán jote gamba listeilor po
          cahuín, luca melón con vino pichanga coscacho ni ahí peinar la muñeca
          chuchada al chancho achoclonar. Chorrocientos pituto ubicatex huevo
          duro bolsero cachureo el hoyo del queque en cana huevón el año del
          loly hacerla corta impeque de miedo quilterry la raja longi ñecla.
          Hilo curado rayuela carrete quina guagua lorea piola ni ahí.
        </Text>
        <Text className="text-white text-white/90 mb-4">
          Lorem ipsum dolor sit cuchuflí barquillo bacán jote gamba listeilor po
          cahuín, luca melón con vino pichanga coscacho ni ahí peinar la muñeca
          chuchada al chancho achoclonar. Chorrocientos pituto ubicatex huevo
          duro bolsero cachureo el hoyo del queque en cana huevón el año del
          loly hacerla corta impeque de miedo quilterry la raja longi ñecla.
          Hilo curado rayuela carrete quina guagua lorea piola ni ahí.
        </Text>
        <Text className="text-white text-white/90 mb-4">
          Lorem ipsum dolor sit cuchuflí barquillo bacán jote gamba listeilor po
          cahuín, luca melón con vino pichanga coscacho ni ahí peinar la muñeca
          chuchada al chancho achoclonar. Chorrocientos pituto ubicatex huevo
          duro bolsero cachureo el hoyo del queque en cana huevón el año del
          loly hacerla corta impeque de miedo quilterry la raja longi ñecla.
          Hilo curado rayuela carrete quina guagua lorea piola ni ahí.
        </Text>
      </ScrollView>
    </Screen>
  );
}
