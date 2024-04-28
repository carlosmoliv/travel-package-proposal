export abstract class StorageService {
  abstract set(key: string, value: string): Promise<void>;
  abstract get(key: string): Promise<string | null>;
  abstract del(key: string): Promise<void>;
}
