import express from "express";
import { itemsHealthCheck } from "../controllers/Controller";
const router = express.Router();

/**
 * Health Check
 * GET /api/v1/health
 * Public endpoint to check if the service is running.
 */
router.get("/health", itemsHealthCheck);


export default router;