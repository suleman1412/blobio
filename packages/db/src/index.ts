import { PrismaClient } from '../prisma/src/generated/prisma/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())

export default prisma
