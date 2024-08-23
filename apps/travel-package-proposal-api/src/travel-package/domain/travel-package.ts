export class TravelPackage {
  constructor(
    public id: string,
    public name: string,
    public destination: string,
    public duration: number,
    public price: number,
    public imageUrl?: string,
    public description?: string,
  ) {}
}
