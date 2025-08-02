const ResponsiveConfig = require('./ResponsiveConfig');

class ResponsiveCSSManager {
  constructor() {
    this.config = new ResponsiveConfig();
    this.breakpoints = {
      mobile: `(max-width: ${this.config.breakpoints.mobile}px)`,
      tablet: `(max-width: ${this.config.breakpoints.tablet}px)`,
      desktop: `(min-width: ${this.config.breakpoints.desktop}px)`
    };
  }

  getBaseStyles() {
    return `
      * {
        box-sizing: border-box;
      }
      
      .chart-layout {
        display: flex;
        align-items: flex-start;
        gap: clamp(0px, 2vw, 20px);
        margin: clamp(10px, 3vw, 20px);
        flex-wrap: wrap;
      }
      
      .main-content {
        display: flex;
        gap: 20px;
        flex: 1;
        min-width: 0;
      }
      
      .description-pane {
        width: 300px;
        min-width: 250px;
        max-width: 400px;
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        padding: 20px;
        height: fit-content;
        max-height: 80vh;
        overflow-y: auto;
      }
      
      .description-pane h3 {
        margin: 0 0 15px 0;
        color: #495057;
        font-size: 18px;
        border-bottom: 2px solid #007bff;
        padding-bottom: 8px;
      }
      
      .description-pane p {
        margin: 0;
        color: #6c757d;
        line-height: 1.5;
        font-size: 14px;
      }
      
      .description-pane .no-selection {
        font-style: italic;
        color: #adb5bd;
      }
      
      .chart-wrapper {
        flex-shrink: 0;
        min-width: 0;
        flex-grow: 1;
      }
      
      #sunburst-chart {
        width: 100%;
        height: auto;
        display: block;
      }
      
      #sunburst-svg {
        width: 90vh;
        height: 90vh;
        max-width: 90vh;
        max-height: 90vh;
      }
      
      @media (max-width: 768px) {
        #sunburst-svg {
          width: 90vw;
          height: 90vw;
          max-width: 90vw;
          max-height: 90vw;
        }
      }
    `;
  }

  getSearchStyles() {
    return `
      .search-container {
        position: relative;
        width: clamp(200px, 25vw, 300px);
        min-width: 200px;
      }
      
      #search-input {
        width: 100%;
        padding: clamp(8px, 1.5vw, 12px);
        border: 2px solid #ddd;
        border-radius: 8px;
        font-size: clamp(12px, 2vw, 14px);
        outline: none;
        transition: border-color 0.3s;
      }
      
      #search-input:focus {
        border-color: #007bff;
      }
      
      #search-results {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #ddd;
        border-top: none;
        border-radius: 0 0 8px 8px;
        max-height: clamp(150px, 30vh, 250px);
        overflow-y: auto;
        z-index: 1000;
        display: none;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      
      .search-result-item {
        padding: clamp(8px, 1.5vw, 12px);
        cursor: pointer;
        border-bottom: 1px solid #eee;
        transition: background-color 0.2s;
        font-size: clamp(12px, 1.8vw, 14px);
      }
      
      .search-result-item:hover {
        background-color: #f8f9fa;
      }
      
      .search-result-item:last-child {
        border-bottom: none;
      }
    `;
  }

  getResponsiveStyles() {
    return `
      @media ${this.breakpoints.mobile} {
        .chart-layout {
          flex-direction: column;
          gap: 15px;
          margin: 10px;
        }
        
        .main-content {
          flex-direction: column;
        }
        
        .search-container {
          width: 100%;
          max-width: none;
        }
        
        .chart-wrapper {
          width: 100%;
          overflow-x: auto;
        }
        
        .description-pane {
          width: 100%;
          max-width: none;
          order: 2;
        }
      }
      
      @media ${this.breakpoints.tablet} {
        .chart-layout {
          gap: 15px;
        }
      }
      
      @media ${this.breakpoints.desktop} {
        .chart-layout {
          gap: 20px;
        }
      }
    `;
  }

  getTooltipStyles() {
    return `
      #tooltip {
        position: absolute;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: clamp(6px, 1vw, 10px);
        border-radius: 4px;
        font-size: clamp(11px, 1.5vw, 13px);
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s;
        z-index: 1001;
        max-width: 200px;
        word-wrap: break-word;
      }
      
      .center-nav circle {
        fill: white !important;
      }
    `;
  }

  generateCSS(includeSearch = true) {
    let css = this.getBaseStyles();
    
    if (includeSearch) {
      css += this.getSearchStyles();
    }
    
    css += this.getResponsiveStyles();
    css += this.getTooltipStyles();
    
    return css;
  }

  getChartDimensions() {
    return `
      const responsiveConfig = {
        breakpoints: ${JSON.stringify(this.config.breakpoints)},
        chartSizes: ${JSON.stringify(this.config.chartSizes)}
      };
      
      function getResponsiveChartSize() {
        const container = document.querySelector('.chart-wrapper');
        const containerWidth = container ? container.clientWidth : window.innerWidth;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        let breakpoint = 'desktop';
        if (screenWidth <= responsiveConfig.breakpoints.mobile) breakpoint = 'mobile';
        else if (screenWidth <= responsiveConfig.breakpoints.tablet) breakpoint = 'tablet';
        
        const config = responsiveConfig.chartSizes[breakpoint];
        const padding = breakpoint === 'mobile' ? 20 : 40;
        
        let size;
        if (breakpoint === 'desktop') {
          // For desktop, use 60% of viewport height with max constraint
          size = Math.min(screenHeight * 0.6, Math.max(screenHeight * 0.6, 500));
        } else {
          size = Math.min(containerWidth - padding, config.max);
        }
        
        return Math.max(size, config.min);
      }
    `;
  }

  getResizeHandler() {
    return `
      function updateChartSize() {
        const newSize = getResponsiveChartSize();
        const svg = d3.select('#sunburst-svg');
        svg.attr('width', newSize).attr('height', newSize);
        
        const g = d3.select('#sunburst-g');
        g.attr('transform', \`translate(\${newSize/2}, \${newSize/2})\`);
        
        return newSize;
      }
      
      // Apply responsive size immediately on load
      document.addEventListener('DOMContentLoaded', () => {
        updateChartSize();
      });
      
      let resizeTimeout;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          updateChartSize();
          createChart(navManager.getCurrentRoot(), false);
        }, 250);
      });
    `;
  }
}

module.exports = ResponsiveCSSManager;