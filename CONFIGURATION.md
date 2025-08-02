# Sunburst Chart Configuration Guide

This guide covers all configuration options available for customizing your sunburst chart.

## Table of Contents

1. [Basic Configuration](#basic-configuration)
2. [Responsive Configuration](#responsive-configuration)
3. [Visual Styling](#visual-styling)
4. [Search Configuration](#search-configuration)
5. [Data Configuration](#data-configuration)
6. [Advanced Customization](#advanced-customization)

## Basic Configuration

### Chart Initialization Options

```javascript
const chart = new SunburstChart({
  width: 800,           // Chart width in pixels
  height: 800,          // Chart height in pixels
  maxDepth: 3,          // Maximum depth to display
  showSearch: true      // Enable/disable search functionality
});
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `width` | number | 800 | Chart width in pixels |
| `height` | number | 800 | Chart height in pixels |
| `maxDepth` | number | 3 | Maximum depth levels to display |
| `showSearch` | boolean | true | Show/hide search input |

### Example Configurations

**Compact Chart**
```javascript
const compactChart = new SunburstChart({
  width: 400,
  height: 400,
  maxDepth: 2,
  showSearch: false
});
```

**Large Interactive Chart**
```javascript
const largeChart = new SunburstChart({
  width: 1200,
  height: 1200,
  maxDepth: 5,
  showSearch: true
});
```

## Responsive Configuration

### Breakpoint Settings

The chart automatically adapts to different screen sizes using these breakpoints:

```javascript
// Default breakpoints (in ResponsiveConfig.js)
breakpoints: {
  mobile: 768,    // ≤ 768px
  tablet: 1024,   // 769-1024px  
  desktop: 1025   // ≥ 1025px
}
```

### Chart Size Constraints

```javascript
// Default size constraints per device
chartSizes: {
  mobile: { min: 300, max: 400 },
  tablet: { min: 400, max: 600 },
  desktop: { min: 500, max: 800 }
}
```

### Custom Responsive Configuration

To customize responsive behavior, modify `ResponsiveConfig.js`:

```javascript
class CustomResponsiveConfig extends ResponsiveConfig {
  constructor() {
    super();
    this.breakpoints = {
      mobile: 600,    // Custom mobile breakpoint
      tablet: 900,    // Custom tablet breakpoint
      desktop: 901
    };
    
    this.chartSizes = {
      mobile: { min: 250, max: 350 },
      tablet: { min: 350, max: 500 },
      desktop: { min: 400, max: 1000 }
    };
  }
}
```

## Visual Styling

### CSS Customization

The chart generates responsive CSS automatically. To customize styles, override these classes:

**Chart Container**
```css
.chart-layout {
  display: flex;
  align-items: flex-start;
  gap: clamp(0px, 2vw, 20px);
  margin: clamp(10px, 3vw, 20px);
  flex-wrap: wrap;
}

.chart-wrapper {
  flex-shrink: 0;
  min-width: 0;
  flex-grow: 1;
}
```

**SVG Styling**
```css
#sunburst-svg {
  width: 90vh;
  height: 90vh;
  max-width: 90vh;
  max-height: 90vh;
}
```

**Tooltip Styling**
```css
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
```

### Color Scheme Customization

To customize colors, modify the color scale in `DataProcessor.js`:

```javascript
// Default D3 color scheme
static createColorScale() {
  return d3.scaleOrdinal(d3.schemeCategory10);
}

// Custom color scheme
static createColorScale() {
  return d3.scaleOrdinal([
    '#FF6B6B', '#4ECDC4', '#45B7D1', 
    '#96CEB4', '#FFEAA7', '#DDA0DD'
  ]);
}
```

## Search Configuration

### Search Styling

```css
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
```

### Search Behavior Configuration

Modify search behavior in `HTMLGenerator.js`:

```javascript
// Default search configuration
const matches = allNodeNames.filter(name => 
  name.toLowerCase().includes(query)
).slice(0, 10);  // Limit to 10 results

// Custom search with fuzzy matching
const matches = allNodeNames.filter(name => {
  const similarity = calculateSimilarity(name.toLowerCase(), query);
  return similarity > 0.6;  // Custom threshold
}).slice(0, 15);  // Custom result limit
```

## Data Configuration

### Hierarchical Data Format

```javascript
const hierarchicalData = {
  name: "Root Node",
  value: 100,           // Optional for leaf nodes
  children: [
    {
      name: "Branch 1",
      children: [
        { name: "Leaf 1.1", value: 25 },
        { name: "Leaf 1.2", value: 30 }
      ]
    },
    {
      name: "Branch 2", 
      value: 45           // Can have value even with children
    }
  ]
};
```

### Knowledge Graph Configuration

```javascript
// Transform knowledge graph data
const chart = new SunburstChart();
const html = chart.createFromKnowledgeGraph(
  graphData,
  3,        // displayDepth
  true      // showSearch
);

// Get focused data
const focusedData = chart.getDataForFocus(
  graphData,
  'NodeName',  // focusNode
  2            // displayDepth
);
```

### Data Validation

Ensure your data follows these rules:

- Each node must have a `name` property
- Leaf nodes should have a `value` property
- Parent nodes can have `children` array
- Avoid circular references
- Node names should be unique within the same level

## Advanced Customization

### Custom Factory Configuration

Create custom components by extending the factory:

```javascript
class CustomChartFactory extends ChartFactory {
  static createDataTransformer() {
    return new CustomDataTransformer();
  }
  
  static createSVGCreator(width, height) {
    return new CustomSVGCreator(width, height);
  }
}

// Use custom factory
const chart = new SunburstChart(options, CustomChartFactory);
```

### Animation Configuration

Modify animation duration in `HTMLGenerator.js`:

```javascript
// Default animation
.transition()
.duration(animate ? 500 : 0)

// Custom animation
.transition()
.duration(animate ? 1000 : 0)  // Slower animation
.ease(d3.easeElastic)          // Custom easing
```

### Interaction Configuration

**Disable Click Navigation**
```javascript
// Remove click handler in HTMLGenerator.js
g.selectAll('path').on('click', null);
```

**Custom Click Behavior**
```javascript
g.selectAll('path').on('click', function(event, d) {
  if (d && d.data.name) {
    // Custom behavior
    console.log('Clicked:', d.data.name);
    customAction(d.data);
  }
});
```

### Performance Configuration

**Large Dataset Optimization**
```javascript
// Limit search results for performance
.slice(0, 5)  // Reduce from default 10

// Debounce search input
let searchTimeout;
searchInput.addEventListener('input', function() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    // Search logic here
  }, 300);  // 300ms debounce
});
```

**Memory Management**
```javascript
// Clear previous chart data
g.selectAll('*').remove();

// Optimize transitions
.transition()
.duration(animate ? 250 : 0)  // Faster transitions
```

## Environment-Specific Configuration

### Development Configuration
```javascript
const devChart = new SunburstChart({
  width: 600,
  height: 600,
  maxDepth: 2,
  showSearch: true
});
```

### Production Configuration
```javascript
const prodChart = new SunburstChart({
  width: 800,
  height: 800,
  maxDepth: 4,
  showSearch: true
});
```

### Mobile-First Configuration
```javascript
const mobileChart = new SunburstChart({
  width: 350,
  height: 350,
  maxDepth: 2,
  showSearch: false  // Disable for mobile
});
```

## Configuration Best Practices

1. **Performance**: Limit `maxDepth` for large datasets
2. **Mobile**: Disable search on small screens
3. **Accessibility**: Ensure sufficient color contrast
4. **Responsive**: Test across different screen sizes
5. **Data**: Validate data structure before rendering
6. **Memory**: Clear previous charts when updating

## Troubleshooting Configuration Issues

**Chart Not Displaying**
- Check data format and structure
- Verify width/height are positive numbers
- Ensure D3.js is loaded

**Search Not Working**
- Verify `showSearch: true` is set
- Check that node names are strings
- Ensure search container has proper CSS

**Responsive Issues**
- Test breakpoint values
- Verify CSS clamp() browser support
- Check viewport meta tag

**Performance Problems**
- Reduce `maxDepth` for large datasets
- Limit search results
- Add debouncing to interactions