/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as errors from "../../errors/index";
import * as Zep from "../index";

export class BadRequestError extends errors.ZepError {
    constructor(body: Zep.ApiError) {
        super({
            message: "BadRequestError",
            statusCode: 400,
            body: body,
        });
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}
