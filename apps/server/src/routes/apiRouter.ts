import { Hono } from "hono";
import { AuthSchema } from '@repo/common/schema'
import prisma from '@repo/db/client'
import bcrypt from 'bcryptjs'


const apiRouter = new Hono()

apiRouter.get('/', async (c) => {
    return c.json({
        message: "API Router Health Check - Blob.io"
    })
})

apiRouter.post('/signup', async(c) => {
	const body = await c.req.json()
    const { data, success, error } = AuthSchema.safeParse(body)
    if(!success){
        return c.json({
            message: `Error in AuthSchema validation:`,
            error: error
        }, 400)
    }
    
    const hashedPassword = await bcrypt.hash(data.password, 5)
    console.log(hashedPassword)
    const user = await prisma.user.create({
        data: {
			username: data.username,
			password: data.password
		}
    })
    console.log(data.username, data.password)
    return c.json({
        id: user.id,
        username: user.username,
        password: user.password
    })
})

export default apiRouter