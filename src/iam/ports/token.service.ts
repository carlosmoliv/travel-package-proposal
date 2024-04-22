export abstract class TokenService {
  abstract generate(payload: any, expirationInMs: number): Promise<string>;
}
