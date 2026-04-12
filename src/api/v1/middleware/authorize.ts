import { Request, Response, NextFunction } from "express";
import { AuthorizationError } from "../errors/Errors";
import { AuthorizationOptions } from "../models/authorizationOptions";
import { MiddlewareFunction } from "../types/expressTypes";
import { HTTP_STATUS } from "../../../constants/httpConstants";

/**
 * Authorization middleware factory
 * 
 * Creates a middleware to control access based on user role and ownership.
 * 
 * Features:
 * - Allows access if user is accessing their own resource (allowSameUser)
 * - Allows access if user has one of the required roles (hasRole)
 * - Returns 403 if authorization fails
 * 
 * Usage:
 * isAuthorized({ allowSameUser: true, hasRole: ["admin"] })
 */
const isAuthorized = (opts: AuthorizationOptions): MiddlewareFunction => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const { role, uid } = res.locals;
            const { id } = req.params;

            // allow to access one's own data
            if (opts.allowSameUser && id && uid === id) {
                return next();
            }

            if (!role) {
                throw new AuthorizationError("Forbidden: No role found", "ROLE_NOT_FOUND");
            }

            if (opts.hasRole && opts.hasRole.includes(role)) {
                return next();
            }

            // role not match
            throw new AuthorizationError("Forbidden: Insufficient role", "INSUFFICIENT_ROLE");
        } catch (error: unknown) {
            // return JSON
            if (error instanceof AuthorizationError) {
                res.status(HTTP_STATUS.FORBIDDEN).json({
                    success: false,
                    error: { message: error.message, code: error.code },
                    timestamp: new Date().toISOString()
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: { message: error instanceof Error ? error.message : "Unknown error", code: "INTERNAL_ERROR" },
                    timestamp: new Date().toISOString()
                });
            }
        }
    };
};

export default isAuthorized;