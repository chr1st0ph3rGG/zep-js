/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Zep from "../../../../index";

/**
 * @example
 *     {}
 */
export interface MemoryGetRequest {
    /**
     * The type of memory to retrieve: perpetual, summary_retriever, or message_window. Defaults to perpetual.
     */
    memoryType?: Zep.MemoryGetRequestMemoryType;
    /**
     * The number of most recent memory entries to retrieve.
     */
    lastn?: number;
}