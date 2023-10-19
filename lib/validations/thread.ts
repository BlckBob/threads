import * as z from 'zod'

export const ThreadValidation = z.object({
  thread: z
    .string()
    .min(3)
    .refine((val) => val.trim().length > 0, {
      message: 'Minimum 3 non-empty characters.',
    }),
  accountId: z.string(),
})

export const CommentValidation = z.object({
  thread: z
    .string()
    .min(3)
    .refine((val) => val.trim().length > 0, {
      message: 'Minimum 3 non-empty characters.',
    }),
})
// export const ThreadValidation = z.object({
//   thread: z.string().nonempty().min(3, { message: "Minimum 3 characters." }),
//   accountId: z.string(),
// });

// export const CommentValidation = z.object({
//   thread: z.string().nonempty().min(3, { message: "Minimum 3 characters." }),
// });
