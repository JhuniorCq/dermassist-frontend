import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(1, { message: "Los nombres son obligatorios." }),
  email: z.string().email({ message: "Ingrese su correo correctamente." }),
  password: z.string().min(1, { message: "La contraseña es obligatoria." }),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
