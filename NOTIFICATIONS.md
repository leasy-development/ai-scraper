# 🔔 AiScraper Notification System

A comprehensive notification system with multiple components and utilities for managing user notifications throughout the application.

## 🚀 Features

### Core Notification Types
- ✅ **Success** - Green themed success notifications
- ❌ **Error** - Red themed error notifications  
- ⚠️ **Warning** - Yellow themed warning notifications
- ℹ️ **Info** - Blue themed informational notifications
- ⏳ **Loading** - Purple themed loading states
- 🎯 **Custom** - Fully customizable notifications

### Multiple Display Options
- **Toast Notifications** - Temporary popup messages
- **Inline Notifications** - Embedded page notifications
- **Notification Center** - Persistent notification management
- **Banner Notifications** - Full-width alerts

### Advanced Features
- 🔄 **Auto-dismiss** with customizable timeouts
- 📱 **Responsive** design for all screen sizes
- 🎨 **Themed** with consistent design system
- 🔔 **Unread counters** and read status tracking
- 🎛️ **Filtering** by type and status
- 🔄 **Retry logic** for failed operations
- ⚡ **Progress tracking** for long operations
- 📦 **Batch processing** with progress updates

## 📦 Components

### NotificationProvider
Central context provider that manages all notifications.

```tsx
import { NotificationProvider } from '@/contexts/NotificationContext';

<NotificationProvider>
  <App />
</NotificationProvider>
```

### NotificationCenter
Dropdown component showing all notifications with management features.

```tsx
import { NotificationCenter } from '@/components/notifications/NotificationCenter';

<NotificationCenter />
```

### InlineNotification
Embeddable notification components for specific page sections.

```tsx
import { 
  InlineNotification,
  SuccessNotification,
  ErrorNotification,
  WarningNotification,
  InfoNotification,
  LoadingNotification 
} from '@/components/notifications/InlineNotification';

<SuccessNotification 
  title="Success!"
  message="Operation completed successfully"
  onDismiss={() => {}}
/>
```

## 🛠️ Usage

### Basic Notifications

```tsx
import { useNotificationActions } from '@/contexts/NotificationContext';

const { success, error, warning, info, loading } = useNotificationActions();

// Simple notifications
success('Operation completed!');
error('Something went wrong');
warning('Please review this action');
info('Here is some information');

// With custom messages
success('Data saved', 'Your changes have been saved successfully');

// Loading states
const loadingId = loading('Processing...');
// Later dismiss it
dismiss(loadingId);
```

### Quick Utilities

```tsx
import { quickNotify, operationNotify, authNotify, systemNotify } from '@/lib/notifications';

// Quick notifications
quickNotify.success('File uploaded successfully');
quickNotify.error('Network connection failed');

// Operation-specific
operationNotify.created('Property');
operationNotify.updated('Crawler');
operationNotify.deleted('Item');
operationNotify.copied('URL');

// Authentication
authNotify.loginSuccess();
authNotify.sessionExpired();

// System events
systemNotify.updateAvailable();
systemNotify.connectionLost();
```

### API Integration

```tsx
import { useApiNotifications } from '@/hooks/useApiNotifications';

const { crud, files, batch } = useApiNotifications();

// CRUD operations with automatic notifications
await crud.create(() => api.post('/api/items', data), 'item');
await crud.update(() => api.put(`/api/items/${id}`, data), 'item');
await crud.delete(() => api.delete(`/api/items/${id}`), 'item');

// File operations
await files.upload(() => uploadFile(file), 'document.pdf');
await files.download(() => downloadFile(id), 'report.xlsx');

// Batch processing
const results = await batch(operations, 'item');
```

### Specialized Hooks

```tsx
import { useCrawlerNotifications, usePropertyNotifications } from '@/hooks/useApiNotifications';

const crawlerNotifications = useCrawlerNotifications();
const propertyNotifications = usePropertyNotifications();

// Domain-specific operations
await crawlerNotifications.createCrawler(() => createCrawler(data));
await crawlerNotifications.runCrawler(() => startCrawler(id));

await propertyNotifications.createProperty(() => createProperty(data));
await propertyNotifications.exportProperties(() => exportToCSV(), 'CSV');
```

### Progress Notifications

```tsx
import { ProgressNotification } from '@/lib/notifications';

const progress = new ProgressNotification('Processing Data', 'Starting...');

// Update progress
progress.updateProgress(25, 'Processing step 1...');
progress.updateProgress(50, 'Processing step 2...');
progress.updateProgress(75, 'Processing step 3...');

// Complete or error
progress.complete('All data processed successfully');
// OR
progress.error('Processing failed at step 2');
```

### Batch Operations

```tsx
import { batchNotify } from '@/lib/notifications';

const items = [/* array of items */];
const results = await batchNotify.processItems(
  items,
  async (item, index) => {
    // Process each item
    return await processItem(item);
  },
  {
    title: 'Processing Items',
    showProgress: true,
    successMessage: (results) => `Processed ${results.length} items`,
    errorMessage: (errors) => `${errors.length} items failed`,
  }
);
```

## 🎨 Inline Notification Variants

### Default
Full-featured notification with icon, title, message, and actions.

### Compact
Smaller notification for tight spaces.

### Banner
Full-width notification for important system messages.

```tsx
<InlineNotification 
  type="success"
  title="Operation Complete"
  message="Your data has been saved"
  variant="default" // default | compact | banner
  onDismiss={() => {}}
  action={{
    label: 'View Details',
    onClick: () => {}
  }}
/>
```

## 🔧 Configuration

### Notification Durations
- Success: 4000ms
- Error: 6000ms 
- Warning: 5000ms
- Info: 4000ms
- Loading: Persistent (manual dismiss)

### Customization
All components support custom styling through className props and follow the design system theme.

## 🧪 Testing

Visit `/dashboard/notifications` to test all notification features with the comprehensive demo page.

## 🚀 Integration

The notification system is fully integrated with:
- ✅ Authentication flows
- ✅ API error handling
- ✅ Dashboard navigation
- ✅ Responsive design
- ✅ Dark/light themes
- ✅ Accessibility features

All notifications are automatically displayed in the NotificationCenter accessible via the bell icon in the navigation bar.
