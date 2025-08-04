import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentMountTime: number;
  memoryUsage?: number;
  rerenderCount: number;
}

interface UsePerformanceOptions {
  trackMemory?: boolean;
  logToConsole?: boolean;
  threshold?: number; // Log warning if render time exceeds this (ms)
}

/**
 * Hook para monitorar performance de componentes
 */
export function usePerformance(
  componentName: string,
  options: UsePerformanceOptions = {}
) {
  const {
    trackMemory = false,
    logToConsole = process.env.NODE_ENV === 'development',
    threshold = 16, // 60fps = ~16ms per frame
  } = options;

  const mountTimeRef = useRef<number>(Date.now());
  const lastRenderTimeRef = useRef<number>(Date.now());
  const renderCountRef = useRef<number>(0);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    componentMountTime: 0,
    rerenderCount: 0,
  });

  useEffect(() => {
    const renderStartTime = lastRenderTimeRef.current;
    const renderEndTime = Date.now();
    const renderTime = renderEndTime - renderStartTime;
    
    renderCountRef.current += 1;
    
    const newMetrics: PerformanceMetrics = {
      renderTime,
      componentMountTime: renderEndTime - mountTimeRef.current,
      rerenderCount: renderCountRef.current,
    };

    // Track memory usage if enabled and available
    if (trackMemory && 'memory' in performance) {
      const memory = (performance as any).memory;
      newMetrics.memoryUsage = memory.usedJSHeapSize;
    }

    setMetrics(newMetrics);

    // Log performance warnings
    if (logToConsole) {
      if (renderTime > threshold) {
        console.warn(
          `⚠️ Slow render detected in ${componentName}: ${renderTime}ms (threshold: ${threshold}ms)`
        );
      }

      if (renderCountRef.current === 1) {
        console.log(`🚀 ${componentName} mounted in ${newMetrics.componentMountTime}ms`);
      }

      if (renderCountRef.current > 10 && renderCountRef.current % 10 === 0) {
        console.log(
          `🔄 ${componentName} has re-rendered ${renderCountRef.current} times`
        );
      }
    }

    // Update last render time for next measurement
    lastRenderTimeRef.current = Date.now();
  });

  return metrics;
}

/**
 * Hook para medir tempo de operações assíncronas
 */
export function useAsyncPerformance() {
  const measureAsync = async <T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> => {
    const startTime = performance.now();
    
    try {
      const result = await operation();
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`⏱️ ${operationName} completed in ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.error(
          `❌ ${operationName} failed after ${duration.toFixed(2)}ms:`,
          error
        );
      }
      
      throw error;
    }
  };

  return { measureAsync };
}

/**
 * Hook para monitorar Web Vitals
 */
export function useWebVitals() {
  const [vitals, setVitals] = useState<{
    CLS?: number;
    FID?: number;
    FCP?: number;
    LCP?: number;
    TTFB?: number;
  }>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Note: Install web-vitals package for production use
    // For now, using basic performance monitoring
    try {
      // Basic performance metrics using Performance API
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            setVitals(prev => ({ ...prev, LCP: entry.startTime }));
          }
          if (entry.entryType === 'first-contentful-paint') {
            setVitals(prev => ({ ...prev, FCP: entry.startTime }));
          }
        }
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-contentful-paint'] });
      
      return () => observer.disconnect();
    } catch (error) {
      console.warn('Performance monitoring not available:', error);
    }
  }, []);

  return vitals;
}

/**
 * Hook para detectar dispositivos com performance limitada
 */
export function useDevicePerformance() {
  const [deviceInfo, setDeviceInfo] = useState<{
    isLowEndDevice: boolean;
    hardwareConcurrency: number;
    memorySize?: number;
    connectionType?: string;
  }>({
    isLowEndDevice: false,
    hardwareConcurrency: navigator.hardwareConcurrency || 1,
  });

  useEffect(() => {
    const hardwareConcurrency = navigator.hardwareConcurrency || 1;
    const memory = (navigator as any).deviceMemory;
    const connection = (navigator as any).connection;

    // Consider device low-end if:
    // - Less than 4 CPU cores
    // - Less than 4GB RAM (if available)
    // - Slow connection (if available)
    const isLowEndDevice = 
      hardwareConcurrency < 4 ||
      (memory && memory < 4) ||
      (connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g'));

    setDeviceInfo({
      isLowEndDevice,
      hardwareConcurrency,
      memorySize: memory,
      connectionType: connection?.effectiveType,
    });

    if (isLowEndDevice && process.env.NODE_ENV === 'development') {
      console.warn('📱 Low-end device detected, consider performance optimizations');
    }
  }, []);

  return deviceInfo;
}
