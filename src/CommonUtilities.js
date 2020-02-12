/**
 * 
 * ----------------------
 * 
 * ## `CommonUtilities`
 * @type *Class. Function.*
 * @description Set of common utilities that can be used across all the `express-composition` framework.
 * 
 */
class CommonUtilities {

    /**
     * 
     * --------------------
     * 
     * ### `CommonUtilities.HTTP_RESPONSES`
     * @name `CommonUtilities.HTTP_RESPONSES`
     * @type *Static class property. Object.*
     * @description Object that holds the strings used as prototypical HTTP responses.
     * @property
     * @property - **ERROR_400**: `HTTP 400 error: Bad Request`
     * @property - **ERROR_401**: `HTTP 401 error: Unauthorized`
     * @property - **ERROR_403**: `HTTP 403 error: Forbidden`
     * @property - **ERROR_404**: `HTTP 404 error: Not Found`
     * @property - **ERROR_405**: `HTTP 405 error: Method Not Allowed`
     * @property - **ERROR_409**: `HTTP 409 error: Conflict`
     * @property - **ERROR_500**: `HTTP 500 error: Internal Server Error`
     * @property - **ERROR_503**: `HTTP 503 error: Service Unavailable`
     */
    static get HTTP_RESPONSES() {
        return {
            ERROR_400: "HTTP 400 error: Bad Request",
            ERROR_401: "HTTP 401 error: Unauthorized",
            ERROR_403: "HTTP 403 error: Forbidden",
            ERROR_404: "HTTP 404 error: Not Found",
            ERROR_405: "HTTP 405 error: Method Not Allowed",
            ERROR_409: "HTTP 409 error: Conflict",
            ERROR_500: "HTTP 500 error: Internal Server Error",
            ERROR_503: "HTTP 503 error: Service Unavailable",
        };
    }

}

module.exports = CommonUtilities;