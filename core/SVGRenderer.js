const d3 = require('d3');

class SVGRenderer {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.radius = Math.min(width, height) / 2;
  }

  createSVG(document) {
    const svg = d3.select(document.body)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('id', 'sunburst-svg');

    const g = svg.append('g')
      .attr('transform', `translate(${this.width / 2},${this.height / 2})`)
      .attr('id', 'sunburst-g');

    return { svg, g };
  }

  createTooltip(document) {
    return d3.select(document.body)
      .append('div')
      .attr('id', 'tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(0,0,0,0.8)')
      .style('color', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', '0')
      .style('transition', 'opacity 0.2s');
  }

  renderPaths(g, root, arc, color, animate = true) {
    const paths = g.selectAll('path')
      .data(root.descendants(), d => d.data.name);

    paths.exit()
      .transition()
      .duration(animate ? 500 : 0)
      .style('opacity', 0)
      .remove();

    const newPaths = paths.enter().append('path')
      .style('opacity', 0)
      .style('cursor', 'pointer')
      .attr('data-name', d => d.data.name);

    const allPaths = newPaths.merge(paths)
      .transition()
      .duration(animate ? 500 : 0)
      .attr('d', arc)
      .style('fill', d => color(d.data.name))
      .style('stroke', '#fff')
      .style('stroke-width', '2px')
      .style('opacity', 1);

    return g.selectAll('path');
  }

  renderCenterNavigation(g, navigationManager) {
    g.selectAll('.center-nav').remove();

    if (navigationManager.canGoBack()) {
      const centerGroup = g.append('g').attr('class', 'center-nav');
      
      const backButton = centerGroup.append('circle')
        .attr('r', 25)
        .style('fill', '#f8f9fa')
        .style('stroke', '#6c757d')
        .style('stroke-width', '2px')
        .style('cursor', 'pointer');

      centerGroup.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .style('pointer-events', 'none')
        .style('fill', '#6c757d')
        .text('←');

      return backButton;
    }

    if (!navigationManager.isAtRoot()) {
      g.append('text')
        .attr('class', 'center-nav')
        .attr('text-anchor', 'middle')
        .attr('dy', '50')
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .style('fill', '#495057')
        .style('pointer-events', 'none')
        .text(navigationManager.getCurrentRoot().name);
    }

    return null;
  }
}

module.exports = SVGRenderer;