import { Hono } from "hono";

const apiRouter = new Hono()

apiRouter.get('/', async (c) => {
    return c.json({
        message: "API Router Health Check - Blob.io"
    })
})

apiRouter.post('/signup', async(c) => {
	const { username, password } = await c.req.json()
	console.log(username, password)

    return c.json({
        username: username,
        password: password
    })
})

export default apiRouter