import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { IoAdd } from "react-icons/io5";
import {
  DiagnosticSchema,
  diagnosticSchema,
} from "../schemas/diagnosticSchema";
import {
  useObtainDiseaseInformationMutation,
  useSendImageMutation,
} from "../slices/apiSlice";
import {
  isApiSuccessResponse,
  isFetchBaseQueryError,
} from "../utils/typeGuards";
import showToast from "../components/Toast";
import Loader from "../components/Loader";
import { PredictionResponse } from "../types/prediction";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import useModal from "../hooks/useModal";
import Modal from "../components/Modal";

const Diagnostic = () => {
  const [
    sendImage,
    {
      data: predictionData,
      isLoading: predictionLoading,
      error: predictionError,
      reset: predictionReset,
    },
  ] = useSendImageMutation();
  const [
    requestDiseaseInformation,
    { data: diseaseData, isLoading: diseaseLoading, error: diseaseError },
  ] = useObtainDiseaseInformationMutation();
  const user = useSelector((state: RootState) => state.user);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { isOpen, open, close } = useModal(false);
  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(diagnosticSchema),
  });

  const insertImage = () => fileInputRef.current?.click();

  const removeImage = () => {
    if (!imagePreview) return;

    console.log("Removiendo imagen :D");

    // Elimino la imagen de la memoria del navegador
    URL.revokeObjectURL(imagePreview);

    setImagePreview(null);
    setValue("image", undefined as unknown as File, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    // Reseteo del estado que controla la solicitud de la predicción
    predictionReset();

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files?.[0]);
    const file = e.target.files?.[0];

    if (file) {
      if (imagePreview) {
        // Elimino la imagen anterior de la memoria (esto en caso ya haya una imagen seleccionada y se inserte otra que reemplace la anterior)
        URL.revokeObjectURL(imagePreview);
      }

      setValue("image", file, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      // URL.createObjectURL(file) crea una URL temporal hacia el archivo almacenado en el navegador
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit: SubmitHandler<DiagnosticSchema> = async (data) => {
    console.log("Imagen a enviar al servidor: ", data.image);

    try {
      const response = await sendImage({
        uid: user.uid,
        imageFile: data.image,
      }).unwrap();

      console.log(
        "Imagen enviada correctamente -> Respuesta del back: ",
        response
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error("Ocurruió un error al subir la imagen");
      } else if (isFetchBaseQueryError(error)) {
        console.error(
          "Soy un error de tipo FetchBaseQueryError en Diagnostic",
          error
        );
      }
    }
  };

  const obtainDiseaseInformation = async ({ disease }: { disease: string }) => {
    try {
      open();
      const response = await requestDiseaseInformation({ disease }).unwrap();

      console.log("Info de la enfermedad: ", response);
    } catch (error) {
      if (error instanceof Error) {
        console.log(
          "Ocurrió un problema al obtener la información de la enfermedad: ",
          error.message
        );
      } else if (isFetchBaseQueryError(error)) {
        console.log(
          "Ocurrió un problema al obtener la información de la enfermedad: ",
          error.data.message
        );
      }
    }
  };

  const onError: SubmitErrorHandler<DiagnosticSchema> = (errors) => {
    console.log("Errores: ", errors);
  };

  useEffect(() => {
    if (!predictionError) return;

    if (isFetchBaseQueryError(predictionError)) {
      showToast({
        position: "top-end",
        title: predictionError.data.message,
        icon: "warning",
      });
    }
  }, [predictionError]);

  useEffect(() => {
    if (!predictionData) return;

    if (isApiSuccessResponse<PredictionResponse>(predictionData)) {
      showToast({
        position: "top-end",
        title: predictionData.message,
        icon: "success",
      });
    }
  }, [predictionData]);

  return (
    <section className="w-full min-h-screen px-9 py-8 bg-gradient-to-b from-[#f3a486] to-white flex flex-col gap-7 items-center">
      <button
        className="flex items-center self-start gap-2 text-sm text-white cursor-pointer min-[500px]:text-base"
        onClick={() => navigate(-1)}
      >
        <IoMdArrowRoundBack />
        <span>Volver</span>
      </button>

      <h1 className="text-center font-bold text-white text-3xl tracking-wider min-[500px]:text-4xl">
        Zona de Predicciones
      </h1>

      <p className="text-center text-sm min-[500px]:text-base">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum
        suscipit dolore exercitationem rerum tempore molestiae.
      </p>

      <form
        className="flex flex-col gap-8"
        onSubmit={handleSubmit(onSubmit, onError)}
      >
        <div
          className={`relative inline-block ${
            imagePreview
              ? "w-fit h-auto min-[500px]:w-fit min-[500px]:h-96"
              : "w-60 h-72 min-[500px]:w-80 min-[500px]:h-96"
          } mx-auto transition-all duration-300 ease-in-out border-4 border-dashed border-primary-hard hover:border-primary-hard-hover hover:scale-[1.02] flex justify-center cursor-pointer items-center group`}
          onClick={insertImage}
        >
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Imagen seleccionada"
              className="w-full h-full object-contain"
            />
          ) : (
            <IoAdd className="text-primary-hard text-6xl transition-colors duration-300 ease-in-out group-hover:text-primary-hard-hover" />
          )}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {errors.image && (
          <p className="text-sm text-center text-red-500 min-[500px]:text-base">
            {errors.image.message}
          </p>
        )}

        <div className="mt-2 flex items-center justify-center gap-x-5 gap-y-3 flex-wrap">
          <button
            className={`text-sm outline-none px-4 py-2 ${
              predictionLoading
                ? "bg-gray-400 text-gray-300 cursor-auto"
                : "transition-colors duration-300 ease-in-out bg-primary hover:bg-primary-hover"
            } text-white rounded-lg min-[500px]:text-base`}
            disabled={predictionLoading}
          >
            Enviar imagen
          </button>

          <button
            type="button"
            className="text-sm outline-none px-4 py-2 transition-colors duration-300 ease-in-out bg-red-500 hover:bg-red-600 text-white rounded-lg min-[500px]:text-base"
            onClick={removeImage}
          >
            Quitar imagen
          </button>
        </div>
      </form>

      <div className="mt-5">
        {predictionLoading && <Loader />}

        {!predictionLoading &&
          !predictionError &&
          predictionData &&
          isApiSuccessResponse<PredictionResponse>(predictionData) && (
            <>
              {/* <pre>{JSON.stringify(predictionData, null, 2)}</pre> */}
              <div className="w-fit flex flex-col items-center gap-8">
                <div className="w-fit px-6 py-4 bg-white shadow-lg rounded-md flex flex-col gap-3 min-[440px]:w-80">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-sm min-[500px]:text-base">
                      Enfermedad:{" "}
                    </span>
                    <span className="text-right text-sm min-[500px]:text-base">
                      {predictionData.data.prediction}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-sm min-[500px]:text-base">
                      Probabilidad:{" "}
                    </span>
                    <span className="text-right text-sm min-[500px]:text-base">
                      {(predictionData.data.probability * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>

                <button
                  className="text-sm text-center transition-colors duration-300 ease-in-out bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg min-[500px]:text-base"
                  onClick={() =>
                    obtainDiseaseInformation({
                      disease: predictionData.data.prediction,
                    })
                  }
                >
                  ¿Deseas saber más de esta enfermedad?
                </button>

                {/* TODO: Hacer que la visualización del modal sea responsiva */}
                {/* También puedo hacer que mientras sea la misma enfermedad, se muestre la información obtenida en la primera vez que se hizo la pregunta -> Así NO se preguntar a la IA varias veces para la misma enfermedad -> Así hago que no se haga una solicitud HTTP de nuevo con la misma enfermedad */}
                <Modal isOpen={isOpen} close={close}>
                  {diseaseLoading && (
                    <div className="my-6">
                      <Loader />
                    </div>
                  )}

                  {!diseaseLoading &&
                    diseaseError &&
                    isFetchBaseQueryError(diseaseError) && (
                      <p className="text-center text-red-500">
                        {diseaseError.data.message}
                      </p>
                    )}

                  {!diseaseLoading &&
                    !diseaseError &&
                    diseaseData &&
                    isApiSuccessResponse<{ response: string }>(diseaseData) && (
                      <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-semibold">
                          {predictionData.data.prediction}
                        </h1>
                        <p>{diseaseData.data.response}</p>
                      </div>
                    )}
                </Modal>
              </div>
            </>
          )}
      </div>
    </section>
  );
};

export default Diagnostic;
