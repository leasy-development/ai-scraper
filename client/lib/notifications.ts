/**
 * Notification utility functions for common use cases
 */

import React from 'react';
import { toast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';

export interface QuickNotificationOptions {
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Quick notification functions that bypass the context system
 * Useful for simple toast notifications
 */
export const quickNotify = {
  success: (message: string, options?: QuickNotificationOptions) => {
    return toast({
      title: 'Success',
      description: message,
      variant: 'default',
      duration: options?.duration || 4000,
      // TODO: Fix action type issues
      // action: options?.action ? React.createElement(ToastAction, {
      //   altText: options.action.label,
      //   onClick: options.action.onClick,
      //   children: options.action.label,
      // }) : undefined,
    });
  },

  error: (message: string, options?: QuickNotificationOptions) => {
    return toast({
      title: 'Error',
      description: message,
      variant: 'destructive',
      duration: options?.duration || 6000,
      // TODO: Fix action type issues
      // action: options?.action ? React.createElement(ToastAction, {
      //   altText: options.action.label,
      //   onClick: options.action.onClick,
      //   children: options.action.label,
      // }) : undefined,
    });
  },

  info: (message: string, options?: QuickNotificationOptions) => {
    return toast({
      title: 'Information',
      description: message,
      variant: 'default',
      duration: options?.duration || 4000,
      // TODO: Fix action type issues
      // action: options?.action ? React.createElement(ToastAction, {
      //   altText: options.action.label,
      //   onClick: options.action.onClick,
      //   children: options.action.label,
      // }) : undefined,
    });
  },

  warning: (message: string, options?: QuickNotificationOptions) => {
    return toast({
      title: 'Warning',
      description: message,
      variant: 'default',
      duration: options?.duration || 5000,
      // TODO: Fix action type issues
      // action: options?.action ? React.createElement(ToastAction, {
      //   altText: options.action.label,
      //   onClick: options.action.onClick,
      //   children: options.action.label,
      // }) : undefined,
    });
  },
};

/**
 * Operation result notifications
 */
export const operationNotify = {
  // CRUD operations
  created: (itemType: string) => {
    quickNotify.success(`${itemType} created successfully`);
  },

  updated: (itemType: string) => {
    quickNotify.success(`${itemType} updated successfully`);
  },

  deleted: (itemType: string) => {
    quickNotify.success(`${itemType} deleted successfully`);
  },

  saved: (itemType?: string) => {
    quickNotify.success(`${itemType || 'Changes'} saved successfully`);
  },

  // Common errors
  saveError: (itemType?: string) => {
    quickNotify.error(`Failed to save ${itemType || 'changes'}. Please try again.`);
  },

  loadError: (itemType?: string) => {
    quickNotify.error(`Failed to load ${itemType || 'data'}. Please refresh the page.`);
  },

  networkError: () => {
    quickNotify.error('Network error. Please check your connection and try again.');
  },

  unauthorizedError: () => {
    quickNotify.error('You are not authorized to perform this action.');
  },

  // Validation errors
  validationError: (message?: string) => {
    quickNotify.error(message || 'Please check your input and try again.');
  },

  // Success operations
  copied: (item?: string) => {
    quickNotify.success(`${item || 'Item'} copied to clipboard`);
  },

  uploaded: (item?: string) => {
    quickNotify.success(`${item || 'File'} uploaded successfully`);
  },

  downloaded: (item?: string) => {
    quickNotify.success(`${item || 'File'} downloaded successfully`);
  },

  // Warning operations
  unsavedChanges: () => {
    quickNotify.warning('You have unsaved changes. Save before leaving.');
  },

  permissionWarning: () => {
    quickNotify.warning('Limited permissions. Some features may not be available.');
  },
};

/**
 * Authentication-related notifications
 */
export const authNotify = {
  loginSuccess: () => {
    quickNotify.success('Welcome back! You have successfully logged in.');
  },

  loginError: (message?: string) => {
    quickNotify.error(message || 'Login failed. Please check your credentials.');
  },

  logoutSuccess: () => {
    quickNotify.info('You have been logged out successfully.');
  },

  sessionExpired: () => {
    quickNotify.warning('Your session has expired. Please log in again.');
  },

  registrationSuccess: () => {
    quickNotify.success('Account created successfully! Welcome to AiScraper.');
  },

  registrationError: (message?: string) => {
    quickNotify.error(message || 'Registration failed. Please try again.');
  },

  passwordChanged: () => {
    quickNotify.success('Password changed successfully.');
  },

  accountUpdated: () => {
    quickNotify.success('Account settings updated successfully.');
  },
};

/**
 * System-related notifications
 */
export const systemNotify = {
  maintenanceMode: () => {
    quickNotify.warning('System maintenance in progress. Some features may be unavailable.');
  },

  updateAvailable: () => {
    quickNotify.info('A new version is available. Refresh the page to update.', {
      action: {
        label: 'Refresh',
        onClick: () => window.location.reload(),
      },
    });
  },

  connectionRestored: () => {
    quickNotify.success('Connection restored.');
  },

  connectionLost: () => {
    quickNotify.error('Connection lost. Reconnecting...', { persistent: true });
  },

  dataExported: (format?: string) => {
    quickNotify.success(`Data exported successfully${format ? ` as ${format}` : ''}.`);
  },

  dataImported: () => {
    quickNotify.success('Data imported successfully.');
  },

  backupCreated: () => {
    quickNotify.success('Backup created successfully.');
  },

  syncComplete: () => {
    quickNotify.success('Data synchronized successfully.');
  },
};

/**
 * Progress notifications with loading states
 */
export class ProgressNotification {
  private toastId: any;
  private progress: number = 0;

  constructor(title: string, initialMessage?: string) {
    this.toastId = toast({
      title,
      description: initialMessage || 'Starting...',
      duration: undefined, // Don't auto-dismiss
    });
  }

  updateProgress(progress: number, message?: string) {
    this.progress = Math.max(0, Math.min(100, progress));
    
    if (this.toastId?.update) {
      this.toastId.update({
        description: `${message || 'Processing...'} (${Math.round(this.progress)}%)`,
      });
    }
  }

  complete(message?: string) {
    if (this.toastId?.update) {
      this.toastId.update({
        title: 'Complete',
        description: message || 'Operation completed successfully',
        variant: 'default',
      });
    }
    
    // Auto-dismiss after completion
    setTimeout(() => {
      this.toastId?.dismiss();
    }, 3000);
  }

  error(message?: string) {
    if (this.toastId?.update) {
      this.toastId.update({
        title: 'Error',
        description: message || 'Operation failed',
        variant: 'destructive',
      });
    }
    
    // Auto-dismiss after error
    setTimeout(() => {
      this.toastId?.dismiss();
    }, 5000);
  }

  dismiss() {
    this.toastId?.dismiss();
  }
}

/**
 * Batch notification utilities
 */
export const batchNotify = {
  // Process multiple items with notifications
  processItems: async <T, R>(
    items: T[],
    processor: (item: T, index: number) => Promise<R>,
    options: {
      title: string;
      successMessage?: (results: R[]) => string;
      errorMessage?: (errors: Error[]) => string;
      showProgress?: boolean;
    }
  ): Promise<R[]> => {
    const progress = options.showProgress ? new ProgressNotification(options.title) : null;
    const results: R[] = [];
    const errors: Error[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const result = await processor(items[i], i);
        results.push(result);
        
        if (progress) {
          progress.updateProgress(((i + 1) / items.length) * 100, `Processing item ${i + 1} of ${items.length}`);
        }
      } catch (error) {
        errors.push(error instanceof Error ? error : new Error('Unknown error'));
      }
    }

    if (progress) {
      if (errors.length === 0) {
        progress.complete(options.successMessage?.(results) || `Processed ${results.length} items successfully`);
      } else {
        progress.error(options.errorMessage?.(errors) || `${errors.length} items failed to process`);
      }
    } else {
      // Show summary notification
      if (errors.length === 0) {
        quickNotify.success(options.successMessage?.(results) || `Processed ${results.length} items successfully`);
      } else {
        quickNotify.error(options.errorMessage?.(errors) || `${errors.length} items failed to process`);
      }
    }

    return results;
  },
};
