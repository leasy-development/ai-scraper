import { useCallback } from "react";
import { useNotificationActions } from "@/contexts/NotificationContext";
import { ApiError, ApiTimeoutError, ApiNetworkError } from "@/lib/api";

/**
 * Hook for handling API operations with automatic notifications
 */
export function useApiNotifications() {
  const { success, error, loading, dismiss } = useNotificationActions();

  /**
   * Wrap an API call with loading and result notifications
   */
  const withNotifications = useCallback(
    async <T>(
      operation: () => Promise<T>,
      messages: {
        loading: string;
        success: string;
        error?: string;
      },
      options: {
        showSuccessNotification?: boolean;
        customErrorHandler?: (error: Error) => string | null;
      } = {},
    ): Promise<T> => {
      const { showSuccessNotification = true, customErrorHandler } = options;

      const loadingId = loading(messages.loading);

      try {
        const result = await operation();
        dismiss(loadingId);

        if (showSuccessNotification) {
          success(messages.success);
        }

        return result;
      } catch (err) {
        dismiss(loadingId);

        // Try custom error handler first
        if (customErrorHandler) {
          const customMessage = customErrorHandler(err as Error);
          if (customMessage) {
            error("Operation failed", customMessage);
            throw err;
          }
        }

        // Default error handling
        let errorMessage = messages.error || "Operation failed";

        if (err instanceof ApiTimeoutError) {
          errorMessage = "Request timed out. Please try again.";
        } else if (err instanceof ApiNetworkError) {
          errorMessage = "Network error. Please check your connection.";
        } else if (err instanceof ApiError) {
          errorMessage = err.message;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }

        error("Operation failed", errorMessage);
        throw err;
      }
    },
    [success, error, loading, dismiss],
  );

  /**
   * CRUD operation helpers with standard messages
   */
  const crud = {
    create: useCallback(
      async <T>(
        operation: () => Promise<T>,
        itemType: string,
        options?: {
          showSuccessNotification?: boolean;
          customErrorHandler?: (error: Error) => string | null;
        },
      ) => {
        return withNotifications(
          operation,
          {
            loading: `Creating ${itemType}...`,
            success: `${itemType} created successfully`,
            error: `Failed to create ${itemType}`,
          },
          options,
        );
      },
      [withNotifications],
    ),

    update: useCallback(
      async <T>(
        operation: () => Promise<T>,
        itemType: string,
        options?: {
          showSuccessNotification?: boolean;
          customErrorHandler?: (error: Error) => string | null;
        },
      ) => {
        return withNotifications(
          operation,
          {
            loading: `Updating ${itemType}...`,
            success: `${itemType} updated successfully`,
            error: `Failed to update ${itemType}`,
          },
          options,
        );
      },
      [withNotifications],
    ),

    delete: useCallback(
      async <T>(
        operation: () => Promise<T>,
        itemType: string,
        options?: {
          showSuccessNotification?: boolean;
          customErrorHandler?: (error: Error) => string | null;
        },
      ) => {
        return withNotifications(
          operation,
          {
            loading: `Deleting ${itemType}...`,
            success: `${itemType} deleted successfully`,
            error: `Failed to delete ${itemType}`,
          },
          options,
        );
      },
      [withNotifications],
    ),

    fetch: useCallback(
      async <T>(
        operation: () => Promise<T>,
        itemType: string,
        options?: {
          showSuccessNotification?: boolean;
          customErrorHandler?: (error: Error) => string | null;
        },
      ) => {
        return withNotifications(
          operation,
          {
            loading: `Loading ${itemType}...`,
            success: `${itemType} loaded successfully`,
            error: `Failed to load ${itemType}`,
          },
          { showSuccessNotification: false, ...options },
        );
      },
      [withNotifications],
    ),

    save: useCallback(
      async <T>(
        operation: () => Promise<T>,
        itemType?: string,
        options?: {
          showSuccessNotification?: boolean;
          customErrorHandler?: (error: Error) => string | null;
        },
      ) => {
        const type = itemType || "changes";
        return withNotifications(
          operation,
          {
            loading: `Saving ${type}...`,
            success: `${type} saved successfully`,
            error: `Failed to save ${type}`,
          },
          options,
        );
      },
      [withNotifications],
    ),
  };

  /**
   * File operation helpers
   */
  const files = {
    upload: useCallback(
      async <T>(
        operation: () => Promise<T>,
        fileName?: string,
        options?: {
          showSuccessNotification?: boolean;
          customErrorHandler?: (error: Error) => string | null;
        },
      ) => {
        const name = fileName || "file";
        return withNotifications(
          operation,
          {
            loading: `Uploading ${name}...`,
            success: `${name} uploaded successfully`,
            error: `Failed to upload ${name}`,
          },
          options,
        );
      },
      [withNotifications],
    ),

    download: useCallback(
      async <T>(
        operation: () => Promise<T>,
        fileName?: string,
        options?: {
          showSuccessNotification?: boolean;
          customErrorHandler?: (error: Error) => string | null;
        },
      ) => {
        const name = fileName || "file";
        return withNotifications(
          operation,
          {
            loading: `Downloading ${name}...`,
            success: `${name} downloaded successfully`,
            error: `Failed to download ${name}`,
          },
          options,
        );
      },
      [withNotifications],
    ),

    export: useCallback(
      async <T>(
        operation: () => Promise<T>,
        format?: string,
        options?: {
          showSuccessNotification?: boolean;
          customErrorHandler?: (error: Error) => string | null;
        },
      ) => {
        const formatText = format ? ` as ${format}` : "";
        return withNotifications(
          operation,
          {
            loading: `Exporting data${formatText}...`,
            success: `Data exported successfully${formatText}`,
            error: `Failed to export data`,
          },
          options,
        );
      },
      [withNotifications],
    ),

    import: useCallback(
      async <T>(
        operation: () => Promise<T>,
        source?: string,
        options?: {
          showSuccessNotification?: boolean;
          customErrorHandler?: (error: Error) => string | null;
        },
      ) => {
        const sourceText = source ? ` from ${source}` : "";
        return withNotifications(
          operation,
          {
            loading: `Importing data${sourceText}...`,
            success: `Data imported successfully${sourceText}`,
            error: `Failed to import data`,
          },
          options,
        );
      },
      [withNotifications],
    ),
  };

  /**
   * Batch operation helper
   */
  const batch = useCallback(
    async <T>(
      operations: Array<() => Promise<T>>,
      itemType: string,
      options?: {
        showSuccessNotification?: boolean;
        customErrorHandler?: (error: Error) => string | null;
      },
    ): Promise<T[]> => {
      const loadingId = loading(
        `Processing ${operations.length} ${itemType}(s)...`,
      );
      const results: T[] = [];
      const errors: Error[] = [];

      try {
        for (let i = 0; i < operations.length; i++) {
          try {
            const result = await operations[i]();
            results.push(result);
          } catch (err) {
            errors.push(
              err instanceof Error ? err : new Error("Unknown error"),
            );
          }
        }

        dismiss(loadingId);

        if (errors.length === 0) {
          if (options?.showSuccessNotification !== false) {
            success(
              `All ${itemType}(s) processed successfully`,
              `${results.length} items completed`,
            );
          }
        } else if (results.length > 0) {
          error(
            `Partial success`,
            `${results.length} ${itemType}(s) succeeded, ${errors.length} failed`,
          );
        } else {
          error(
            `Processing failed`,
            `All ${errors.length} ${itemType}(s) failed to process`,
          );
        }

        return results;
      } catch (err) {
        dismiss(loadingId);
        error(
          "Batch operation failed",
          "An unexpected error occurred during batch processing",
        );
        throw err;
      }
    },
    [loading, dismiss, success, error],
  );

  return {
    withNotifications,
    crud,
    files,
    batch,
  };
}

