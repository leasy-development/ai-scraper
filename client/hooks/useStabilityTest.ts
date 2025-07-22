import { useEffect, useState } from 'react';
import { runHealthCheck, SystemHealth, logSystemInfo } from '@/lib/healthCheck';

interface StabilityTestResult {
  isRunning: boolean;
  lastHealth?: SystemHealth;
  issues: string[];
  recommendations: string[];
}

/**
 * Hook for running stability tests and monitoring system health
 */
export function useStabilityTest(enabled = false) {
  const [result, setResult] = useState<StabilityTestResult>({
    isRunning: false,
    issues: [],
    recommendations: [],
  });

  useEffect(() => {
    if (!enabled) return;

    let mounted = true;

    const runTest = async () => {
      setResult(prev => ({ ...prev, isRunning: true }));

      try {
        // Log system info
        logSystemInfo();

        // Run health check
        const health = await runHealthCheck();
        
        if (!mounted) return;

        // Analyze results
        const issues: string[] = [];
        const recommendations: string[] = [];

        // Check for unhealthy endpoints
        const unhealthyEndpoints = health.checks.filter(c => c.status === 'unhealthy');
        if (unhealthyEndpoints.length > 0) {
          issues.push(`${unhealthyEndpoints.length} endpoint(s) are unhealthy`);
          recommendations.push('Check network connectivity and server status');
        }

        // Check for slow endpoints
        const slowEndpoints = health.checks.filter(c => 
          c.responseTime && c.responseTime > 2000
        );
        if (slowEndpoints.length > 0) {
          issues.push(`${slowEndpoints.length} endpoint(s) are responding slowly`);
          recommendations.push('Consider optimizing slow endpoints or checking network');
        }

        // Check localStorage
        try {
          localStorage.setItem('stability-test', 'test');
          localStorage.removeItem('stability-test');
        } catch {
          issues.push('localStorage is not available');
          recommendations.push('Enable cookies and localStorage in browser settings');
        }

        // Check for authentication
        const authToken = localStorage.getItem('auth_token');
        if (!authToken) {
          issues.push('No authentication token found');
          recommendations.push('Log in to access protected features');
        }

        setResult({
          isRunning: false,
          lastHealth: health,
          issues,
          recommendations,
        });

      } catch (error) {
        if (!mounted) return;
        
        setResult({
          isRunning: false,
          issues: ['Failed to run stability test'],
          recommendations: ['Refresh the page and try again'],
        });
      }
    };

    runTest();

    return () => {
      mounted = false;
    };
  }, [enabled]);

  return result;
}

/**
 * Hook for monitoring auth stability
 */
export function useAuthStabilityMonitor() {
  const [authIssues, setAuthIssues] = useState<string[]>([]);

  useEffect(() => {
    // Monitor auth token changes
    const checkAuthStability = () => {
      const issues: string[] = [];
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        try {
          // Basic token format validation
          const parts = token.split('.');
          if (parts.length !== 3) {
            issues.push('Invalid JWT token format');
          }
          
          // Check token expiration (basic check)
          const payload = JSON.parse(atob(parts[1]));
          if (payload.exp && payload.exp * 1000 < Date.now()) {
            issues.push('Authentication token has expired');
          }
        } catch {
          issues.push('Malformed authentication token');
        }
      }

      setAuthIssues(issues);
    };

    // Check immediately
    checkAuthStability();

    // Check periodically
    const interval = setInterval(checkAuthStability, 60000); // Every minute

    return () => clearInterval(interval);
  }, []);

  return authIssues;
}
