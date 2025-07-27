const { JSDOM } = require('jsdom');
const DataProcessor = require('./core/DataProcessor');
const NavigationManager = require('./core/NavigationManager');
const SVGRenderer = require('./core/SVGRenderer');
const HTMLGenerator = require('./core/HTMLGenerator');

class SunburstChart {
  constructor(options = {}) {
    this.width = options.width || 400;
    this.height = options.height || 400;
    this.radius = Math.min(this.width, this.height) / 2;
    
    this.renderer = new SVGRenderer(this.width, this.height);
    this.navigationManager = new NavigationManager();
  }

  create(data) {
    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    const document = dom.window.document;
    global.document = document;

    this.navigationManager.initialize(data);
    
    const { svg, g } = this.renderer.createSVG(document);
    this.renderer.createTooltip(document);
    
    const root = DataProcessor.processHierarchy(data, this.radius);
    const arc = DataProcessor.createArcGenerator();
    const color = DataProcessor.createColorScale();
    
    this.renderer.renderPaths(g, root, arc, color, false);
    
    const clientScript = HTMLGenerator.generateClientScript(
      data, 
      this.width, 
      this.height, 
      this.radius
    );
    
    return HTMLGenerator.wrapInHTML(document.body.innerHTML, clientScript);
  }
}

module.exports = SunburstChart;