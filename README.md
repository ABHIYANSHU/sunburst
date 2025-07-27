# Sunburst Chart

A modular sunburst chart library with interactive drill-down functionality built with D3.js.

## Features

- Interactive drill-down navigation
- Smooth animations and transitions
- Modular architecture following SOLID principles
- Tooltip support
- Responsive design
- Easy integration

## Installation

```bash
npm install sunburst-chart
```

## Usage

```javascript
const SunburstChart = require('sunburst-chart');

const data = {
  name: "Root",
  children: [
    {
      name: "Category A",
      children: [
        { name: "Item 1", value: 25 },
        { name: "Item 2", value: 30 }
      ]
    },
    { name: "Category B", value: 45 }
  ]
};

const chart = new SunburstChart({ width: 600, height: 600 });
const htmlContent = chart.create(data);
```

## API

### Constructor Options

- `width` (number): Chart width in pixels (default: 400)
- `height` (number): Chart height in pixels (default: 400)

### Methods

- `create(data)`: Generates complete HTML with interactive sunburst chart

## Data Format

```javascript
{
  name: "Node Name",
  value: 100,           // For leaf nodes
  children: [...]       // For parent nodes
}
```

## License

MIT