// Crawler Status Enum
export enum CrawlerStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  READY_FOR_QA = 'ready_for_qa',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

// Crawler Interface
export interface Crawler {
  id: string;
  name: string;
  url: string;
  description: string;
  status: CrawlerStatus;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

// Create Crawler Request
export interface CreateCrawlerRequest {
  name: string;
  url: string;
  description: string;
  status?: CrawlerStatus;
}

// Update Crawler Request
export interface UpdateCrawlerRequest {
  name?: string;
  url?: string;
  description?: string;
  status?: CrawlerStatus;
}

// Crawler Response
export interface CrawlerResponse {
  id: string;
  name: string;
  url: string;
  description: string;
  status: CrawlerStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Crawlers List Response
export interface CrawlersListResponse {
  crawlers: CrawlerResponse[];
  total: number;
  page: number;
  limit: number;
}

// Status color mapping for UI
export const STATUS_COLORS = {
  [CrawlerStatus.TODO]: 'bg-gray-100 text-gray-800 border-gray-200',
  [CrawlerStatus.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [CrawlerStatus.READY_FOR_QA]: 'bg-blue-100 text-blue-800 border-blue-200',
  [CrawlerStatus.COMPLETED]: 'bg-green-100 text-green-800 border-green-200',
  [CrawlerStatus.FAILED]: 'bg-red-100 text-red-800 border-red-200'
};

// Status labels for UI
export const STATUS_LABELS = {
  [CrawlerStatus.TODO]: 'Todo',
  [CrawlerStatus.IN_PROGRESS]: 'In Progress',
  [CrawlerStatus.READY_FOR_QA]: 'Ready for QA',
  [CrawlerStatus.COMPLETED]: 'Completed',
  [CrawlerStatus.FAILED]: 'Failed'
};

// Validation helper
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Validation for crawler creation
export function validateCrawlerData(data: CreateCrawlerRequest): string[] {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length < 1) {
    errors.push('Crawler name is required');
  }

  if (!data.url || !isValidUrl(data.url)) {
    errors.push('Valid URL is required');
  }

  if (!data.description || data.description.trim().length < 1) {
    errors.push('Description is required');
  }

  return errors;
}
