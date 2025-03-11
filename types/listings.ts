export interface Address {
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  neighborhood: string;
}

export interface Pricing {
  monthlyRent: number;
  securityDeposit: number;
  utilities: string[];
  utilitiesCost: number;
}

export interface Details {
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  parking: boolean;
  parkingFee: number;
  petFriendly: boolean;
  petDeposit: number;
}

export interface LeaseTerms {
  minimumLease: number;
  availableDate: string;
  applicationFee: number;
}

export interface ContactInfo {
  propertyManagement: string;
  contactPhone: string;
  contactEmail: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  nearbyTransportation: string[];
}

export interface RentalListing {
  id: string;
  propertyType: string;
  address: Address;
  pricing: Pricing;
  details: Details;
  amenities: string[];
  leaseTerms: LeaseTerms;
  contactInfo: ContactInfo;
  location: Location;
}

export interface RentalListingsData {
  rentalListings: RentalListing[];
  metadata: {
    totalListings: number;
    lastUpdated: string;
    dataSource: string;
  };
}
