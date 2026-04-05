// External library imports
import { Request, Response, NextFunction } from "express";
import { AuthenticationError } from "../errors/Errors";
import { getErrorMessage, getErrorCode } from "../utils/errorUtils";
import { HTTP_STATUS } from "../../../constants/httpConstants";

/**
 * Middleware to authenticate a user using a Firebase ID token.
 * Now integrated with centralized error handling system.
 *
 * This middleware:
 * - Extracts the token from the Authorization header
 * - Verifies the token with Firebase Auth
 * - Stores user information in res.locals for downstream middleware
 * - Throws standardized AuthenticationError for any failures
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>}
 */

const mockTokens: Record<string, { uid: string; role: string }> = {
    "mock-idToken-abc123": {
        uid: "officer-uid-001",
        role: "officer"
    },
    "mock-idToken-def456": {
        uid: "client-uid-002",
        role: "manager"
    },
    "mock-idToken-ghi789": {
        uid: "admin-uid-003",
        role: "admin"
    }
};

const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        const token: string | undefined = authHeader?.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : undefined;

        // token not exists
        if (!token) {
            throw new AuthenticationError(
                "Unauthorized: No token provided",
                "TOKEN_NOT_FOUND"
            );
        }

        const user = mockTokens[token];

        // invalid token
        if (!user) {
            throw new AuthenticationError(
                "Unauthorized: Invalid token",
                "TOKEN_INVALID"
            );
        }

        // valide token
        res.locals.uid = user.uid;
        res.locals.role = user.role;

        next();
    } catch (error: unknown) {
        // AuthenticationError
        if (error instanceof AuthenticationError) {
            res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                error: {
                    message: error.message,
                    code: error.code
                },
                timestamp: new Date().toISOString()
            });
        } else if (error instanceof Error) {
            // other error
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: {
                    message: `Unauthorized: ${getErrorMessage(error)}`,
                    code: getErrorCode(error)
                },
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: {
                    message: "Unauthorized: Invalid token",
                    code: "TOKEN_INVALID"
                },
                timestamp: new Date().toISOString()
            });
        }
    }
};

export default authenticate;