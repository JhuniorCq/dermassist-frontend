import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { type ApiResponse } from "../types/apiResponse";
import { type UserRegistration, type User } from "../types/user";
import { URL_SERVER } from "../utils/constants";
import { PredictionResponse } from "../types/prediction";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: URL_SERVER }),
  endpoints: (builder) => ({
    // GET: Obtener un usuario
    getUser: builder.query<ApiResponse<User>, string>({
      query: (uid) => ({
        url: `user/${uid}`,
        method: "GET",
      }),
    }),

    // POST: Registrar un usuario
    registerUser: builder.mutation<
      ApiResponse<UserRegistration>,
      { uid: string; username: string; email: string }
    >({
      query: (userData) => ({
        url: "user",
        method: "POST",
        body: userData,
      }),
    }),

    // POST: Enviar una imagen
    sendImage: builder.mutation<
      ApiResponse<PredictionResponse>,
      { uid: string; imageFile: File }
    >({
      query: ({ uid, imageFile }) => {
        const formData = new FormData();
        formData.append("uid", uid);
        formData.append("image", imageFile);

        return {
          url: "prediction",
          method: "POST",
          body: formData,
        };
      },
    }),

    // POST: Obtener información de una enfermedad
    obtainDiseaseInformation: builder.mutation<
      ApiResponse<{ response: string }>,
      { disease: string }
    >({
      query: (diseaseData) => ({
        url: "disease/info",
        method: "POST",
        body: diseaseData,
      }),
    }),
  }),
});

export const {
  useLazyGetUserQuery,
  useRegisterUserMutation,
  useSendImageMutation,
  useObtainDiseaseInformationMutation,
} = apiSlice;
