/**
 * This file was auto-generated by Fern from our API Definition.
 */

export interface Session {
    classifications?: Record<string, string>;
    createdAt?: string;
    deletedAt?: string;
    endedAt?: string;
    facts?: string[];
    id?: number;
    metadata?: Record<string, unknown>;
    projectUuid?: string;
    sessionId?: string;
    updatedAt?: string;
    /** Must be a pointer to allow for null values */
    userId?: string;
    uuid?: string;
}
