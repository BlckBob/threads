import * as z from 'zod'

const minLengthMsg = 'Minimum 3 characters.'
const maxLengthMsg30 = 'Maximum 30 characters.'
const maxLengthMsg1000 = 'Maximum 1000 characters.'

export const UserValidation = z.object({
  profile_photo: z.string().url().min(1),
  name: z
    .string()
    .min(3, { message: minLengthMsg })
    .max(30, { message: maxLengthMsg30 }),
  username: z
    .string()
    .min(3, { message: minLengthMsg })
    .max(30, { message: maxLengthMsg30 }),
  bio: z
    .string()
    .min(3, { message: minLengthMsg })
    .max(1000, { message: maxLengthMsg1000 }),
})
