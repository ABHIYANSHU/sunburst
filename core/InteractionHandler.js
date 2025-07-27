class InteractionHandler {
  constructor(navigationManager, onUpdate) {
    this.navigationManager = navigationManager;
    this.onUpdate = onUpdate;
  }

  attachTooltipEvents(paths) {
    const tooltip = document.getElementById('tooltip');
    paths.nodes().forEach(path => {
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
  }

  attachClickEvents(paths) {
    paths.on('click', (event, d) => {
      if (d.children && d.children.length > 0) {
        this.navigationManager.drillDown(d.data);
        this.onUpdate(d.data, true);
      }
    });
  }

  attachBackButtonEvent(element) {
    element.on('click', () => {
      if (this.navigationManager.goBack()) {
        this.onUpdate(this.navigationManager.getCurrentRoot(), true);
      }
    });
  }
}

module.exports = InteractionHandler;