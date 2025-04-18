import { z } from 'zod'

export const AuthSchema = z.object({
    username: z.string().min(3, { message: 'Username must be atleast 3 letters long' }),
    password: z.string().min(5, { message: 'Password must be atleast 3 letters long' }),
})
