class NavigationManager {
  constructor() {
    this.navigationStack = [];
    this.currentRoot = null;
  }

  initialize(data) {
    this.navigationStack = [data];
    this.currentRoot = data;
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

module.exports = NavigationManager;