import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Save, Loader2, ExternalLink } from "lucide-react";
import {
  CrawlerStatus,
  CrawlerResponse,
  CreateCrawlerRequest,
  UpdateCrawlerRequest,
  STATUS_LABELS,
  validateCrawlerData,
} from "@shared/crawler";

export default function CrawlerForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<CreateCrawlerRequest>({
    name: "",
    url: "",
    description: "",
    status: CrawlerStatus.TODO,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditing);
  const [errors, setErrors] = useState<string[]>([]);
  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    if (isEditing && id) {
      fetchCrawler(id);
    }
  }, [id, isEditing]);

  const fetchCrawler = async (crawlerId: string) => {
    try {
      setIsFetching(true);
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`/api/crawlers/${crawlerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const crawler: CrawlerResponse = await response.json();
        setFormData({
          name: crawler.name,
          url: crawler.url,
          description: crawler.description,
          status: crawler.status,
        });
      } else if (response.status === 404) {
        setGeneralError("Crawler not found");
      } else {
        setGeneralError("Failed to load crawler");
      }
    } catch (error) {
      console.error("Failed to fetch crawler:", error);
      setGeneralError("Failed to load crawler");
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setGeneralError("");

    // Validate form data
    const validationErrors = validateCrawlerData(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("auth_token");
      const url = isEditing ? `/api/crawlers/${id}` : "/api/crawlers";
      const method = isEditing ? "PUT" : "POST";

      const requestData: CreateCrawlerRequest | UpdateCrawlerRequest = isEditing
        ? formData // For updates, include all fields
        : formData; // For creation, include all fields

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        navigate("/dashboard/crawlers");
      } else {
        const errorData = await response.json();
        if (errorData.errors) {
          setErrors(errorData.errors);
        } else {
          setGeneralError(
            errorData.message ||
              `Failed to ${isEditing ? "update" : "create"} crawler`,
          );
        }
      }
    } catch (error) {
      console.error(
        `Failed to ${isEditing ? "update" : "create"} crawler:`,
        error,
      );
      setGeneralError(`Failed to ${isEditing ? "update" : "create"} crawler`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange =
    (field: keyof CreateCrawlerRequest) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors.length > 0) setErrors([]);
      if (generalError) setGeneralError("");
    };

  const handleStatusChange = (status: CrawlerStatus) => {
    setFormData((prev) => ({ ...prev, status }));
  };

  if (isFetching) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard/crawlers")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {isEditing ? "Edit Crawler" : "Create New Crawler"}
            </h1>
            <p className="text-muted-foreground">
              {isEditing
                ? "Update your web crawler configuration"
                : "Set up a new web crawler to extract data from websites"}
            </p>
          </div>
        </div>

        {/* Form */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle>Crawler Configuration</CardTitle>
            <CardDescription>
              Configure your web crawler settings and target information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Display */}
              {(errors.length > 0 || generalError) && (
                <Alert className="border-destructive/50 bg-destructive/10">
                  <AlertDescription className="text-destructive">
                    {generalError || (
                      <ul className="list-disc list-inside space-y-1">
                        {errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {/* Crawler Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Crawler Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., Product Price Monitor, News Aggregator"
                  value={formData.name}
                  onChange={handleInputChange("name")}
                  className="bg-background/50 border-border/50 focus:bg-background"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Give your crawler a descriptive name to identify its purpose
                </p>
              </div>

              {/* Target URL */}
              <div className="space-y-2">
                <Label htmlFor="url" className="text-sm font-medium">
                  Target URL <span className="text-destructive">*</span>
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com"
                    value={formData.url}
                    onChange={handleInputChange("url")}
                    className="flex-1 bg-background/50 border-border/50 focus:bg-background"
                    required
                  />
                  {formData.url && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => window.open(formData.url, "_blank")}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  The website URL that this crawler will target
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this crawler does, what data it extracts, and how often it should run..."
                  value={formData.description}
                  onChange={handleInputChange("description")}
                  className="bg-background/50 border-border/50 focus:bg-background min-h-[100px]"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Provide details about the crawler's purpose and functionality
                </p>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(CrawlerStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {STATUS_LABELS[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Set the current status of this crawler
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="submit"
                  className="btn-gradient flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {isEditing ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {isEditing ? "Update Crawler" : "Create Crawler"}
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="btn-glass flex-1"
                  onClick={() => navigate("/dashboard/crawlers")}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="glass border-border/50 bg-muted/20">
          <CardHeader>
            <CardTitle className="text-lg">Quick Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              • Choose a descriptive name that clearly identifies the crawler's
              purpose
            </p>
            <p>
              • Ensure the target URL is accessible and returns the data you
              want to extract
            </p>
            <p>
              • Use the description to document extraction rules and scheduling
              requirements
            </p>
            <p>
              • Start with "Todo" status and update as you progress through
              development
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
