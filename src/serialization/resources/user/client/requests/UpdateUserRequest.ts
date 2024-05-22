/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../../index";
import * as Zep from "../../../../../api/index";
import * as core from "../../../../../core";

export const UpdateUserRequest: core.serialization.Schema<serializers.UpdateUserRequest.Raw, Zep.UpdateUserRequest> =
    core.serialization.object({
        email: core.serialization.string().optional(),
        firstName: core.serialization.property("first_name", core.serialization.string().optional()),
        lastName: core.serialization.property("last_name", core.serialization.string().optional()),
        metadata: core.serialization.record(core.serialization.string(), core.serialization.unknown()).optional(),
    });

export declare namespace UpdateUserRequest {
    interface Raw {
        email?: string | null;
        first_name?: string | null;
        last_name?: string | null;
        metadata?: Record<string, unknown> | null;
    }
}