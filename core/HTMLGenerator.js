class HTMLGenerator {
  static generateClientScript(originalData, width, height, radius) {
    return `
      const originalData = ${JSON.stringify(originalData)};
      const width = ${width};
      const height = ${height};
      const radius = ${radius};
      
      class ClientNavigationManager {
        constructor() {
          this.navigationStack = [originalData];
          this.currentRoot = originalData;
        }
        
        drillDown(data) {
          this.navigationStack.push(data);
          this.currentRoot = data;
        }
        
        goBack() {
          if (this.navigationStack.length > 1) {
            this.navigationStack.pop();
            this.currentRoot = this.navigationStack[this.navigationStack.length - 1];
            return true;
          }
          return false;
        }
        
        canGoBack() {
          return this.navigationStack.length > 1;
        }
        
        getCurrentRoot() {
          return this.currentRoot;
        }
        
        isAtRoot() {
          return this.navigationStack.length === 1;
        }
      }
      
      const navManager = new ClientNavigationManager();
      
      function createChart(data, animate = true) {
        const svg = d3.select('#sunburst-svg');
        const g = d3.select('#sunburst-g');
        
        const partition = d3.partition().size([2 * Math.PI, radius]);
        const root = d3.hierarchy(data).sum(d => d.value || 0);
        partition(root);
        
        const arc = d3.arc()
          .startAngle(d => d.x0)
          .endAngle(d => d.x1)
          .innerRadius(d => d.y0)
          .outerRadius(d => d.y1);
        
        const color = d3.scaleOrdinal(d3.schemeCategory10);
        
        const paths = g.selectAll('path')
          .data(root.descendants(), d => d ? d.data.name : '');
        
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
        
        setTimeout(() => {
          const tooltip = document.getElementById('tooltip');
          g.selectAll('path').nodes().forEach(path => {
            path.addEventListener('mouseover', (e) => {
              tooltip.textContent = e.target.getAttribute('data-name');
              tooltip.style.opacity = '1';
            });
            
            path.addEventListener('mousemove', (e) => {
              tooltip.style.left = e.pageX + 10 + 'px';
              tooltip.style.top = e.pageY - 10 + 'px';
            });
            
            path.addEventListener('mouseout', () => {
              tooltip.style.opacity = '0';
            });
          });
          
          g.selectAll('path').on('click', function(event, d) {
            if (d && d.children && d.children.length > 0) {
              navManager.drillDown(d.data);
              createChart(d.data, true);
            }
          });
        }, animate ? 500 : 0);
        
        updateCenterNavigation();
      }
      
      function updateCenterNavigation() {
        const g = d3.select('#sunburst-g');
        g.selectAll('.center-nav').remove();
        
        if (navManager.canGoBack()) {
          const centerGroup = g.append('g').attr('class', 'center-nav');
          
          centerGroup.append('circle')
            .attr('r', 25)
            .style('fill', '#f8f9fa')
            .style('stroke', '#6c757d')
            .style('stroke-width', '2px')
            .style('cursor', 'pointer')
            .on('click', () => {
              if (navManager.goBack()) {
                createChart(navManager.getCurrentRoot(), true);
              }
            });
          
          centerGroup.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em')
            .style('font-size', '16px')
            .style('font-weight', 'bold')
            .style('pointer-events', 'none')
            .style('fill', '#6c757d')
            .text('←');
        }
        
        if (!navManager.isAtRoot()) {
          g.append('text')
            .attr('class', 'center-nav')
            .attr('text-anchor', 'middle')
            .attr('dy', '50')
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .style('fill', '#495057')
            .style('pointer-events', 'none')
            .text(navManager.getCurrentRoot().name);
        }
      }
      
      createChart(originalData, false);
    `;
  }

  static wrapInHTML(bodyContent, script) {
    return `<!DOCTYPE html><html><head><script src="https://d3js.org/d3.v7.min.js"></script></head><body>${bodyContent}<script>${script}</script></body></html>`;
  }
}

module.exports = HTMLGenerator;