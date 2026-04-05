import { Request, Response, NextFunction } from "express";

/**
 * Type definition for an Express middleware function.
 *
 * An Express middleware function is a function that has access to the request (req),
 * response (res) objects, and the next function in the request-response cycle.
 * It can execute code, make changes to req/res, end the request-response cycle,
 * or call next() to pass control to the next middleware.
 *
 * @param req - The Express Request object
 * @param res - The Express Response object
 * @param next - The next middleware function in the stack
 */
export type MiddlewareFunction = (req: Request, res: Response, next: NextFunction) => void;