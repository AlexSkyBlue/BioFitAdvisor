import { StatusBar } from "expo-status-bar";
import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  TouchableOpacity,
  Dimensions, // Importar Dimensions
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import Slider from "@react-native-community/slider";
import CameraButton from "./CameraButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TakeImage({ onPictureSaved, setPermissionsReady }) {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaLibraryPermissionResponse, requestMediaLibraryPermission] =
    MediaLibrary.usePermissions();
  const [cameraProps, setCameraProps] = useState({
    zoom: 0,
    facing: "back",
    flash: "off",
    animateShutter: false,
    enableTorch: false,
  });
  const [image, setImage] = useState(null);
  const [previousImage, setPreviousImage] = useState(null);

  const cameraRef = useRef(null);

  //to load the last saved image when permissions change
  useEffect(() => {
    if (!cameraPermission || !mediaLibraryPermissionResponse) {
      setPermissionsReady(false); // Notifica al componente padre que no tiene permisos
    } else if (
      cameraPermission.granted &&
      mediaLibraryPermissionResponse.status === "granted"
    ) {
      setPermissionsReady(true); // Notifica que los permisos están listos
      getLastSavedImage(); // Cargar la última imagen guardada
    } else {
      setPermissionsReady(false);
    }
  }, [cameraPermission, mediaLibraryPermissionResponse, setPermissionsReady]);

  //function to toggle camera properties
  const toggleProperty = (prop, option1, option2) => {
    setCameraProps((current) => ({
      ...current,
      [prop]: current[prop] === option1 ? option2 : option1,
    }));
  };

  //function to zoom in
  const zoomIn = () => {
    setCameraProps((current) => ({
      ...current,
      zoom: Math.min(current.zoom + 0.1, 1),
    }));
  };

  //function to zoom out
  const zoomOut = () => {
    setCameraProps((current) => ({
      ...current,
      zoom: Math.max(current.zoom - 0.1, 0),
    }));
  };

  //function to take a picture and show it without saving it
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const picture = await cameraRef.current.takePictureAsync();
        setImage(picture.uri);
      } catch (err) {
        console.log("Error while taking the picture : ", err);
      }
    }
  };

  //function to save the picture using MediaLibrary
  const savePicture = async () => {
    if (image) {
      try {
        const asset = await MediaLibrary.createAssetAsync(image);
        const assetInfo = await MediaLibrary.getAssetInfoAsync(asset.id);

        // Notificar al componente padre que la imagen se guardó, pasándole la URI de la imagen
        onPictureSaved(assetInfo.localUri || assetInfo.uri);

        setImage(null);
        getLastSavedImage();
      } catch (err) {
        console.log("Error while saving the picture : ", err);
      }
    }
  };

  //function to get the last saved image from the 'DCIM' album created in the gallery by expo
  const getLastSavedImage = async () => {
    if (
      mediaLibraryPermissionResponse &&
      mediaLibraryPermissionResponse.status === "granted"
    ) {
      const dcimAlbum = await MediaLibrary.getAlbumAsync("DCIM");

      if (dcimAlbum) {
        const { assets } = await MediaLibrary.getAssetsAsync({
          album: dcimAlbum,
          sortBy: [[MediaLibrary.SortBy.creationTime, false]],
          mediaType: MediaLibrary.MediaType.photo,
          first: 1,
        });

        if (assets.length > 0) {
          const assetInfo = await MediaLibrary.getAssetInfoAsync(assets[0].id);
          setPreviousImage(assetInfo.localUri || assetInfo.uri);
        } else {
          setPreviousImage(null);
        }
      } else {
        setPreviousImage(null);
      }
    }
  };

  if (!cameraPermission || !mediaLibraryPermissionResponse) {
    // Mientras los permisos aún se están cargando.
    setPermissionsReady(false); // Esto notificará al componente padre que no tiene permisos
    return <View />;
  }

  if (
    !cameraPermission.granted ||
    mediaLibraryPermissionResponse.status !== "granted"
  ) {
    // Si los permisos no han sido otorgados.
    setPermissionsReady(false); // Notifica que los permisos aún no están listos
    if (!cameraPermission || !mediaLibraryPermissionResponse) {
      return (
        <View style={styles.container}>
          <Text style={styles.text}>
            Necesitamos permisos de cámara y galería para continuar.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              requestCameraPermission();
              requestMediaLibraryPermission();
            }}>
            <Text style={styles.buttonText}>Otorgar Permisos</Text>
            <MaterialCommunityIcons
              name="cellphone-check"
              style={{ marginLeft: 10 }}
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>
      );
    }
  }

  // Si los permisos han sido otorgados
  setPermissionsReady(true); // Actualiza el estado en el componente padre a "true"

  return (
    <View style={styles.container}>
      {!image ? (
        <View className={"w-[100vw]"} style={{ flex: 1 }}>
          <View style={styles.topControlsContainer}>
            <CameraButton
              style={{ width: 40 }}
              icon={
                cameraProps.enableTorch ? "flashlight-on" : "flashlight-off"
              }
              onPress={() => toggleProperty("enableTorch", true, false)}
              accessibilityLabel="Flash de Cámara"
              accessibilityHint="Activar o Desactivar Flash de Cámara"
            />
          </View>
          <CameraView
            style={styles.camera}
            zoom={cameraProps.zoom}
            facing={cameraProps.facing}
            flash={cameraProps.flash}
            animateShutter={cameraProps.animateShutter}
            enableTorch={cameraProps.enableTorch}
            ref={cameraRef}
          />
          <View style={styles.sliderContainer}>
            <CameraButton
              style={{ width: 40 }}
              icon="zoom-out"
              onPress={zoomOut}
              accessibilityLabel="Reducir zoom"
              accessibilityHint="Disminuye el nivel de zoom"
            />
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              value={cameraProps.zoom}
              onValueChange={(value) =>
                setCameraProps((current) => ({ ...current, zoom: value }))
              }
              step={0.1}
              accessibilityLabel="Control deslizante de zoom"
              accessibilityHint="Ajusta el nivel de zoom de la cámara"
              accessibilityValue={{
                min: "Sin zoom",
                max: "Zoom máximo",
                now: `${Math.round(cameraProps.zoom * 100)}%`,
              }}
            />
            <CameraButton
              style={{ width: 40 }}
              icon="zoom-in"
              onPress={zoomIn}
              accessibilityLabel="Aumentar zoom"
              accessibilityHint="Incrementa el nivel de zoom"
            />
          </View>
          <View style={styles.bottomControlsContainer}>
            <TouchableOpacity
              onPress={() => previousImage && setImage(previousImage)}>
              <Image
                source={{ uri: previousImage }}
                style={styles.previousImage}
              />
            </TouchableOpacity>

            <CameraButton
              icon="camera"
              size={60}
              style={{ height: 60 }}
              onPress={takePicture}
              accessibilityLabel="Tomar foto"
              accessibilityHint="Captura una imagen usando la cámara"
            />
            <CameraButton
              icon="flip-camera-ios"
              onPress={() => toggleProperty("facing", "front", "back")}
              size={40}
              accessibilityLabel="Cambiar cámara"
              accessibilityHint="Alterna entre la cámara frontal y trasera"
            />
          </View>
        </View>
      ) : (
        <View className={"w-[100vw]"} style={{ flex: 1 }}>
          <Image source={{ uri: image }} style={styles.camera} />
          <View style={styles.bottomControlsContainer}>
            <CameraButton
              icon="flip-camera-android"
              onPress={() => setImage(null)}
            />
            <CameraButton icon="check" onPress={savePicture} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  topControlsContainer: {
    height: 70,
    backgroundColor: "black",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#E91E63",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  camera: {
    flex: 1,
    width: "auto",
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  },
  sliderContainer: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    flexDirection: "row",
  },
  bottomControlsContainer: {
    height: 90,
    backgroundColor: "black",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  previousImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
});
