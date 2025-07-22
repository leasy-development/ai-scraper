import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { 
  Crawler, 
  CrawlerStatus, 
  CreateCrawlerRequest, 
  UpdateCrawlerRequest,
  CrawlerResponse,
  CrawlersListResponse,
  validateCrawlerData 
} from "@shared/crawler";

// In-memory crawler storage (replace with database in production)
const crawlers: Crawler[] = [];
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Helper function to verify JWT token and get user ID
function getUserIdFromToken(authHeader: string | undefined): string | null {
  if (!authHeader?.startsWith('Bearer ')) return null;
  
  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}

// Helper function to convert Crawler to CrawlerResponse
function toCrawlerResponse(crawler: Crawler): CrawlerResponse {
  return {
    ...crawler,
    created_at: crawler.created_at.toISOString(),
    updated_at: crawler.updated_at.toISOString()
  };
}

// Get all crawlers (with pagination, filtering, sorting)
export const getCrawlers: RequestHandler = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Query parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as CrawlerStatus;
    const search = req.query.search as string;
    const sortBy = req.query.sortBy as string || 'created_at';
    const sortOrder = req.query.sortOrder as string || 'desc';

    // Filter crawlers by user
    let userCrawlers = crawlers.filter(crawler => crawler.created_by === userId);

    // Apply status filter
    if (status && Object.values(CrawlerStatus).includes(status)) {
      userCrawlers = userCrawlers.filter(crawler => crawler.status === status);
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      userCrawlers = userCrawlers.filter(crawler => 
        crawler.name.toLowerCase().includes(searchLower) ||
        crawler.description.toLowerCase().includes(searchLower) ||
        crawler.url.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    userCrawlers.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Crawler];
      let bValue: any = b[sortBy as keyof Crawler];

      if (aValue instanceof Date) aValue = aValue.getTime();
      if (bValue instanceof Date) bValue = bValue.getTime();

      if (sortOrder === 'desc') {
        return bValue > aValue ? 1 : -1;
      }
      return aValue > bValue ? 1 : -1;
    });

    // Apply pagination
    const total = userCrawlers.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCrawlers = userCrawlers.slice(startIndex, endIndex);

    const response: CrawlersListResponse = {
      crawlers: paginatedCrawlers.map(toCrawlerResponse),
      total,
      page,
      limit
    };

    res.json(response);
  } catch (error) {
    console.error('Get crawlers error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get single crawler by ID
export const getCrawler: RequestHandler = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;
    const crawler = crawlers.find(c => c.id === id && c.created_by === userId);

    if (!crawler) {
      return res.status(404).json({ message: 'Crawler not found' });
    }

    res.json(toCrawlerResponse(crawler));
  } catch (error) {
    console.error('Get crawler error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create new crawler
export const createCrawler: RequestHandler = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const crawlerData: CreateCrawlerRequest = req.body;

    // Validate request data
    const validationErrors = validateCrawlerData(crawlerData);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validationErrors 
      });
    }

    // Create new crawler
    const newCrawler: Crawler = {
      id: Date.now().toString(),
      name: crawlerData.name.trim(),
      url: crawlerData.url.trim(),
      description: crawlerData.description.trim(),
      status: crawlerData.status || CrawlerStatus.TODO,
      created_by: userId,
      created_at: new Date(),
      updated_at: new Date()
    };

    crawlers.push(newCrawler);

    res.status(201).json({
      crawler: toCrawlerResponse(newCrawler),
      message: 'Crawler created successfully'
    });
  } catch (error) {
    console.error('Create crawler error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update crawler
export const updateCrawler: RequestHandler = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;
    const updateData: UpdateCrawlerRequest = req.body;

    const crawlerIndex = crawlers.findIndex(c => c.id === id && c.created_by === userId);
    if (crawlerIndex === -1) {
      return res.status(404).json({ message: 'Crawler not found' });
    }

    const crawler = crawlers[crawlerIndex];

    // Validate URL if provided
    if (updateData.url && !updateData.url.trim()) {
      return res.status(400).json({ message: 'URL cannot be empty' });
    }

    // Update crawler fields
    if (updateData.name !== undefined) {
      if (!updateData.name.trim()) {
        return res.status(400).json({ message: 'Name cannot be empty' });
      }
      crawler.name = updateData.name.trim();
    }

    if (updateData.url !== undefined) {
      try {
        new URL(updateData.url);
        crawler.url = updateData.url.trim();
      } catch {
        return res.status(400).json({ message: 'Invalid URL format' });
      }
    }

    if (updateData.description !== undefined) {
      if (!updateData.description.trim()) {
        return res.status(400).json({ message: 'Description cannot be empty' });
      }
      crawler.description = updateData.description.trim();
    }

    if (updateData.status !== undefined) {
      if (!Object.values(CrawlerStatus).includes(updateData.status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      crawler.status = updateData.status;
    }

    crawler.updated_at = new Date();

    res.json({
      crawler: toCrawlerResponse(crawler),
      message: 'Crawler updated successfully'
    });
  } catch (error) {
    console.error('Update crawler error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete crawler
export const deleteCrawler: RequestHandler = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;
    const crawlerIndex = crawlers.findIndex(c => c.id === id && c.created_by === userId);

    if (crawlerIndex === -1) {
      return res.status(404).json({ message: 'Crawler not found' });
    }

    crawlers.splice(crawlerIndex, 1);

    res.json({ message: 'Crawler deleted successfully' });
  } catch (error) {
    console.error('Delete crawler error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get crawler statistics
export const getCrawlerStats: RequestHandler = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userCrawlers = crawlers.filter(crawler => crawler.created_by === userId);

    const stats = {
      total: userCrawlers.length,
      by_status: {
        [CrawlerStatus.TODO]: userCrawlers.filter(c => c.status === CrawlerStatus.TODO).length,
        [CrawlerStatus.IN_PROGRESS]: userCrawlers.filter(c => c.status === CrawlerStatus.IN_PROGRESS).length,
        [CrawlerStatus.READY_FOR_QA]: userCrawlers.filter(c => c.status === CrawlerStatus.READY_FOR_QA).length,
        [CrawlerStatus.COMPLETED]: userCrawlers.filter(c => c.status === CrawlerStatus.COMPLETED).length,
        [CrawlerStatus.FAILED]: userCrawlers.filter(c => c.status === CrawlerStatus.FAILED).length
      }
    };

    res.json(stats);
  } catch (error) {
    console.error('Get crawler stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
