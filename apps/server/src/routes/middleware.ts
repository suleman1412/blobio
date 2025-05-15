import { JWT_SECRET } from "@repo/common/schema";
import { Context, Next } from "hono";
import { verify } from "hono/jwt";

export default async function authMiddleware(c: Context, next: Next) {

    const token = c.req.query('token')
    console.log('in authMiddlware, token: ',token)
    
    if (!token || !token.startsWith('Bearer ')) {
        return c.json({ error: 'Unauthorized - Invalid token format' }, 401);
    }
    
    const actualToken = token.split(' ')[1];
    if(!actualToken){
        return c.json({ error: 'Unauthorized - Invalid token format' }, 401);
    }
    
    try {
        const decoded = await verify(actualToken, JWT_SECRET)
        // @ts-ignore
        console.log(decoded.id)
        c.set('userId', decoded.id);
        await next();
    } catch (error) {
        console.error('Authentication error:', error);
        return c.json({ error: 'Unauthorized - Invalid token' }, 401);
    }
}