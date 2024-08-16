import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class FileStorageService {
  abstract upload(file: Buffer, fileName: string): Promise<string>;
}
