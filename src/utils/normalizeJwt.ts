export interface NormalizedToken {
  userId: string;
  email: string;
  name: string;
  tokenType: string;
  exp: number;
  iss: string;
  aud: string;
}

export function normalizeToken(decoded: Record<string, any>): NormalizedToken {
  return {
    userId:
      decoded[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ],
    email:
      decoded[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
      ],
    name: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
    tokenType: decoded["token_type"],
    exp: decoded["exp"],
    iss: decoded["iss"],
    aud: decoded["aud"],
  };
}
