export { MyDurableObject } from './DurableObject'

import { Hono } from "hono";
import apiRouter from './routes/apiRouter';

const app = new Hono()

app.get('/', async(c) => {
	return c.json({
		message: "Health Check - Blob.io"
	})
})


app.route('/api', apiRouter)

export default app as ExportedHandler