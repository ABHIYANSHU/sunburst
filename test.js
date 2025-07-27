const SunburstChart = require('./index.js');

// Sample hierarchical data
const sampleData = {
  name: "root",
  children: [
    {
      name: "A",
      children: [
        { name: "A1", value: 10 },
        { name: "A2", value: 15 }
      ]
    },
    {
      name: "B",
      children: [
        { name: "B1", value: 20 },
        { name: "B2", value: 25 }
      ]
    },
    {
      name: "C",
      value: 30
    }
  ]
};

// Create chart instance
const chart = new SunburstChart({ width: 500, height: 500 });

// Generate SVG
const svgOutput = chart.create(sampleData);

console.log('Sunburst chart SVG generated:');
console.log(svgOutput);
console.log('\nChart created successfully!');