import React from 'react';

// Performance monitoring utilities
interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any> | undefined;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private isEnabled: boolean = __DEV__;

  constructor(enabled: boolean = __DEV__) {
    this.isEnabled = enabled;
  }

  /**
   * Start timing a performance metric
   */
  start(name: string, metadata?: Record<string, any>): void {
    if (!this.isEnabled) return;

    this.metrics.set(name, {
      name,
      startTime: performance.now(),
      metadata: metadata || undefined,
    });
  }

  /**
   * End timing a performance metric
   */
  end(name: string): number | null {
    if (!this.isEnabled) return null;

    const metric = this.metrics.get(name);
    if (!metric) {
      console.warn(`Performance metric "${name}" not found`);
      return null;
    }

    metric.endTime = performance.now();
    metric.duration = metric.endTime - metric.startTime;

    // Log in development
    if (__DEV__) {
      console.log(`⏱️ ${name}: ${metric.duration.toFixed(2)}ms`, metric.metadata);
    }

    return metric.duration;
  }

  /**
   * Measure the execution time of a function
   */
  async measure<T>(
    name: string,
    fn: () => Promise<T> | T,
    metadata?: Record<string, any>
  ): Promise<T> {
    if (!this.isEnabled) {
      return await fn();
    }

    this.start(name, metadata);
    try {
      const result = await fn();
      this.end(name);
      return result;
    } catch (error) {
      this.end(name);
      throw error;
    }
  }

  /**
   * Get all metrics
   */
  getMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics.clear();
  }

  /**
   * Get a specific metric
   */
  getMetric(name: string): PerformanceMetric | undefined {
    return this.metrics.get(name);
  }

  /**
   * Enable/disable performance monitoring
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }
}

// Create global instance
export const performanceMonitor = new PerformanceMonitor();

// Utility functions
export const measurePerformance = <T>(
  name: string,
  fn: () => Promise<T> | T,
  metadata?: Record<string, any>
): Promise<T> => {
  return performanceMonitor.measure(name, fn, metadata);
};

export const startPerformanceTimer = (name: string, metadata?: Record<string, any>): void => {
  performanceMonitor.start(name, metadata);
};

export const endPerformanceTimer = (name: string): number | null => {
  return performanceMonitor.end(name);
};

// React Hook for measuring component render performance
export const usePerformanceMeasure = (componentName: string) => {
  const startRender = () => {
    if (__DEV__) {
      startPerformanceTimer(`${componentName}_render`);
    }
  };

  const endRender = () => {
    if (__DEV__) {
      endPerformanceTimer(`${componentName}_render`);
    }
  };

  return { startRender, endRender };
};

// Higher-order component for measuring performance
export const withPerformanceMeasure = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) => {
  const displayName = componentName || WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const WithPerformanceMeasure = (props: P) => {
    const { startRender, endRender } = usePerformanceMeasure(displayName);

    React.useEffect(() => {
      startRender();
      return () => {
        endRender();
      };
    });

    return React.createElement(WrappedComponent, props);
  };

  WithPerformanceMeasure.displayName = `withPerformanceMeasure(${displayName})`;
  return WithPerformanceMeasure;
};

export default performanceMonitor;
