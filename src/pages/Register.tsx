import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { registerSchema, type RegisterSchema } from "../schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { registerUser } from "../services/auth";
import { useEffect, useState } from "react";
import { RequestStatus } from "../types/request";
import { useRegisterUserMutation } from "../slices/apiSlice";
import { isFetchBaseQueryError } from "../utils/typeGuards";
import Input from "../components/Input";
import { InputLocations } from "../types/input";
import showToast from "../components/Toast";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const [registerUserOnTheServer] = useRegisterUserMutation();

  const [requestStatus, setRequestStatus] = useState<RequestStatus>({
    loading: false,
    error: null,
  });

  const onSubmit: SubmitHandler<RegisterSchema> = async (data) => {
    console.log("Enviando datos: ", data);

    const successfulRegistration = await handleRegisterUser({
      username: data.username,
      email: data.email,
      password: data.password,
    });

    if (!successfulRegistration) return;

    reset();
    alert("Registro exitoso");
  };

  const onError: SubmitErrorHandler<RegisterSchema> = (errors) => {
    console.log("Ocurrió un error: ", errors);

    showToast({
      position: "top-end",
      title: "Completa el formulario",
      icon: "warning",
    });
  };

  const handleRegisterUser = async ({
    email,
    password,
    username,
  }: RegisterSchema) => {
    try {
      setRequestStatus((prev) => ({ ...prev, loading: true }));

      // Registrar usuarios en FireBase
      const { uid } = await registerUser(email, password);
      // Registrar usuarios en MySQL
      await registerUserOnTheServer({ uid, email, username }).unwrap();

      setRequestStatus({
        loading: false,
        error: null,
      });

      return true;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Soy un error de tipo Error");
        setRequestStatus({
          loading: false,
          error: error.message,
        });
      } else if (isFetchBaseQueryError(error)) {
        console.log("Soy un error de tipo FetchBaseQueryError");
        setRequestStatus({
          loading: false,
          error: error.data.message,
        });
      }
    }
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
          onSubmit={handleSubmit(onSubmit, onError)}
          className="w-[350px] flex flex-col gap-7 px-7 py-8 rounded-lg sm:px-0 sm:w-[400px] xl:gap-8 transition-all duration-300 ease-in-out"
        >
          {/* {requestStatus.error && (
            <p className="bg-red-400 mt-3 px-4 py-3 rounded-md text-center text-white text-sm">
              {requestStatus.error}
            </p>
          )} */}

          <h1 className="text-3xl font-bold text-center text-white xl:text-4xl xl:mb-4">
            Regístrate y únete a DermAssist
          </h1>

          <Input<RegisterSchema>
            type="text"
            name="username"
            placeholder="Nombre de Usuario"
            location={InputLocations.registerOrLogin}
            register={register}
            errors={errors}
          />

          <Input<RegisterSchema>
            type="email"
            name="email"
            placeholder="Correo Electrónico"
            location={InputLocations.registerOrLogin}
            register={register}
            errors={errors}
          />

          <Input<RegisterSchema>
            type="password"
            name="password"
            placeholder="Contraseña"
            location={InputLocations.registerOrLogin}
            register={register}
            errors={errors}
          />

          <button
            className="w-full transition-colors duration-300 ease-in-out bg-primary hover:bg-primary-hover text-sm text-white px-4 py-3 rounded-full cursor-pointer font-semibold shadow-lg xl:text-base xl:mt-4"
            disabled={requestStatus.loading}
          >
            {requestStatus.loading ? "Registrando ..." : "Registrarse"}
          </button>

          <div className="self-center text-center flex flex-col gap-2">
            <p className="text-sm text-white xl:text-base">
              ¿Ya tienes una cuenta?
            </p>
            <Link
              to="/login"
              className="text-sm underline text-primary cursor-pointer xl:text-base"
            >
              Inicia sesión aquí
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Register;
