import { Router } from "express"

import userRoutes from "./user.routes"
import productRoutes from "./product.routes"
import authRoutes from "./auth.routes"
import activityLogRoutes from "./activity-log.routes"

const router = Router()

// Register all routes
router.use("/auth", authRoutes)
router.use("/users", userRoutes)
router.use("/products", productRoutes)
router.use("/logs", activityLogRoutes)

export { router }

