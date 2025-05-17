import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Ingrese su correo correctamente." }),
  password: z.string().min(1, { message: "La contraseña es obligatoria." }),
});

export type LoginSchema = z.infer<typeof loginSchema>;
