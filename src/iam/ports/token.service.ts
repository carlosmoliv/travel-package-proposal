export abstract class TokenService {
  abstract generate<T extends Buffer | object>(
    payload: T,
    expirationInSeconds: number,
  ): Promise<string>;
}
