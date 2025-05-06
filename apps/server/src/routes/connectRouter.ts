import { Hono } from "hono";
import authMiddleware from "./middleware";

const connectRouter = new Hono<{ Bindings: { GAME_ROOM: DurableObjectNamespace } }>()
// connectRouter.use(authMiddleware)

connectRouter.get('/', async (c) => {
    return c.json({
        message: 'Connect router - Health Check'
    })
})

connectRouter.get("/ws/:roomId", async (c) => {
    const roomId = c.req.param("roomId")
    // @ts-ignore
    // const userId = c.get('userId'); //for authenticated logged in users
    
    
    const userId = crypto.randomUUID().toString() // Creating server generated UUIDs to all players
    console.log('[connectRouter /ws/:roomId] roomId = ', roomId)
    console.log('[connectRouter /ws/:roomId] userId = ', userId)

    const id = c.env.GAME_ROOM.idFromName(roomId)
    const stub = c.env.GAME_ROOM.get(id)

    // Build a new URL
    const url = new URL(c.req.url);
    // @ts-ignore
    url.searchParams.set('userId', userId);
    console.log('[connectRouter.ts] new URL created: ', url)
    // Create a new Request with the updated URL
    const newRequest = new Request(url.toString(), c.req.raw);

    return stub.fetch(newRequest);

})

export { GameRoom } from "../ws/main";

export default connectRouter