import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { type LoginSchema, loginSchema } from "../schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { type RequestStatus } from "../types/request";
import { loginUser } from "../services/auth";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "../store/store";
import { setUser } from "../slices/userSlice";
import { useLazyGetUserQuery } from "../slices/apiSlice";
import {
  isApiSuccessResponse,
  isFetchBaseQueryError,
} from "../utils/typeGuards";
import Input from "../components/Input";
import { InputLocations } from "../types/input";
import { type User } from "../types/user";
import showToast from "../components/Toast";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const [requestStatus, setRequestStatus] = useState<RequestStatus>({
    loading: false,
    error: null,
  });
  const [getUser] = useLazyGetUserQuery();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLoginUser = async ({ email, password }: LoginSchema) => {
    try {
      setRequestStatus((prev) => ({ ...prev, loading: true }));

      // Login con Firebase
      const { uid } = await loginUser(email, password);

      // Obtener datos de la base de datos
      const userData = await getUser(uid).unwrap();

      setRequestStatus({
        loading: false,
        error: null,
      });

      // Retornamos los datos del usuario para agregarlos a un slice del estado global
      if (isApiSuccessResponse<User>(userData)) return userData.data;
    } catch (error) {
      if (error instanceof Error) {
        setRequestStatus({
          loading: false,
          error: error.message,
        });
      } else if (isFetchBaseQueryError(error)) {
        setRequestStatus({
          loading: false,
          error: error.data.message,
        });
      }
    }
  };

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    console.log("Datos a enviar: ", data);

    // Login con FireBase y obtención de datos del usuario
    const userData = await handleLoginUser({
      email: data.email,
      password: data.password,
    });

    if (!userData) return;

    // Almacenar datos del usuario en el estado global y en el localStorage -> VER SI TODO ESTÁ BIEN HASTA AHORA
    dispatch(setUser(userData));
    window.localStorage.setItem("user", JSON.stringify(userData));

    // Redireccionar al usuario logueado al Dashboard
    navigate("/dashboard");
  };

  const onError: SubmitErrorHandler<LoginSchema> = (errors) => {
    console.log("Los errores son: ", errors);

    showToast({
      position: "top-end",
      title: "Completa el formulario",
      icon: "warning",
    });
  };

  useEffect(() => {
    if (!requestStatus.error) return;

    const timer = 3000;

    showToast({
      position: "top-end",
      title: requestStatus.error,
      icon: "error",
      timer,
    });

    const timeout = setTimeout(
      () => setRequestStatus((prev) => ({ ...prev, error: null })),
      timer
    );

    return () => clearTimeout(timeout);
  }, [requestStatus.error]);

  return (
    <section className="w-full min-h-screen font-inter bg-[url('/images/imageBackground.jpg')] bg-cover bg-center lg:bg-left">
      <div className="w-full min-h-screen bg-black/70 flex flex-col justify-center items-center gap-5">
        <form
          className="w-[350px] flex flex-col gap-7 px-7 py-8 rounded-lg sm:px-0 sm:w-[400px] xl:gap-8"
          onSubmit={handleSubmit(onSubmit, onError)}
        >
          <h1 className="text-3xl font-bold text-center text-white xl:text-4xl xl:mb-4">
            Descubre el poder de DermAssist
          </h1>

          <Input<LoginSchema>
            type="email"
            placeholder="Correo Electrónico"
            name="email"
            location={InputLocations.registerOrLogin}
            register={register}
            errors={errors}
          />

          <Input<LoginSchema>
            type="password"
            placeholder="Contraseña"
            name="password"
            register={register}
            errors={errors}
            location={InputLocations.registerOrLogin}
          />

          <button
            className="w-full transition-colors duration-300 ease-in-out bg-primary hover:bg-primary-hover text-sm text-white px-4 py-3 rounded-full cursor-pointer font-semibold shadow-lg xl:text-base xl:mt-4"
            disabled={requestStatus.loading}
          >
            {requestStatus.loading ? "Iniciando Sesión ..." : "Iniciar Sesión"}
          </button>

          {requestStatus.error && (
            <p className="bg-red-400 mt-3 px-4 py-3 rounded-md text-center text-white text-sm">
              {requestStatus.error}
            </p>
          )}

          <div className="self-center text-center flex flex-col gap-2">
            <p className="text-sm text-white xl:text-base">
              ¿No tienes una cuenta aún?
            </p>
            <Link
              to="/signup"
              className="text-sm underline text-primary cursor-pointer xl:text-base"
            >
              Regístrate aquí
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
