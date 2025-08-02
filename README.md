# Sunburst Chart v1.1.0

A modular, responsive sunburst chart library with drill-down functionality built with D3.js and Node.js.

## Features

- **Interactive Drill-Down**: Click segments to navigate deeper into hierarchical data
- **Responsive Design**: Automatically adapts to different screen sizes (mobile, tablet, desktop)
- **Search Functionality**: Built-in search to quickly find and highlight specific nodes
- **Customizable**: Configurable dimensions, depth limits, and styling
- **Modular Architecture**: Clean separation of concerns with factory pattern
- **Knowledge Graph Support**: Transform knowledge graph data into hierarchical format

## Installation

```bash
npm install sunburst-chart
```

## Quick Start

```javascript
const SunburstChart = require('sunburst-chart');

// Sample hierarchical data
const data = {
  name: "root",
  children: [
    {
      name: "Category A",
      children: [
        { name: "Item A1", value: 10 },
        { name: "Item A2", value: 15 }
      ]
    },
    {
      name: "Category B", 
      children: [
        { name: "Item B1", value: 20 },
        { name: "Item B2", value: 25 }
      ]
    }
  ]
};

// Create chart
const chart = new SunburstChart({
  width: 600,
  height: 600,
  maxDepth: 3,
  showSearch: true
});

// Generate HTML with embedded SVG
const htmlOutput = chart.create(data);
console.log(htmlOutput);
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `width` | number | 800 | Chart width in pixels |
| `height` | number | 800 | Chart height in pixels |
| `maxDepth` | number | 3 | Maximum depth to display |
| `showSearch` | boolean | true | Enable/disable search functionality |

## Data Format

### Hierarchical Data
```javascript
{
  name: "Node Name",
  value: 100,           // Optional: leaf node value
  children: [           // Optional: child nodes
    {
      name: "Child 1",
      value: 50
    },
    {
      name: "Child 2", 
      children: [...]
    }
  ]
}
```

### Knowledge Graph Data
```javascript
const graphData = [
  { source: "A", target: "B", relationship: "contains" },
  { source: "B", target: "C", relationship: "includes" }
];

const chart = new SunburstChart();
const html = chart.createFromKnowledgeGraph(graphData, 3, true);
```

## API Reference

### SunburstChart Class

#### Constructor
```javascript
new SunburstChart(options, factory)
```

#### Methods

**create(data)**
- Generates HTML with sunburst chart from hierarchical data
- Returns: HTML string with embedded SVG and scripts

**createFromKnowledgeGraph(graphData, displayDepth, showSearch)**
- Creates chart from knowledge graph data
- `graphData`: Array of source-target relationships
- `displayDepth`: Maximum depth to display (default: 3)
- `showSearch`: Enable search functionality (default: true)

**getDataForFocus(graphData, focusNode, displayDepth)**
- Gets transformed data focused on specific node
- `focusNode`: Node to focus on (empty string for root)

## Responsive Breakpoints

| Device | Breakpoint | Chart Size |
|--------|------------|------------|
| Mobile | ≤ 768px | 300-400px |
| Tablet | 769-1024px | 400-600px |
| Desktop | ≥ 1025px | 500-800px |

## Browser Support

- Modern browsers with ES6+ support
- D3.js v7.0.0 compatible
- Responsive CSS with clamp() function support

## Development

```bash
# Clone repository
git clone https://github.com/abhinavsriva26/sunburst.git
cd sunburst

# Install dependencies
npm install

# Run test
node test.js
```

## Project Structure

```
sunburst/
├── core/
│   ├── interfaces/          # Interface definitions
│   ├── ChartFactory.js      # Component factory
│   ├── DataProcessor.js     # Data processing utilities
│   ├── DataTransformer.js   # Knowledge graph transformer
│   ├── HTMLGenerator.js     # HTML output generation
│   ├── ResponsiveConfig.js  # Responsive configuration
│   ├── ResponsiveCSSManager.js # CSS management
│   └── SVGRenderer.js       # SVG rendering
├── index.js                 # Main entry point
├── test.js                  # Example usage
└── package.json
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Changelog

### v1.1.0
- Enhanced modular architecture with improved factory pattern
- Better separation of concerns across core components
- Improved responsive design with optimized CSS management
- Enhanced data processing capabilities
- Better error handling and validation
- Performance optimizations for large datasets

### v1.0.0
- Initial release with basic sunburst chart functionality
- Interactive drill-down navigation
- Knowledge graph data support
- Responsive design implementation

## License

MIT License - see LICENSE file for details

## Dependencies

- **d3**: ^7.0.0 - Data visualization library
- **jsdom**: ^22.0.0 - DOM implementation for Node.js

## Issues

Report issues at: https://github.com/abhinavsriva26/sunburst/issues