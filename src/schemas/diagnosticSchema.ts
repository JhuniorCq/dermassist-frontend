import { z } from "zod";

export const diagnosticSchema = z.object({
  image: z
    .instanceof(File, { message: "La imagen es obligatoria" })
    .refine((File) => File.size > 0, { message: "La imagen es obligatoria" }),
});

export type DiagnosticSchema = z.infer<typeof diagnosticSchema>;
