import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  ExternalLink,
  Loader2,
  RefreshCw
} from "lucide-react";
import { 
  CrawlerStatus, 
  CrawlerResponse, 
  CrawlersListResponse, 
  STATUS_LABELS, 
  STATUS_COLORS 
} from "@shared/crawler";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Crawlers() {
  const [crawlers, setCrawlers] = useState<CrawlerResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCrawlers, setTotalCrawlers] = useState(0);

  useEffect(() => {
    fetchCrawlers();
  }, [searchQuery, statusFilter, sortBy, sortOrder, currentPage]);

  const fetchCrawlers = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('auth_token');
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        sortBy,
        sortOrder,
      });

      if (searchQuery) params.append('search', searchQuery);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const response = await fetch(`/api/crawlers?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data: CrawlersListResponse = await response.json();
        setCrawlers(data.crawlers);
        setTotalCrawlers(data.total);
        setTotalPages(Math.ceil(data.total / data.limit));
      }
    } catch (error) {
      console.error('Failed to fetch crawlers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCrawler = async (id: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/crawlers/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchCrawlers(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to delete crawler:', error);
    }
  };

  const updateCrawlerStatus = async (id: string, status: CrawlerStatus) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/crawlers/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchCrawlers(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to update crawler status:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Web Crawlers</h1>
            <p className="text-muted-foreground mt-1">
              Manage and monitor your web scraping crawlers
            </p>
          </div>
          <Button asChild className="btn-gradient mt-4 sm:mt-0">
            <Link to="/dashboard/crawlers/new">
              <Plus className="w-4 h-4 mr-2" />
              New Crawler
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="glass border-border/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">{totalCrawlers}</div>
              <p className="text-xs text-muted-foreground">Total Crawlers</p>
            </CardContent>
          </Card>
          <Card className="glass border-border/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">
                {crawlers.filter(c => c.status === CrawlerStatus.IN_PROGRESS).length}
              </div>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>
          <Card className="glass border-border/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">
                {crawlers.filter(c => c.status === CrawlerStatus.COMPLETED).length}
              </div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card className="glass border-border/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">
                {crawlers.filter(c => c.status === CrawlerStatus.FAILED).length}
              </div>
              <p className="text-xs text-muted-foreground">Failed</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search crawlers by name, URL, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background/50 border-border/50"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-background/50 border-border/50">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {Object.values(CrawlerStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={fetchCrawlers} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Crawlers Table */}
        <Card className="glass border-border/50">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : crawlers.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  {searchQuery || statusFilter !== 'all' 
                    ? 'No crawlers match your search criteria'
                    : 'No crawlers found'
                  }
                </div>
                <Button asChild className="btn-gradient">
                  <Link to="/dashboard/crawlers/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Crawler
                  </Link>
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {crawlers.map((crawler) => (
                    <TableRow key={crawler.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold text-foreground">{crawler.name}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {crawler.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <a 
                          href={crawler.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center max-w-xs truncate"
                        >
                          <span className="truncate">{crawler.url}</span>
                          <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                        </a>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={crawler.status}
                          onValueChange={(value) => updateCrawlerStatus(crawler.id, value as CrawlerStatus)}
                        >
                          <SelectTrigger className="w-auto border-0 bg-transparent p-0 h-auto">
                            <Badge 
                              variant="secondary" 
                              className={`${STATUS_COLORS[crawler.status]} border cursor-pointer`}
                            >
                              {STATUS_LABELS[crawler.status]}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(CrawlerStatus).map((status) => (
                              <SelectItem key={status} value={status}>
                                {STATUS_LABELS[status]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(crawler.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/dashboard/crawlers/${crawler.id}/edit`}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Crawler</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{crawler.name}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => deleteCrawler(crawler.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {crawlers.length} of {totalCrawlers} crawlers
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
