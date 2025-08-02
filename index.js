const { JSDOM } = require('jsdom');
const DataProcessor = require('./core/DataProcessor');
const ChartFactory = require('./core/ChartFactory');

class SunburstChart {
  constructor(options = {}, factory = ChartFactory) {
    this.width = options.width || 800;
    this.height = options.height || 800;
    this.radius = Math.min(this.width, this.height) / 2;
    this.maxDepth = options.maxDepth || 3;
    this.showSearch = options.showSearch !== false;
    
    // Use factory to create dependencies
    this.svgCreator = factory.createSVGCreator(this.width, this.height);
    this.pathRenderer = factory.createPathRenderer();
    this.navigationRenderer = factory.createNavigationRenderer();
    this.htmlGenerator = factory.createHTMLGenerator();
    this.dataTransformer = factory.createDataTransformer();
    this.navigationManager = factory.createNavigationManager();
  }

  create(data) {
    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    const document = dom.window.document;
    global.document = document;

    this.navigationManager.initialize(data);
    
    const { svg, g } = this.svgCreator.createSVG(document);
    this.svgCreator.createTooltip(document);
    
    const root = DataProcessor.processHierarchy(data, this.radius);
    const arc = DataProcessor.createArcGenerator();
    const color = DataProcessor.createColorScale();
    
    this.pathRenderer.renderPaths(g, root, arc, color, false);
    
    const clientScript = this.htmlGenerator.generateClientScript(
      data, 
      this.width, 
      this.height, 
      this.radius,
      this.showSearch,
      this.originalFlatData
    );
    
    return this.htmlGenerator.wrapInHTML(document.body.innerHTML, clientScript, this.showSearch);
  }

  createFromKnowledgeGraph(graphData, displayDepth = 3, showSearch = true) {
    this.showSearch = showSearch;
    this.originalFlatData = graphData.nodes;
    const transformedData = this.dataTransformer.transform(graphData, { displayDepth });
    return this.create(transformedData);
  }

  getDataForFocus(graphData, focusNode = '', displayDepth = 3) {
    return this.dataTransformer.getDataForFocus(graphData, focusNode, { displayDepth });
  }
}

module.exports = SunburstChart;