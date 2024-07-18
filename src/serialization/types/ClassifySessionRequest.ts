/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Zep from "../../api/index";
import * as core from "../../core";

export const ClassifySessionRequest: core.serialization.ObjectSchema<
    serializers.ClassifySessionRequest.Raw,
    Zep.ClassifySessionRequest
> = core.serialization.object({
    classes: core.serialization.list(core.serialization.string()),
    instruction: core.serialization.string().optional(),
    lastN: core.serialization.property("last_n", core.serialization.number().optional()),
    name: core.serialization.string(),
    persist: core.serialization.boolean().optional(),
});

export declare namespace ClassifySessionRequest {
    interface Raw {
        classes: string[];
        instruction?: string | null;
        last_n?: number | null;
        name: string;
        persist?: boolean | null;
    }
}