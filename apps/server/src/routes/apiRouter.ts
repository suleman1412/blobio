import { Hono } from "hono";
import { AuthSchema, JWT_SECRET } from '@repo/common/schema'
import prisma from '@repo/db/client'
import bcrypt from 'bcryptjs'
import { sign } from 'hono/jwt'


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
        }, { status: 400 })
    }
    
    const hashedPassword = await bcrypt.hash(data.password, 5)
    // console.log('hashedPassword: ', hashedPassword)
    const user = await prisma.user.create({
        data: {
			username: data.username,
			password: hashedPassword
		}
    })
    // console.log(data.username, data.password)
    return c.json({
        message: "Signup successful",
        id: user.id,
        username: user.username
    })
})

apiRouter.post('/signin', async (c) => {
    const body = await c.req.json()
    const { data, success, error } = AuthSchema.safeParse(body)
    if(!success){
        return c.json({
            message: `Error in AuthSchema validation:`,
            error: error
        }, { status: 400 })
    }
    
    const user = await prisma.user.findFirst({
        where: {
            username: data.username
        }
    })

    if(!user){
        return c.json({
            message: "User does not exist in the database, please signup"
        })
    }

    const passwordMatch = bcrypt.compare(data.password, user.password)
    if(!passwordMatch){
        return c.json({
            message: "Incorrect Password"
        })
    }
    
    const token = await sign({
        id: user.id
    }, JWT_SECRET)

    return c.json({
        message: "Signin successful",
        token
    })
})



export default apiRouter