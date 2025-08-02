const KnowledgeGraphTransformer = require('./DataTransformer');
const { SVGCreator, PathRenderer, NavigationRenderer } = require('./SVGRenderer');
const HTMLGenerator = require('./HTMLGenerator');
const ClientScriptGenerator = require('./ClientScriptGenerator');
const NavigationManager = require('./NavigationManager');
const DepthLimiter = require('./DepthLimiter');

/**
 * Factory for creating chart components following DIP
 */
class ChartFactory {
  static createDataTransformer() {
    const depthLimiter = new DepthLimiter();
    return new KnowledgeGraphTransformer(depthLimiter);
  }

  static createSVGCreator(width, height) {
    return new SVGCreator(width, height);
  }

  static createPathRenderer() {
    return new PathRenderer();
  }

  static createNavigationRenderer() {
    return new NavigationRenderer();
  }

  static createHTMLGenerator() {
    const scriptGenerator = new ClientScriptGenerator();
    return new HTMLGenerator(scriptGenerator);
  }

  static createNavigationManager() {
    return new NavigationManager();
  }
}

module.exports = ChartFactory;