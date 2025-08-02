class ResponsiveConfig {
  constructor() {
    this.breakpoints = {
      mobile: 768,
      tablet: 1024,
      desktop: 1025
    };
    
    this.chartSizes = {
      mobile: { min: 300, max: 400 },
      tablet: { min: 400, max: 600 },
      desktop: { min: 500, max: 800 }
    };
    
    this.searchWidths = {
      mobile: '100%',
      tablet: '250px',
      desktop: '300px'
    };
  }

  getBreakpoint(width) {
    if (width <= this.breakpoints.mobile) return 'mobile';
    if (width <= this.breakpoints.tablet) return 'tablet';
    return 'desktop';
  }

  getChartSize(containerWidth) {
    const breakpoint = this.getBreakpoint(containerWidth || window.innerWidth);
    const config = this.chartSizes[breakpoint];
    
    let size = Math.min(containerWidth - (breakpoint === 'mobile' ? 20 : 60), config.max);
    return Math.max(size, config.min);
  }

  getSearchWidth(screenWidth) {
    const breakpoint = this.getBreakpoint(screenWidth);
    return this.searchWidths[breakpoint];
  }

  isMobile(width = window.innerWidth) {
    return width <= this.breakpoints.mobile;
  }

  isTablet(width = window.innerWidth) {
    return width > this.breakpoints.mobile && width <= this.breakpoints.tablet;
  }

  isDesktop(width = window.innerWidth) {
    return width > this.breakpoints.tablet;
  }
}

module.exports = ResponsiveConfig;