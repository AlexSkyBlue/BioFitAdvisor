import AsyncStorage from "@react-native-async-storage/async-storage";

const StorageService = {
  // Guardar datos usando AsyncStorage
  async saveData(key, value) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      console.log(`Datos guardados correctamente con la clave: ${key}`);
    } catch (error) {
      console.error(`Error al guardar datos con la clave: ${key}`, error);
    }
  },

  // Obtener datos usando AsyncStorage
  async getData(key) {
    try {
      const result = await AsyncStorage.getItem(key);
      if (result) {
        return JSON.parse(result);
      } else {
        console.log(`No se encontraron datos para la clave: ${key}`);
        return null;
      }
    } catch (error) {
      console.error(`Error al obtener datos con la clave: ${key}`, error);
    }
  },

  // Eliminar datos usando AsyncStorage
  async deleteData(key) {
    try {
      await AsyncStorage.removeItem(key);
      console.log(`Datos eliminados correctamente con la clave: ${key}`);
    } catch (error) {
      console.error(`Error al eliminar datos con la clave: ${key}`, error);
    }
  },
};

export default StorageService;
