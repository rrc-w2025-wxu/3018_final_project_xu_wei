import { Request, Response, NextFunction } from "express";

// Global API statistics data
const apiStats = {
    totalRequests: 0,
    routes: {} as Record<string, number>, // Track access count for each route
    requestHistory: [] as any[]
};

// API usage analysis middleware
export const apiAnalyticsMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Increment total request count
    apiStats.totalRequests++;

    // Record the current route
    const route = `${req.method} ${req.originalUrl}`;
    apiStats.routes[route] = (apiStats.routes[route] || 0) + 1;

    // Log detailed request information (time, path, IP, user agent)
    apiStats.requestHistory.push({
        time: new Date().toISOString(),
        method: req.method,
        path: req.originalUrl,
        ip: req.ip,
        userAgent: req.get("user-agent")
    });

    next();
};

// Endpoint to retrieve API statistics
export const getApiStats = (req: Request, res: Response) => {
    res.json({
        totalRequests: apiStats.totalRequests,
        routes: apiStats.routes,
        recentRequests: apiStats.requestHistory.slice(-10) // Show latest 10 requests
    });
};