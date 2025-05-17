export { GameRoom } from './ws/main'
import { Hono } from "hono" ;
import apiRouter from './routes/apiRouter';
import connectRouter from './routes/connectRouter';


const app = new Hono()

app.get('/', async(c) => {
	return c.json({
		message: "Health Check - Blob.io"
	})
})


app.route('/api', apiRouter)
app.route('/connect', connectRouter)

export default app 