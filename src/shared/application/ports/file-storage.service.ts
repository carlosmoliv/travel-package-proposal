import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class FileStorageService {
  abstract upload(file: Buffer, fileName: string): Promise<void>;
  abstract getUrl(fileName: string): Promise<string>;
}