/**
 * Specialized hooks for common operations
 */
export function useCrawlerNotifications() {
  const api = useApiNotifications();

  return {
    createCrawler: (operation: () => Promise<any>) =>
      api.crud.create(operation, "crawler"),

    updateCrawler: (operation: () => Promise<any>) =>
      api.crud.update(operation, "crawler"),

    deleteCrawler: (operation: () => Promise<any>) =>
      api.crud.delete(operation, "crawler"),

    runCrawler: (operation: () => Promise<any>) =>
      api.withNotifications(operation, {
        loading: "Starting crawler...",
        success: "Crawler started successfully",
        error: "Failed to start crawler",
      }),

    stopCrawler: (operation: () => Promise<any>) =>
      api.withNotifications(operation, {
        loading: "Stopping crawler...",
        success: "Crawler stopped successfully",
        error: "Failed to stop crawler",
      }),
  };
}

export function usePropertyNotifications() {
  const api = useApiNotifications();

  return {
    createProperty: (operation: () => Promise<any>) =>
      api.crud.create(operation, "property"),

    updateProperty: (operation: () => Promise<any>) =>
      api.crud.update(operation, "property"),

    deleteProperty: (operation: () => Promise<any>) =>
      api.crud.delete(operation, "property"),

    importProperties: (operation: () => Promise<any>) =>
      api.files.import(operation, "properties file"),

    exportProperties: (operation: () => Promise<any>, format?: string) =>
      api.files.export(operation, format),
  };
}
