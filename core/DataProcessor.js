const d3 = require('d3');

class DataProcessor {
  static processHierarchy(data, radius) {
    const partition = d3.partition().size([2 * Math.PI, radius]);
    const root = d3.hierarchy(data).sum(d => d.value || 0);
    return partition(root);
  }

  static createArcGenerator() {
    return d3.arc()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .innerRadius(d => d.y0)
      .outerRadius(d => d.y1);
  }

  static createColorScale() {
    return d3.scaleOrdinal(d3.schemeCategory10);
  }
}

module.exports = DataProcessor;