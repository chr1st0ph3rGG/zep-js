/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * @example
 *     {
 *         embeddingDimensions: 1,
 *         isAutoEmbedded: true,
 *         name: "name"
 *     }
 */
export interface CreateDocumentCollectionRequest {
    description?: string;
    embeddingDimensions: number;
    /** these needs to be pointers so that we can distinguish between false and unset when validating */
    isAutoEmbedded: boolean;
    metadata?: Record<string, unknown>;
    name: string;
}
