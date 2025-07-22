import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { usePropertyNotifications } from "@/hooks/useApiNotifications";
import { operationNotify } from "@/lib/notifications";
import { getDemoProperties, getDemoPropertyStats } from "@/lib/demoData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Home,
  Building,
  Building2,
  MapPin,
  Bed,
  Bath,
  Square,
  DollarSign,
  Phone,
  Mail,
  RefreshCw,
  Grid3x3,
  List
} from "lucide-react";
import { TableLoading, ButtonLoading } from "@/components/Loading";
import { 
  PropertyCategory, 
  PropertyStatus,
  PropertyResponse, 
  PropertiesListResponse, 
  CATEGORY_LABELS, 
  STATUS_LABELS, 
  STATUS_COLORS,
  CATEGORY_COLORS
} from "../../shared/property";

export default function Properties() {
  const [properties, setProperties] = useState<PropertyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState("all");

  // Stats
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchProperties();
    fetchStats();
  }, [searchQuery, categoryFilter, statusFilter, currentPage]);

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('auth_token');
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
      });

      if (searchQuery) params.append('search', searchQuery);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const response = await fetch(`/api/properties?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data: PropertiesListResponse = await response.json();
        setProperties(data.properties);
        setTotalProperties(data.total);
        setTotalPages(Math.ceil(data.total / data.limit));
      }
    } catch (error) {
      console.error('Failed to fetch properties:', error);

      // Use demo data when API is not available
      const demoData = getDemoProperties(page, limit, searchQuery, categoryFilter, statusFilter);
      setProperties(demoData.properties);
      setTotalProperties(demoData.total);
      setTotalPages(demoData.pages);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/properties/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchProperties();
        fetchStats();
      }
    } catch (error) {
      console.error('Failed to delete property:', error);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const getCategoryIcon = (category: PropertyCategory) => {
    switch (category) {
      case PropertyCategory.FURNISHED_APARTMENT:
        return <Building className="w-5 h-5" />;
      case PropertyCategory.FURNISHED_HOUSE:
        return <Home className="w-5 h-5" />;
      case PropertyCategory.SERVICED_APARTMENT:
        return <Building2 className="w-5 h-5" />;
      default:
        return <Building className="w-5 h-5" />;
    }
  };

  const CategoryStats = ({ category }: { category: PropertyCategory }) => {
    const categoryProperties = properties.filter(p => p.category === category);
    const totalForCategory = stats?.by_category[category] || 0;

    return (
      <Card className="glass border-border/50 hover:scale-105 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {CATEGORY_LABELS[category]}
          </CardTitle>
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${
            category === PropertyCategory.FURNISHED_APARTMENT ? 'from-purple-500 to-purple-600' :
            category === PropertyCategory.FURNISHED_HOUSE ? 'from-emerald-500 to-emerald-600' :
            'from-orange-500 to-orange-600'
          } p-2`}>
            {getCategoryIcon(category)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {isLoading ? '...' : totalForCategory}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {totalForCategory === 1 ? 'property' : 'properties'}
          </p>
        </CardContent>
      </Card>
    );
  };

  const PropertyCard = ({ property }: { property: PropertyResponse }) => (
    <Card className="glass border-border/50 hover:scale-105 transition-all duration-300 group">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {getCategoryIcon(property.category)}
            <Badge 
              variant="secondary" 
              className={`${CATEGORY_COLORS[property.category]} border text-xs`}
            >
              {CATEGORY_LABELS[property.category]}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/dashboard/properties/${property.id}/edit`}>
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
                    <AlertDialogTitle>Delete Property</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{property.title}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => deleteProperty(property.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-foreground line-clamp-1">{property.title}</h3>
          <div className="flex items-center text-muted-foreground text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="line-clamp-1">{property.address}</span>
          </div>
        </div>

        <Badge 
          variant="secondary" 
          className={`${STATUS_COLORS[property.status]} border w-fit`}
        >
          {STATUS_LABELS[property.status]}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {property.description}
        </p>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-1">
            <Bed className="w-4 h-4 text-muted-foreground" />
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Bath className="w-4 h-4 text-muted-foreground" />
            <span>{property.bathrooms}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Square className="w-4 h-4 text-muted-foreground" />
            <span>{property.area}m²</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="text-xl font-bold text-foreground">
            {formatPrice(property.price, property.currency)}
            <span className="text-sm font-normal text-muted-foreground">/month</span>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="ghost" asChild>
              <a href={`tel:${property.contactPhone}`}>
                <Phone className="w-4 h-4" />
              </a>
            </Button>
            <Button size="sm" variant="ghost" asChild>
              <a href={`mailto:${property.contactEmail}`}>
                <Mail className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Properties</h1>
            <p className="text-muted-foreground mt-1">
              Manage your property portfolio
            </p>
          </div>
          <Button asChild className="btn-gradient mt-4 sm:mt-0">
            <Link to="/dashboard/properties/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </Link>
          </Button>
        </div>

        {/* Category Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CategoryStats category={PropertyCategory.FURNISHED_APARTMENT} />
          <CategoryStats category={PropertyCategory.FURNISHED_HOUSE} />
          <CategoryStats category={PropertyCategory.SERVICED_APARTMENT} />
        </div>

        {/* Filters */}
        <Card className="glass border-border/50">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search properties by title, address, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-background/50 border-border/50"
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[200px] bg-background/50 border-border/50">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.values(PropertyCategory).map((category) => (
                    <SelectItem key={category} value={category}>
                      {CATEGORY_LABELS[category]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] bg-background/50 border-border/50">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.values(PropertyStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {STATUS_LABELS[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              <Button variant="outline" onClick={fetchProperties} disabled={isLoading}>
                {isLoading ? <ButtonLoading /> : <RefreshCw className="w-4 h-4 mr-2" />}
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Properties Grid/List */}
        <div className="space-y-4">
          {isLoading ? (
            <TableLoading />
          ) : properties.length === 0 ? (
            <Card className="glass border-border/50">
              <CardContent className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                    ? 'No properties match your search criteria'
                    : 'No properties found'
                  }
                </div>
                <Button asChild className="btn-gradient">
                  <Link to="/dashboard/properties/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Property
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
            }>
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {properties.length} of {totalProperties} properties
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
