/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Zep from "../index";

export interface SessionSearchResult {
    fact?: Zep.Fact;
    message?: Zep.Message;
    score?: number;
    sessionId?: string;
    summary?: Zep.Summary;
}