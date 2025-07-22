// Property Category Enum
export enum PropertyCategory {
  FURNISHED_APARTMENT = "furnished_apartment",
  FURNISHED_HOUSE = "furnished_house",
  SERVICED_APARTMENT = "serviced_apartment",
}

// Property Status Enum
export enum PropertyStatus {
  AVAILABLE = "available",
  RENTED = "rented",
  MAINTENANCE = "maintenance",
  RESERVED = "reserved",
}

// Property Interface
export interface Property {
  id: string;
  title: string;
  description: string;
  category: PropertyCategory;
  status: PropertyStatus;
  address: string;
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  area: number; // in square meters
  furnished: boolean;
  amenities: string[];
  images: string[];
  contactEmail: string;
  contactPhone: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

// Create Property Request
export interface CreatePropertyRequest {
  title: string;
  description: string;
  category: PropertyCategory;
  status?: PropertyStatus;
  address: string;
  price: number;
  currency?: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  furnished?: boolean;
  amenities?: string[];
  images?: string[];
  contactEmail: string;
  contactPhone: string;
}

// Update Property Request
export interface UpdatePropertyRequest {
  title?: string;
  description?: string;
  category?: PropertyCategory;
  status?: PropertyStatus;
  address?: string;
  price?: number;
  currency?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  furnished?: boolean;
  amenities?: string[];
  images?: string[];
  contactEmail?: string;
  contactPhone?: string;
}

// Property Response
export interface PropertyResponse {
  id: string;
  title: string;
  description: string;
  category: PropertyCategory;
  status: PropertyStatus;
  address: string;
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  furnished: boolean;
  amenities: string[];
  images: string[];
  contactEmail: string;
  contactPhone: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Properties List Response
export interface PropertiesListResponse {
  properties: PropertyResponse[];
  total: number;
  page: number;
  limit: number;
}

// Category labels for UI
export const CATEGORY_LABELS = {
  [PropertyCategory.FURNISHED_APARTMENT]: "Furnished Apartment",
  [PropertyCategory.FURNISHED_HOUSE]: "Furnished House",
  [PropertyCategory.SERVICED_APARTMENT]: "Serviced Apartment",
};

// Status labels for UI
export const STATUS_LABELS = {
  [PropertyStatus.AVAILABLE]: "Available",
  [PropertyStatus.RENTED]: "Rented",
  [PropertyStatus.MAINTENANCE]: "Maintenance",
  [PropertyStatus.RESERVED]: "Reserved",
};

// Status color mapping for UI
export const STATUS_COLORS = {
  [PropertyStatus.AVAILABLE]: "bg-green-100 text-green-800 border-green-200",
  [PropertyStatus.RENTED]: "bg-red-100 text-red-800 border-red-200",
  [PropertyStatus.MAINTENANCE]:
    "bg-yellow-100 text-yellow-800 border-yellow-200",
  [PropertyStatus.RESERVED]: "bg-blue-100 text-blue-800 border-blue-200",
};

// Category color mapping for UI
export const CATEGORY_COLORS = {
  [PropertyCategory.FURNISHED_APARTMENT]:
    "bg-purple-100 text-purple-800 border-purple-200",
  [PropertyCategory.FURNISHED_HOUSE]:
    "bg-emerald-100 text-emerald-800 border-emerald-200",
  [PropertyCategory.SERVICED_APARTMENT]:
    "bg-orange-100 text-orange-800 border-orange-200",
};

// Validation helper
export function validatePropertyData(data: CreatePropertyRequest): string[] {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length < 1) {
    errors.push("Property title is required");
  }

  if (!data.address || data.address.trim().length < 1) {
    errors.push("Property address is required");
  }

  if (!data.price || data.price <= 0) {
    errors.push("Valid price is required");
  }

  if (!data.bedrooms || data.bedrooms < 0) {
    errors.push("Valid number of bedrooms is required");
  }

  if (!data.bathrooms || data.bathrooms < 0) {
    errors.push("Valid number of bathrooms is required");
  }

  if (!data.area || data.area <= 0) {
    errors.push("Valid area is required");
  }

  if (!data.contactEmail || !isValidEmail(data.contactEmail)) {
    errors.push("Valid contact email is required");
  }

  if (!data.contactPhone || data.contactPhone.trim().length < 1) {
    errors.push("Contact phone is required");
  }

  return errors;
}

// Email validation helper
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
