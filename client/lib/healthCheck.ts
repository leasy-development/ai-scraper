/**
 * System health check utility for monitoring application stability
 */

import { api } from "./api";

export interface HealthCheckResult {
  endpoint: string;
  status: "healthy" | "degraded" | "unhealthy";
  responseTime?: number;
  error?: string;
}

export interface SystemHealth {
  overall: "healthy" | "degraded" | "unhealthy";
  checks: HealthCheckResult[];
  timestamp: Date;
}

/**
 * Check individual endpoint health
 */
async function checkEndpoint(
  endpoint: string,
  timeout = 5000,
): Promise<HealthCheckResult> {
  const start = Date.now();

  try {
    await api.get(endpoint, { timeout, retries: 1 });
    const responseTime = Date.now() - start;

    return {
      endpoint,
      status: responseTime > 2000 ? "degraded" : "healthy",
      responseTime,
    };
  } catch (error) {
    return {
      endpoint,
      status: "unhealthy",
      responseTime: Date.now() - start,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Run comprehensive system health check
 */
export async function runHealthCheck(): Promise<SystemHealth> {
  const endpoints = [
    "/api/ping",
    "/api/auth/verify",
    "/api/crawlers",
    "/api/properties",
  ];

  const checks = await Promise.all(
    endpoints.map((endpoint) => checkEndpoint(endpoint)),
  );

  // Determine overall health
  const healthyCount = checks.filter((c) => c.status === "healthy").length;
  const degradedCount = checks.filter((c) => c.status === "degraded").length;
  const unhealthyCount = checks.filter((c) => c.status === "unhealthy").length;

  let overall: "healthy" | "degraded" | "unhealthy";
  if (unhealthyCount > 0) {
    overall = "unhealthy";
  } else if (degradedCount > 0) {
    overall = "degraded";
  } else {
    overall = "healthy";
  }

  return {
    overall,
    checks,
    timestamp: new Date(),
  };
}

/**
 * Monitor system health continuously
 */
export class HealthMonitor {
  private interval?: NodeJS.Timeout;
  private callbacks: ((health: SystemHealth) => void)[] = [];

  start(intervalMs = 30000) {
    this.stop(); // Stop any existing monitor

    this.interval = setInterval(async () => {
      try {
        const health = await runHealthCheck();
        this.callbacks.forEach((callback) => callback(health));
      } catch (error) {
        console.error("Health check failed:", error);
      }
    }, intervalMs);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }

  onHealthChange(callback: (health: SystemHealth) => void) {
    this.callbacks.push(callback);
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }
}

/**
 * Get browser environment info for debugging
 */
export function getBrowserInfo() {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    platform: navigator.platform,
    screen: {
      width: screen.width,
      height: screen.height,
      colorDepth: screen.colorDepth,
    },
    window: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    localStorage: {
      available: (() => {
        try {
          localStorage.setItem("test", "test");
          localStorage.removeItem("test");
          return true;
        } catch {
          return false;
        }
      })(),
    },
  };
}

/**
 * Log system info for debugging (development only)
 */
export function logSystemInfo() {
  if (process.env.NODE_ENV !== "development") return;

  console.group("🔍 AiScraper System Info");
  console.log("Browser:", getBrowserInfo());
  console.log(
    "Auth Token:",
    localStorage.getItem("auth_token") ? "Present" : "Missing",
  );
  console.log("Environment:", process.env.NODE_ENV);
  console.groupEnd();
}
