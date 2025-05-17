import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../lib/firebase";

const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    console.log("Usuario registrado: ", userCredential.user);
    return userCredential.user;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Ocurrió un error en el registro: ", error.message);
      throw error;
    } else {
      console.error("Error: ", String(error));
      throw new Error("Error en el registro.");
    }
  }
};

const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    console.log("Usuario logueado: ", userCredential.user);

    return userCredential.user;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Ocurrió un error en el inicio de sesión. ", error.message);
      throw error;
    } else {
      console.error("Error: ", String(error));
      throw new Error("Error en el login.");
    }
  }
};

const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Ocurrió un error en el cierre de sesión: ", error.message);
      throw error;
    } else {
      console.error("Error: ", String(error));
      throw new Error("Error en el logout.");
    }
  }
};

export { registerUser, loginUser, logoutUser };
