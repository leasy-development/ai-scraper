import { useEffect } from 'react';
import { useNotificationActions } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';

export function useDemoNotifications() {
  const { success, error, warning, info } = useNotificationActions();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Only generate demo notifications for demo user and if authenticated
    if (isAuthenticated && user?.email === 'demo@aiscraper.com') {
      // Check if we've already generated demo notifications
      const hasGenerated = localStorage.getItem('demo_notifications_generated');
      
      if (!hasGenerated) {
        // Generate sample notifications after a short delay
        setTimeout(() => {
          success('Crawler Started', 'E-commerce product scraper is now running successfully');
          info('System Update', 'Dashboard has been updated with new notification features');
          warning('Rate Limit Warning', 'API request rate is approaching limits for amazon.com crawler');
          error('Connection Error', 'Failed to connect to news.ycombinator.com - retrying in 30 seconds');
          
          // Mark as generated so we don't spam notifications
          localStorage.setItem('demo_notifications_generated', 'true');
        }, 2000);
      }
    }
  }, [isAuthenticated, user, success, error, warning, info]);
}
