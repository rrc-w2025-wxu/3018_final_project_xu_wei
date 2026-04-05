
/**
 * Options for route authorization.
 *
 * Defines the rules for which users can access a specific route.
 */
export interface AuthorizationOptions {
     /**
     * Roles that are allowed to access the route.
     *
     * - "admin" - Administrator role
     * - "manager" - Manager role
     * - "officer" - Officer role
     */
    hasRole: Array<"admin" | "manager" | "officer">;
    /**
     * Whether the same user is allowed to access their own resource.
     *
     * - true: The user can access their own resources even if their role is not listed in `hasRole`.
     * - false / undefined: Only users with a role in `hasRole` can access the route.
     */
    allowSameUser?: boolean;
}