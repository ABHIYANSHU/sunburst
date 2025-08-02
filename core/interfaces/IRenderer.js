/**
 * Interface for SVG creation
 */
class ISVGCreator {
  createSVG(document) {
    throw new Error('createSVG method must be implemented');
  }

  createTooltip(document) {
    throw new Error('createTooltip method must be implemented');
  }
}

/**
 * Interface for path rendering
 */
class IPathRenderer {
  renderPaths(container, root, arc, color, animate) {
    throw new Error('renderPaths method must be implemented');
  }
}

/**
 * Interface for navigation UI
 */
class INavigationRenderer {
  renderCenterNavigation(container, navigationManager) {
    throw new Error('renderCenterNavigation method must be implemented');
  }
}

module.exports = { ISVGCreator, IPathRenderer, INavigationRenderer };