/** @see https://httpwg.org/specs/rfc9110.html#overview.of.status.codes */

enum HttpStatusCode {
    /**
     * The 200 (OK) status code indicates that the request has succeeded.
     * The content sent in a 200 response depends on the request method
     * */
    Ok = 200,
  
    /**
     * The 201 (Created) status code indicates that the request has been
     * fulfilled and has resulted in one or more new resources being created.
     * The primary resource created by the request is identified by either a
     * Location header field in the response or, if no Location header field
     * is received, by the target URI.
     */
    Created = 201,
  
    /**
     * The 202 (Accepted) status code indicates that the request has been
     * accepted for processing, but the processing has not been completed.
     * The request might or might not eventually be acted upon, as it might
     * be disallowed when processing actually takes place.
     */
    Accepted = 202,
  
    /**
     * The 204 (No Content) status code indicates that the server has
     * successfully fulfilled the request and that there is no additional
     * content to send in the response content. Metadata in the response
     * header fields refer to the target resource and its selected
     * representation after the requested action was applied.
     */
    NoContent = 204,
  
    /**
     * The 400 (Bad Request) status code indicates that the server cannot or
     * will not process the request due to something that is perceived to be
     * a client error (e.g., malformed request syntax, invalid request message
     * framing, or deceptive request routing).
     */
    BadRequest = 400,
  
    /**
     * The 401 (Unauthorized) status code indicates that the request has not
     * been applied because it lacks valid authentication credentials for the
     * target resource. The server generating a 401 response MUST send a
     * WWW-Authenticate header field (Section 11.6.1) containing at least one
     * challenge applicable to the target resource.
     */
    Unauthorized = 401,
  
    /**
     * The 404 (Not Found) status code indicates that the origin server did not
     * find a current representation for the target resource or is not willing
     * to disclose that one exists. A 404 status code does not indicate whether
     * this lack of representation is temporary or permanent; the 410 (Gone)
     * status code is preferred over 404 if the origin server knows, presumably
     * through some configurable means, that the condition is likely to be
     * permanent.
     */
    NotFound = 404,
  
    /**
     * The 409 (Conflict) status code indicates that the request could not be
     * completed due to a conflict with the current state of the target resource.
     * This code is used in situations where the user might be able to resolve the
     * conflict and resubmit the request. The server SHOULD generate content that
     * includes enough information for a user to recognize the source of the
     * conflict.
     */
    Conflict = 409,
  
    /**
     * The 410 (Gone) status code indicates that access to the target resource is
     * no longer available at the origin server and that this condition is likely
     * to be permanent. If the origin server does not know, or has no facility to]
     * determine, whether or not the condition is permanent, the status code 404
     * (Not Found) ought to be used instead.
     */
    Gone = 410,
  
    /**
     * The 422 (Unprocessable Content) status code indicates that the server
     * understands the content type of the request content (hence a 415 (Unsupported
     * Media Type) status code is inappropriate), and the syntax of the request
     * content is correct, but it was unable to process the contained instructions.
     * For example, this status code can be sent if an XML request content contains
     * well-formed (i.e., syntactically correct), but semantically erroneous XML
     * instructions.
     */
    UnprocessableContent = 422,
  
    /**
     * The 500 (Internal Server Error) status code indicates that the server encountered
     * an unexpected condition that prevented it from fulfilling the request.
     */
    InternalServerError = 500,
  }
  
  export default HttpStatusCode;