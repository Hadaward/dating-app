import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  firstName: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  lastName: z.string().min(2, 'Sobrenome deve ter no mínimo 2 caracteres'),
  dateOfBirth: z.string().refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 18;
  }, 'Você deve ter pelo menos 18 anos'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], 'Selecione um gênero'),
  preference: z.enum(['MALE', 'FEMALE', 'OTHER'], 'Selecione uma preferência'),
  photo: z.string().optional(),
});

export const signInSchema = z.object({
  email: z.email('E-mail inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;

export const sessionResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  }),
});

export type SessionResponse = z.infer<typeof sessionResponseSchema>;
