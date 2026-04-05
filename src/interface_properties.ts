/**
 * Represents the response structure for the Health Check API.
 */
export interface HealthCheckResponse {
    status: string;
    uptime: number;
    timestamp: string;
    version: string;
}
