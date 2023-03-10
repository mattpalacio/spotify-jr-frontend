export interface Auth {
    accessToken: string;
    expires: number;
    refreshToken: string;
    scope: string;
    tokenType: string;
}