import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../store/store";
import { logoutUser } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { setUser } from "../slices/userSlice";
import FuncionalityCard from "../components/FuncionalityCard";
import { PiCameraPlusBold } from "react-icons/pi";
import { FaRegClock } from "react-icons/fa";
import { LuHospital } from "react-icons/lu";
import { useEffect } from "react";
import showToast from "../components/Toast";

// TODO: Hacer que si ya hay datos del usuario en el localStorage -> Que siempre se le mande de frente a Dashboard | Sino que cada vez que se cierra la web, que se elimine al usuario del localStorate, creo que se podría hacer con sesionStorage

const Dashboard = () => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogoutUser = async () => {
    try {
      await logoutUser();

      window.localStorage.removeItem("user");
      dispatch(setUser({ uid: "", email: "", username: "" }));
      navigate("/login");
    } catch (error) {}
  };

  useEffect(() => {
    showToast({
      position: "top-end",
      icon: "success",
      title: `Bienvenido, ${user.username} 👋`,
    });
  }, []);

  // Estando ya acá es donde recién haré el envío de la imagen
  return (
    <section className="min-h-screen font-inter px-12 py-14 bg-gradient-to-b from-primary to-white flex flex-col justify-center gap-7 md:px-24 lg:px-28 xl:px-48">
      <h1 className="text-center font-bold text-white text-3xl tracking-wider min-[500px]:text-4xl">
        ¡Bienvenido a DermAssist!
      </h1>

      <p className="text-center text-sm mb-2 md:mb- min-[500px]:text-base lg:mb-8">
        ¡Hola {user.username}! Bienvenido a DermAssist, tu asistente inteligente
        para el cuidado de la piel.{" "}
        <span className="hidden sm:inline">
          Aquí puedes subir una foto para obtener una posible detección de
          enfermedades cutáneas, conocer más sobre cada diagnóstico gracias a
          nuestra IA generativa y descubrir clínicas cercanas donde puedes
          recibir atención profesional.
        </span>
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <FuncionalityCard
          title="Diagnóstico de piel"
          description="Sube una foto de tu piel para detectar posibles enfermedades mediante inteligencia artificial."
          icon={
            <PiCameraPlusBold className="text-[34px] shrink-0 text-primary-hard min-[500px]:text-[40px]" />
          }
          destinationRoute="/diagnostic"
        />
        <FuncionalityCard
          title="Historial de predicciones"
          description="Revisa todas tus predicciones anteriores, con detalles como la imagen analizada, diagnóstico y nivel de confianza."
          icon={
            <FaRegClock className="text-3xl shrink-0 text-primary-hard min-[500px]:text-4xl" />
          }
          destinationRoute="/dashboard"
        />
        <FuncionalityCard
          title="Clínicas aliadas"
          description="Encuentra centros médicos recomendados donde puedes recibir atención profesional para tu diagnóstico."
          icon={
            <LuHospital className="text-3xl shrink-0 text-primary-hard min-[500px]:text-4xl" />
          }
          destinationRoute="/dashboard"
        />
      </div>

      {/* <pre className="my-20">{JSON.stringify(user, null, 2)}</pre> */}
      <button
        className="transition-colors duration-300 ease-in-out bg-primary-hard hover:bg-primary-hard-hover text-sm text-white px-8 py-3 rounded-lg cursor-pointer font-semibold self-center shadow-lg xl:text-base xl:mt-4"
        onClick={handleLogoutUser}
      >
        Cerrar Sesión
      </button>
    </section>
  );
};

export default Dashboard;
