/**
 * Interface for depth limiting functionality
 */
class IDepthLimiter {
  limitDepth(node, maxDepth, currentDepth) {
    throw new Error('limitDepth method must be implemented');
  }
}

module.exports = IDepthLimiter;