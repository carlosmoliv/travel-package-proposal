export class Client {
  constructor(
    public userId: string,
    public contactInfo: string,
    public preferences?: string,
  ) {}
}
