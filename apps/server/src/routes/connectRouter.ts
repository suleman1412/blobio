import { Hono } from "hono";
import authMiddleware from "./middleware";

const connectRouter = new Hono<{ Bindings: { GAME_ROOM: DurableObjectNamespace} }>()
connectRouter.use(authMiddleware)

connectRouter.get('/', async (c) => {
    return c.json({
        message: 'Connect router - Health Check'
    })
})

connectRouter.get("/ws/:roomId", async (c) => {
    console.log('[connectRouter /ws/:roomId] generating stub ')
    const roomId = c.req.param("roomId")
    console.log('[connectRouter /ws/:roomId] roomId = ', roomId)
    const id = c.env.GAME_ROOM.idFromName(roomId)
    const stub = c.env.GAME_ROOM.get(id)
    
    return stub.fetch(c.req.raw)
})

export { GameRoom } from "../ws/main";

export default connectRouter