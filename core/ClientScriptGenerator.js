const IScriptGenerator = require('./interfaces/IScriptGenerator');

class ClientScriptGenerator extends IScriptGenerator {
  generate(originalData, options) {
    const { width, height, radius, showSearch = true, flatData = [] } = options;
    
    return `
      const originalData = ${JSON.stringify(originalData)};
      const flatData = ${JSON.stringify(flatData)};
      const width = ${width};
      const height = ${height};
      const radius = ${radius};
      
      function updateDescriptionPane(nodeName, nodeDescription) {
        const descPane = document.querySelector('.description-pane');
        if (!descPane) return;
        const title = descPane.querySelector('h3');
        const content = descPane.querySelector('p');
        
        title.textContent = nodeName || 'Node Information';
        if (nodeDescription && nodeDescription.trim()) {
          content.textContent = nodeDescription;
          content.className = '';
        } else {
          content.textContent = 'No description available for this node.';
          content.className = 'no-selection';
        }
      }
      
      function findNodeByName(targetName) {
        return flatData.find(node => node.name === targetName);
      }
      
      function extractAllNodeNames(data) {
        const names = new Set();
        function traverse(node) {
          if (node.name && node.name.trim()) names.add(node.name);
          if (node.children) {
            node.children.forEach(child => traverse(child));
          }
        }
        traverse(data);
        return Array.from(names).sort();
      }
      
      const allNodeNames = extractAllNodeNames(originalData);
      
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
      const displayDepth = new URLSearchParams(window.location.search).get('displayDepth') || '3';
      
      async function loadDataForFocus(focusNode) {
        try {
          const response = await fetch('/api/data?focus=' + encodeURIComponent(focusNode) + '&displayDepth=' + displayDepth);
          const data = await response.json();
          if (data) {
            navManager.drillDown(data);
            const nodeData = findNodeByName(focusNode);
            updateDescriptionPane(focusNode, nodeData ? nodeData.description : '');
            createChart(data, true);
          }
        } catch (error) {
          console.error('Error loading data:', error);
        }
      }
      
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
            if (d && d.data.name) {
              loadDataForFocus(d.data.name);
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
            .style('fill', 'white')
            .style('stroke', '#6c757d')
            .style('stroke-width', '2px')
            .style('cursor', 'pointer')
            .on('click', () => {
              if (navManager.goBack()) {
                const currentRoot = navManager.getCurrentRoot();
                const nodeData = findNodeByName(currentRoot.name);
                updateDescriptionPane(currentRoot.name, nodeData ? nodeData.description : '');
                createChart(currentRoot, true);
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
      
      function initializeSearch() {
        const searchInput = document.getElementById('search-input');
        const searchResults = document.getElementById('search-results');
        
        searchInput.addEventListener('input', function() {
          const query = this.value.toLowerCase().trim();
          searchResults.innerHTML = '';
          
          if (query.length === 0) {
            searchResults.style.display = 'none';
            navManager.navigationStack = [originalData];
            navManager.currentRoot = originalData;
            updateDescriptionPane('Node Information', 'Click on a node to view its description');
            createChart(originalData, true);
            return;
          }
          
          if (query.length < 2) {
            searchResults.style.display = 'none';
            return;
          }
          
          const matches = allNodeNames.filter(name => 
            name.toLowerCase().includes(query)
          ).slice(0, 10);
          
          if (matches.length > 0) {
            matches.forEach(name => {
              const div = document.createElement('div');
              div.className = 'search-result-item';
              div.textContent = name;
              div.addEventListener('click', () => {
                searchInput.value = name;
                searchResults.style.display = 'none';
                loadDataForFocus(name);
              });
              searchResults.appendChild(div);
            });
            searchResults.style.display = 'block';
          } else {
            searchResults.style.display = 'none';
          }
        });
        
        document.addEventListener('click', function(e) {
          if (!e.target.closest('.search-container')) {
            searchResults.style.display = 'none';
          }
        });
      }
      
      createChart(originalData, false);
      updateDescriptionPane('Node Information', 'Click on a node to view its description');
      if (${showSearch}) {
        initializeSearch();
      }
    `;
  }
}

module.exports = ClientScriptGenerator;