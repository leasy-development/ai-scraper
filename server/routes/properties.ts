import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import {
  Property,
  PropertyCategory,
  PropertyStatus,
  CreatePropertyRequest,
  UpdatePropertyRequest,
  PropertyResponse,
  PropertiesListResponse,
  validatePropertyData,
} from "../../shared/property";

// In-memory property storage (replace with database in production)
const properties: Property[] = [];
const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";

// Helper function to verify JWT token and get user ID
function getUserIdFromToken(authHeader: string | undefined): string | null {
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}

// Helper function to convert Property to PropertyResponse
function toPropertyResponse(property: Property): PropertyResponse {
  return {
    ...property,
    created_at: property.created_at.toISOString(),
    updated_at: property.updated_at.toISOString(),
  };
}

// Initialize demo properties
function initDemoProperties() {
  const demoProperties: Property[] = [
    {
      id: "prop-1",
      title: "Luxury Downtown Apartment",
      description:
        "Beautiful 2-bedroom apartment in the heart of downtown with stunning city views. Fully furnished with modern amenities.",
      category: PropertyCategory.FURNISHED_APARTMENT,
      status: PropertyStatus.AVAILABLE,
      address: "123 City Center Plaza, Downtown",
      price: 2500,
      currency: "USD",
      bedrooms: 2,
      bathrooms: 2,
      area: 85,
      furnished: true,
      amenities: ["WiFi", "Air Conditioning", "Gym", "Pool", "Concierge"],
      images: [],
      contactEmail: "contact@luxuryapts.com",
      contactPhone: "+1-555-0123",
      created_by: "demo-user-123",
      created_at: new Date("2024-01-15"),
      updated_at: new Date("2024-01-20"),
    },
    {
      id: "prop-2",
      title: "Spacious Family House",
      description:
        "A wonderful 4-bedroom family house with a large garden. Perfect for families looking for space and comfort.",
      category: PropertyCategory.FURNISHED_HOUSE,
      status: PropertyStatus.RENTED,
      address: "456 Maple Street, Suburbia",
      price: 3200,
      currency: "USD",
      bedrooms: 4,
      bathrooms: 3,
      area: 180,
      furnished: true,
      amenities: ["Garden", "Garage", "Fireplace", "Modern Kitchen"],
      images: [],
      contactEmail: "rental@familyhomes.com",
      contactPhone: "+1-555-0456",
      created_by: "demo-user-123",
      created_at: new Date("2024-01-18"),
      updated_at: new Date("2024-01-21"),
    },
    {
      id: "prop-3",
      title: "Executive Serviced Apartment",
      description:
        "Premium serviced apartment with daily housekeeping and business center access. Ideal for business travelers.",
      category: PropertyCategory.SERVICED_APARTMENT,
      status: PropertyStatus.AVAILABLE,
      address: "789 Business District, Corporate Zone",
      price: 4000,
      currency: "USD",
      bedrooms: 1,
      bathrooms: 1,
      area: 65,
      furnished: true,
      amenities: [
        "Daily Housekeeping",
        "Business Center",
        "Laundry Service",
        "24/7 Front Desk",
      ],
      images: [],
      contactEmail: "reservations@executivesuites.com",
      contactPhone: "+1-555-0789",
      created_by: "demo-user-123",
      created_at: new Date("2024-01-19"),
      updated_at: new Date("2024-01-19"),
    },
    {
      id: "prop-4",
      title: "Modern Studio Apartment",
      description:
        "Stylish studio apartment with contemporary design. Perfect for young professionals or students.",
      category: PropertyCategory.FURNISHED_APARTMENT,
      status: PropertyStatus.RESERVED,
      address: "321 University Avenue, Student Quarter",
      price: 1800,
      currency: "USD",
      bedrooms: 1,
      bathrooms: 1,
      area: 45,
      furnished: true,
      amenities: ["WiFi", "Study Area", "Communal Kitchen"],
      images: [],
      contactEmail: "info@modernstudios.com",
      contactPhone: "+1-555-0321",
      created_by: "demo-user-123",
      created_at: new Date("2024-01-20"),
      updated_at: new Date("2024-01-20"),
    },
    {
      id: "prop-5",
      title: "Luxury Villa with Pool",
      description:
        "Stunning 5-bedroom villa with private pool and garden. Ultimate luxury living experience.",
      category: PropertyCategory.FURNISHED_HOUSE,
      status: PropertyStatus.MAINTENANCE,
      address: "555 Exclusive Hills, Premium District",
      price: 8000,
      currency: "USD",
      bedrooms: 5,
      bathrooms: 4,
      area: 350,
      furnished: true,
      amenities: [
        "Private Pool",
        "Garden",
        "Wine Cellar",
        "Home Theater",
        "Chef Kitchen",
      ],
      images: [],
      contactEmail: "luxury@premiumvillas.com",
      contactPhone: "+1-555-0555",
      created_by: "demo-user-123",
      created_at: new Date("2024-01-21"),
      updated_at: new Date("2024-01-21"),
    },
  ];

  // Add demo properties if they don't exist
  demoProperties.forEach((demoProperty) => {
    if (!properties.find((p) => p.id === demoProperty.id)) {
      properties.push(demoProperty);
    }
  });
}

