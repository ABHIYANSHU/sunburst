const IDepthLimiter = require('./interfaces/IDepthLimiter');

class DepthLimiter extends IDepthLimiter {
  limitDepth(node, maxDepth, currentDepth = 0) {
    if (currentDepth >= maxDepth) {
      if (node.children && node.children.length > 0) {
        node.value = 10;
        node.children = [];
      }
      return;
    }
    
    if (node.children) {
      node.children.forEach(child => {
        this.limitDepth(child, maxDepth, currentDepth + 1);
      });
    }
  }
}

module.exports = DepthLimiter;