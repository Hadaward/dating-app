import { z } from 'zod';

// Schema para reações (like, super like, dislike)
export const reactionSchema = z.object({
  toUserId: z.string().cuid('ID de usuário inválido'),
  type: z.enum(['LIKE', 'SUPER_LIKE', 'DISLIKE'], 'Tipo de reação inválido'),
});

export type ReactionInput = z.infer<typeof reactionSchema>;

// Schema de resposta para match
export const matchResponseSchema = z.object({
  id: z.string(),
  matched: z.boolean(),
  userAId: z.string(),
  userBId: z.string(),
  createdAt: z.date(),
});

export type MatchResponse = z.infer<typeof matchResponseSchema>;

// Schema para perfil de usuário completo
export const userProfileSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  dateOfBirth: z.date(),
  createdAt: z.date(),
  profile: z.object({
    id: z.string(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
    preference: z.enum(['MALE', 'FEMALE', 'OTHER']),
  }).nullable(),
  photos: z.array(z.object({
    id: z.string(),
    url: z.string(),
    createdAt: z.date(),
  })),
  interests: z.array(z.object({
    id: z.string(),
    interest: z.object({
      id: z.string(),
      name: z.string(),
    }),
  })),
});

export type UserProfile = z.infer<typeof userProfileSchema>;

// Schema para lista de usuários descobertos
export const discoverUsersSchema = z.array(userProfileSchema);

export type DiscoverUsers = z.infer<typeof discoverUsersSchema>;

// Schema para lista de matches
export const matchListSchema = z.array(z.object({
  id: z.string(),
  createdAt: z.date(),
  user: userProfileSchema,
}));

export type MatchList = z.infer<typeof matchListSchema>;

// Schema para estatísticas do usuário
export const userStatsSchema = z.object({
  totalLikes: z.number(),
  totalSuperLikes: z.number(),
  totalMatches: z.number(),
  totalLikesReceived: z.number(),
});

export type UserStats = z.infer<typeof userStatsSchema>;
