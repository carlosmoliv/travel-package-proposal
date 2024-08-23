import { Proposal } from '../../proposal/domain/proposal';

export class Client {
  constructor(
    public userId: string,
    public contactInfo: string,
    public preferences?: string,
    public bookings?: Proposal[],
  ) {}
}
