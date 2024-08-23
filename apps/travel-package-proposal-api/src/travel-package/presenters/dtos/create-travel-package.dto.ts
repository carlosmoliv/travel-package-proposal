export class CreateTravelPackageDto {
  name: string;
  destination: string;
  duration: number;
  price: number;
  imageUrl?: string;
  description?: string;
}
