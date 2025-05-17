// Tipo base para respuestas exitosas
export type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};

// Tipo base para respuestas con error
export type ApiErrorResponse = {
  success: false;
  message: string;
  error: {
    statusCode: number;
    details?: string[] | null;
  };
};

// Unión para manejar ambos casos
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
