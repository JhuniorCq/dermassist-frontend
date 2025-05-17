import { useDispatch } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import { type AppDispatch } from "./store/store";
import { useEffect, useState } from "react";
import { setUser } from "./slices/userSlice";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  // Bandera para indicar si ya se revisó la existencia del usuario en el localStorage
  const [isUserChecked, setIsUserChecked] = useState(false);

  useEffect(() => {
    const userInTheLocalStorage = window.localStorage.getItem("user");

    if (userInTheLocalStorage) {
      console.log(
        "Estoy en App, el usuario en el localStorage es: ",
        userInTheLocalStorage
      );
      dispatch(setUser(JSON.parse(userInTheLocalStorage)));
    }

    setIsUserChecked(true); // <- indicar que ya terminamos de revisar
  }, []);

  if (!isUserChecked) {
    return <div>Cargando...</div>;
  }

  return <AppRoutes />;
}

export default App;
