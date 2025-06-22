// Performance monitoring script
if (typeof window !== 'undefined') {
  // Track page load performance
  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    
    const metrics = {
      // Navigation timing
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      totalLoadTime: navigation.loadEventEnd - navigation.fetchStart,
      
      // Paint timing
      firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
      
      // Resource timing
      resourceCount: performance.getEntriesByType('resource').length,
      
      // Memory usage (if available)
      memoryUsage: performance.memory ? {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
      } : null
    };
    
    // Log performance metrics
    console.log('Performance Metrics:', metrics);
    
    // Send to analytics if needed
    if (window.gtag) {
      window.gtag('event', 'performance_metrics', {
        event_category: 'performance',
        event_label: window.location.pathname,
        value: Math.round(metrics.totalLoadTime),
        custom_parameters: {
          dom_content_loaded: Math.round(metrics.domContentLoaded),
          first_paint: Math.round(metrics.firstPaint),
          first_contentful_paint: Math.round(metrics.firstContentfulPaint),
          resource_count: metrics.resourceCount
        }
      });
    }
    
    // Alert if performance is poor
    if (metrics.totalLoadTime > 2000) {
      console.warn('⚠️ Page load time is slow:', Math.round(metrics.totalLoadTime), 'ms');
    } else if (metrics.totalLoadTime < 400) {
      console.log('✅ Page load time is excellent:', Math.round(metrics.totalLoadTime), 'ms');
    }
  });
  
  // Track Core Web Vitals
  if ('PerformanceObserver' in window) {
    // Largest Contentful Paint (LCP)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime, 'ms');
      
      if (lastEntry.startTime > 2500) {
        console.warn('⚠️ LCP is slow:', Math.round(lastEntry.startTime), 'ms');
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });
    
    // First Input Delay (FID)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        console.log('FID:', entry.processingStart - entry.startTime, 'ms');
        
        if (entry.processingStart - entry.startTime > 100) {
          console.warn('⚠️ FID is slow:', Math.round(entry.processingStart - entry.startTime), 'ms');
        }
      });
    }).observe({ entryTypes: ['first-input'] });
    
    // Cumulative Layout Shift (CLS)
    new PerformanceObserver((list) => {
      let clsValue = 0;
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      console.log('CLS:', clsValue);
      
      if (clsValue > 0.1) {
        console.warn('⚠️ CLS is poor:', clsValue);
      }
    }).observe({ entryTypes: ['layout-shift'] });
  }
} 