export interface CreateTravelPackageInput {
  name: string;
  destination: string;
  duration: number;
  price: number;
  imageUrl?: string;
  description?: string;
}
