import { CrawlerResponse } from '@shared/crawler';
import { PropertyResponse, PropertyCategory, PropertyStatus } from '@shared/property';

export const demoCrawlers: CrawlerResponse[] = [
  {
    id: 'demo-1',
    name: 'Amazon Product Scraper',
    url: 'https://amazon.com/products',
    description: 'Scrapes product listings from Amazon marketplace',
    status: 'in_progress',
    created_at: new Date('2024-01-15T10:30:00Z'),
    updated_at: new Date('2024-01-20T14:45:00Z')
  },
  {
    id: 'demo-2', 
    name: 'Hacker News Posts',
    url: 'https://news.ycombinator.com',
    description: 'Collects latest technology news and discussions',
    status: 'completed',
    created_at: new Date('2024-01-12T09:15:00Z'),
    updated_at: new Date('2024-01-20T16:20:00Z')
  },
  {
    id: 'demo-3',
    name: 'Job Listings Monitor', 
    url: 'https://jobs.example.com',
    description: 'Monitors new job postings in tech sector',
    status: 'todo',
    created_at: new Date('2024-01-18T11:00:00Z'),
    updated_at: new Date('2024-01-20T11:00:00Z')
  },
  {
    id: 'demo-4',
    name: 'Social Media Tracker',
    url: 'https://twitter.com/trending',
    description: 'Tracks trending topics and hashtags',
    status: 'qa', 
    created_at: new Date('2024-01-16T14:30:00Z'),
    updated_at: new Date('2024-01-20T18:15:00Z')
  },
  {
    id: 'demo-5',
    name: 'Real Estate Listings',
    url: 'https://zillow.com/search',
    description: 'Monitors property listings and price changes',
    status: 'failed',
    created_at: new Date('2024-01-14T08:45:00Z'),
    updated_at: new Date('2024-01-20T12:30:00Z')
  },
  {
    id: 'demo-6',
    name: 'Financial Data Collector',
    url: 'https://finance.yahoo.com',
    description: 'Collects stock prices and financial metrics',
    status: 'in_progress',
    created_at: new Date('2024-01-17T13:20:00Z'), 
    updated_at: new Date('2024-01-20T19:45:00Z')
  }
];

export function getDemoCrawlers(page = 1, limit = 10, search = '', status = 'all') {
  let filtered = demoCrawlers;
  
  // Apply search filter
  if (search) {
    filtered = filtered.filter(crawler => 
      crawler.name.toLowerCase().includes(search.toLowerCase()) ||
      crawler.description.toLowerCase().includes(search.toLowerCase()) ||
      crawler.url.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  // Apply status filter
  if (status !== 'all') {
    filtered = filtered.filter(crawler => crawler.status === status);
  }
  
  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedCrawlers = filtered.slice(startIndex, endIndex);
  
  return {
    crawlers: paginatedCrawlers,
    total: filtered.length,
    page,
    limit,
    pages: Math.ceil(filtered.length / limit)
  };
}

export const demoProperties: PropertyResponse[] = [
  {
    id: 'prop-1',
    name: 'Luxury Downtown Apartment',
    address: '123 Main St, Downtown',
    category: PropertyCategory.FURNISHED_APARTMENT,
    status: PropertyStatus.AVAILABLE,
    price: 2500,
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    description: 'Modern furnished apartment with city views',
    created_at: new Date('2024-01-15T10:30:00Z'),
    updated_at: new Date('2024-01-20T14:45:00Z')
  },
  {
    id: 'prop-2',
    name: 'Family House with Garden',
    address: '456 Oak Avenue, Suburbs',
    category: PropertyCategory.FURNISHED_HOUSE,
    status: PropertyStatus.RENTED,
    price: 3500,
    bedrooms: 4,
    bathrooms: 3,
    area: 2200,
    description: 'Spacious family home with private garden',
    created_at: new Date('2024-01-12T09:15:00Z'),
    updated_at: new Date('2024-01-20T16:20:00Z')
  },
  {
    id: 'prop-3',
    name: 'Business Traveler Suite',
    address: '789 Business District',
    category: PropertyCategory.SERVICED_APARTMENT,
    status: PropertyStatus.AVAILABLE,
    price: 1800,
    bedrooms: 1,
    bathrooms: 1,
    area: 800,
    description: 'Fully serviced apartment for business travelers',
    created_at: new Date('2024-01-18T11:00:00Z'),
    updated_at: new Date('2024-01-20T11:00:00Z')
  },
  {
    id: 'prop-4',
    name: 'Executive Penthouse',
    address: '321 High Street, City Center',
    category: PropertyCategory.FURNISHED_APARTMENT,
    status: PropertyStatus.MAINTENANCE,
    price: 4500,
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    description: 'Premium penthouse with panoramic views',
    created_at: new Date('2024-01-16T14:30:00Z'),
    updated_at: new Date('2024-01-20T18:15:00Z')
  },
  {
    id: 'prop-5',
    name: 'Corporate Housing Unit',
    address: '654 Corporate Plaza',
    category: PropertyCategory.SERVICED_APARTMENT,
    status: PropertyStatus.AVAILABLE,
    price: 2200,
    bedrooms: 2,
    bathrooms: 1,
    area: 1000,
    description: 'Professional serviced apartment with amenities',
    created_at: new Date('2024-01-14T08:45:00Z'),
    updated_at: new Date('2024-01-20T12:30:00Z')
  }
];

export function getDemoProperties(page = 1, limit = 10, search = '', category = 'all', status = 'all') {
  let filtered = demoProperties;

  // Apply search filter
  if (search) {
    filtered = filtered.filter(property =>
      property.name.toLowerCase().includes(search.toLowerCase()) ||
      property.address.toLowerCase().includes(search.toLowerCase()) ||
      property.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Apply category filter
  if (category !== 'all') {
    filtered = filtered.filter(property => property.category === category);
  }

  // Apply status filter
  if (status !== 'all') {
    filtered = filtered.filter(property => property.status === status);
  }

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProperties = filtered.slice(startIndex, endIndex);

  return {
    properties: paginatedProperties,
    total: filtered.length,
    page,
    limit,
    pages: Math.ceil(filtered.length / limit)
  };
}

export function getDemoPropertyStats() {
  const stats = {
    total: demoProperties.length,
    by_category: {
      [PropertyCategory.FURNISHED_APARTMENT]: 0,
      [PropertyCategory.FURNISHED_HOUSE]: 0,
      [PropertyCategory.SERVICED_APARTMENT]: 0
    },
    by_status: {
      [PropertyStatus.AVAILABLE]: 0,
      [PropertyStatus.RENTED]: 0,
      [PropertyStatus.MAINTENANCE]: 0
    }
  };

  demoProperties.forEach(property => {
    stats.by_category[property.category]++;
    stats.by_status[property.status]++;
  });

  return stats;
}
