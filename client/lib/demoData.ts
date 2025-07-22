import { CrawlerResponse, CrawlerStatus } from '@shared/crawler';
import { PropertyResponse, PropertyCategory, PropertyStatus } from '@shared/property';

export const demoCrawlers: CrawlerResponse[] = [
  {
    id: 'demo-1',
    name: 'Amazon Product Scraper',
    url: 'https://amazon.com/products',
    description: 'Scrapes product listings from Amazon marketplace',
    status: CrawlerStatus.IN_PROGRESS,
    created_by: 'demo@aiscraper.com',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-20T14:45:00Z'
  },
  {
    id: 'demo-2', 
    name: 'Hacker News Posts',
    url: 'https://news.ycombinator.com',
    description: 'Collects latest technology news and discussions',
    status: CrawlerStatus.COMPLETED,
    created_by: 'demo@aiscraper.com',
    created_at: '2024-01-12T09:15:00Z',
    updated_at: '2024-01-20T16:20:00Z'
  },
  {
    id: 'demo-3',
    name: 'Job Listings Monitor', 
    url: 'https://jobs.example.com',
    description: 'Monitors new job postings in tech sector',
    status: CrawlerStatus.TODO,
    created_by: 'demo@aiscraper.com',
    created_at: '2024-01-18T11:00:00Z',
    updated_at: '2024-01-20T11:00:00Z'
  },
  {
    id: 'demo-4',
    name: 'Social Media Tracker',
    url: 'https://twitter.com/trending',
    description: 'Tracks trending topics and hashtags',
    status: CrawlerStatus.READY_FOR_QA,
    created_by: 'demo@aiscraper.com',
    created_at: '2024-01-16T14:30:00Z',
    updated_at: '2024-01-20T18:15:00Z'
  },
  {
    id: 'demo-5',
    name: 'Real Estate Listings',
    url: 'https://zillow.com/search',
    description: 'Monitors property listings and price changes',
    status: CrawlerStatus.FAILED,
    created_by: 'demo@aiscraper.com',
    created_at: '2024-01-14T08:45:00Z',
    updated_at: '2024-01-20T12:30:00Z'
  },
  {
    id: 'demo-6',
    name: 'Financial Data Collector',
    url: 'https://finance.yahoo.com',
    description: 'Collects stock prices and financial metrics',
    status: CrawlerStatus.IN_PROGRESS,
    created_by: 'demo@aiscraper.com',
    created_at: '2024-01-17T13:20:00Z',
    updated_at: '2024-01-20T19:45:00Z'
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
    title: 'Luxury Downtown Apartment',
    description: 'Modern furnished apartment with city views',
    category: PropertyCategory.FURNISHED_APARTMENT,
    status: PropertyStatus.AVAILABLE,
    address: '123 Main St, Downtown',
    price: 2500,
    currency: 'USD',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    furnished: true,
    amenities: ['WiFi', 'Parking', 'Gym'],
    images: [],
    contactEmail: 'contact@demo.com',
    contactPhone: '+1-555-0123',
    created_by: 'demo@aiscraper.com',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-20T14:45:00Z'
  },
  {
    id: 'prop-2',
    title: 'Family House with Garden',
    description: 'Spacious family home with private garden',
    category: PropertyCategory.FURNISHED_HOUSE,
    status: PropertyStatus.RENTED,
    address: '456 Oak Avenue, Suburbs',
    price: 3500,
    currency: 'USD',
    bedrooms: 4,
    bathrooms: 3,
    area: 2200,
    furnished: true,
    amenities: ['Garden', 'Garage', 'Fireplace'],
    images: [],
    contactEmail: 'contact@demo.com',
    contactPhone: '+1-555-0124',
    created_by: 'demo@aiscraper.com',
    created_at: '2024-01-12T09:15:00Z',
    updated_at: '2024-01-20T16:20:00Z'
  }
];

export function getDemoProperties(page = 1, limit = 10, search = '', category = 'all', status = 'all') {
  let filtered = demoProperties;
  
  // Apply search filter
  if (search) {
    filtered = filtered.filter(property => 
      property.title.toLowerCase().includes(search.toLowerCase()) ||
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
