export const saveToLocalStorage = (value: any): void => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem("user", serializedValue);
    console.log("guardados en el storage");
    console.log(serializedValue)
  } catch (error) {
    console.error("Error al guardar en localStorage: ", error);
  }
};

export const getFromLocalStorage = (): any | null => {
  try {
    const serializedValue = localStorage.getItem("user");
    if (serializedValue === null) {
      return null;
    }
    return JSON.parse(serializedValue);
  } catch (error) {
    console.error("Error al obtener de localStorage: ", error);
    return null;
  }
};