// Initialize demo data
initDemoProperties();

// Get all properties (with pagination, filtering, sorting)
export const getProperties: RequestHandler = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Query parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const category = req.query.category as PropertyCategory;
    const status = req.query.status as PropertyStatus;
    const search = req.query.search as string;
    const sortBy = (req.query.sortBy as string) || "created_at";
    const sortOrder = (req.query.sortOrder as string) || "desc";

    // Filter properties by user
    let userProperties = properties.filter(
      (property) => property.created_by === userId,
    );

    // Apply category filter
    if (category && Object.values(PropertyCategory).includes(category)) {
      userProperties = userProperties.filter(
        (property) => property.category === category,
      );
    }

    // Apply status filter
    if (status && Object.values(PropertyStatus).includes(status)) {
      userProperties = userProperties.filter(
        (property) => property.status === status,
      );
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      userProperties = userProperties.filter(
        (property) =>
          property.title.toLowerCase().includes(searchLower) ||
          property.description.toLowerCase().includes(searchLower) ||
          property.address.toLowerCase().includes(searchLower),
      );
    }

    // Apply sorting
    userProperties.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Property];
      let bValue: any = b[sortBy as keyof Property];

      if (aValue instanceof Date) aValue = aValue.getTime();
      if (bValue instanceof Date) bValue = bValue.getTime();

      if (sortOrder === "desc") {
        return bValue > aValue ? 1 : -1;
      }
      return aValue > bValue ? 1 : -1;
    });

    // Apply pagination
    const total = userProperties.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProperties = userProperties.slice(startIndex, endIndex);

    const response: PropertiesListResponse = {
      properties: paginatedProperties.map(toPropertyResponse),
      total,
      page,
      limit,
    };

    res.json(response);
  } catch (error) {
    console.error("Get properties error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get single property by ID
export const getProperty: RequestHandler = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const property = properties.find(
      (p) => p.id === id && p.created_by === userId,
    );

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json(toPropertyResponse(property));
  } catch (error) {
    console.error("Get property error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create new property
export const createProperty: RequestHandler = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const propertyData: CreatePropertyRequest = req.body;

    // Validate request data
    const validationErrors = validatePropertyData(propertyData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    // Create new property
    const newProperty: Property = {
      id: Date.now().toString(),
      title: propertyData.title.trim(),
      description: propertyData.description.trim(),
      category: propertyData.category,
      status: propertyData.status || PropertyStatus.AVAILABLE,
      address: propertyData.address.trim(),
      price: propertyData.price,
      currency: propertyData.currency || "USD",
      bedrooms: propertyData.bedrooms,
      bathrooms: propertyData.bathrooms,
      area: propertyData.area,
      furnished: propertyData.furnished || true,
      amenities: propertyData.amenities || [],
      images: propertyData.images || [],
      contactEmail: propertyData.contactEmail.trim(),
      contactPhone: propertyData.contactPhone.trim(),
      created_by: userId,
      created_at: new Date(),
      updated_at: new Date(),
    };

    properties.push(newProperty);

    res.status(201).json({
      property: toPropertyResponse(newProperty),
      message: "Property created successfully",
    });
  } catch (error) {
    console.error("Create property error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update property
export const updateProperty: RequestHandler = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const updateData: UpdatePropertyRequest = req.body;

    const propertyIndex = properties.findIndex(
      (p) => p.id === id && p.created_by === userId,
    );
    if (propertyIndex === -1) {
      return res.status(404).json({ message: "Property not found" });
    }

    const property = properties[propertyIndex];

    // Update property fields
    if (updateData.title !== undefined) {
      if (!updateData.title.trim()) {
        return res.status(400).json({ message: "Title cannot be empty" });
      }
      property.title = updateData.title.trim();
    }

    if (updateData.description !== undefined)
      property.description = updateData.description.trim();
    if (updateData.category !== undefined)
      property.category = updateData.category;
    if (updateData.status !== undefined) property.status = updateData.status;
    if (updateData.address !== undefined)
      property.address = updateData.address.trim();
    if (updateData.price !== undefined) property.price = updateData.price;
    if (updateData.currency !== undefined)
      property.currency = updateData.currency;
    if (updateData.bedrooms !== undefined)
      property.bedrooms = updateData.bedrooms;
    if (updateData.bathrooms !== undefined)
      property.bathrooms = updateData.bathrooms;
    if (updateData.area !== undefined) property.area = updateData.area;
    if (updateData.furnished !== undefined)
      property.furnished = updateData.furnished;
    if (updateData.amenities !== undefined)
      property.amenities = updateData.amenities;
    if (updateData.images !== undefined) property.images = updateData.images;
    if (updateData.contactEmail !== undefined)
      property.contactEmail = updateData.contactEmail.trim();
    if (updateData.contactPhone !== undefined)
      property.contactPhone = updateData.contactPhone.trim();

    property.updated_at = new Date();

    res.json({
      property: toPropertyResponse(property),
      message: "Property updated successfully",
    });
  } catch (error) {
    console.error("Update property error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete property
export const deleteProperty: RequestHandler = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const propertyIndex = properties.findIndex(
      (p) => p.id === id && p.created_by === userId,
    );

    if (propertyIndex === -1) {
      return res.status(404).json({ message: "Property not found" });
    }

    properties.splice(propertyIndex, 1);

    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Delete property error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get property statistics
export const getPropertyStats: RequestHandler = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userProperties = properties.filter(
      (property) => property.created_by === userId,
    );

    const stats = {
      total: userProperties.length,
      by_category: {
        [PropertyCategory.FURNISHED_APARTMENT]: userProperties.filter(
          (p) => p.category === PropertyCategory.FURNISHED_APARTMENT,
        ).length,
        [PropertyCategory.FURNISHED_HOUSE]: userProperties.filter(
          (p) => p.category === PropertyCategory.FURNISHED_HOUSE,
        ).length,
        [PropertyCategory.SERVICED_APARTMENT]: userProperties.filter(
          (p) => p.category === PropertyCategory.SERVICED_APARTMENT,
        ).length,
      },
      by_status: {
        [PropertyStatus.AVAILABLE]: userProperties.filter(
          (p) => p.status === PropertyStatus.AVAILABLE,
        ).length,
        [PropertyStatus.RENTED]: userProperties.filter(
          (p) => p.status === PropertyStatus.RENTED,
        ).length,
        [PropertyStatus.MAINTENANCE]: userProperties.filter(
          (p) => p.status === PropertyStatus.MAINTENANCE,
        ).length,
        [PropertyStatus.RESERVED]: userProperties.filter(
          (p) => p.status === PropertyStatus.RESERVED,
        ).length,
      },
      average_price:
        userProperties.length > 0
          ? userProperties.reduce((sum, p) => sum + p.price, 0) /
            userProperties.length
          : 0,
      total_area: userProperties.reduce((sum, p) => sum + p.area, 0),
    };

    res.json(stats);
  } catch (error) {
    console.error("Get property stats error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
