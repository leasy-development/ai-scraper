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
  [CrawlerStatus.TODO]: 'bg-muted/50 text-muted-foreground border-muted hover:bg-muted/70',
  [CrawlerStatus.IN_PROGRESS]: 'bg-muted/50 text-muted-foreground border-muted hover:bg-muted/70',
  [CrawlerStatus.READY_FOR_QA]: 'bg-muted/50 text-muted-foreground border-muted hover:bg-muted/70',
  [CrawlerStatus.COMPLETED]: 'bg-muted/50 text-muted-foreground border-muted hover:bg-muted/70',
  [CrawlerStatus.FAILED]: 'bg-muted/50 text-muted-foreground border-muted hover:bg-muted/70'
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
