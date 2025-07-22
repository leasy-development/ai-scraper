import { CrawlerResponse } from '@shared/crawler';

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
