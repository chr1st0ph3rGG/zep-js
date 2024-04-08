/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../..";
import * as Zep from "../../../../../api";
import * as core from "../../../../../core";

export const CreateDocumentCollectionRequest: core.serialization.Schema<
    serializers.CreateDocumentCollectionRequest.Raw,
    Zep.CreateDocumentCollectionRequest
> = core.serialization.object({
    description: core.serialization.string().optional(),
    embeddingDimensions: core.serialization.property("embedding_dimensions", core.serialization.number()),
    isAutoEmbedded: core.serialization.property("is_auto_embedded", core.serialization.boolean()),
    metadata: core.serialization.record(core.serialization.string(), core.serialization.unknown()).optional(),
    name: core.serialization.string(),
});

export declare namespace CreateDocumentCollectionRequest {
    interface Raw {
        description?: string | null;
        embedding_dimensions: number;
        is_auto_embedded: boolean;
        metadata?: Record<string, unknown> | null;
        name: string;
    }
}
