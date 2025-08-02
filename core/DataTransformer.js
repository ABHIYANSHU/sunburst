const IDataTransformer = require('./interfaces/IDataTransformer');
const DepthLimiter = require('./DepthLimiter');

class KnowledgeGraphTransformer extends IDataTransformer {
  constructor(depthLimiter = new DepthLimiter()) {
    super();
    this.depthLimiter = depthLimiter;
  }

  transform(graphData, options = {}) {
    const { displayDepth = 3 } = options;
    return this.fromKnowledgeGraph(graphData, displayDepth);
  }

  fromKnowledgeGraph(graphData, displayDepth = 3) {
    const nodeMap = this.buildNodeMap(graphData);
    const rootNode = graphData.nodes.find(node => node.name === "" || node.name === "Company");
    const result = nodeMap[rootNode.name];
    
    this.depthLimiter.limitDepth(result, displayDepth);
    return result;
  }

  getDataForFocus(graphData, focusNode = '', options = {}) {
    const { displayDepth = 3 } = options;
    const nodeMap = this.buildNodeMap(graphData);
    
    if (!focusNode || focusNode === '') {
      const rootNode = graphData.nodes.find(node => node.name === "" || node.name === "Company");
      const result = nodeMap[rootNode.name];
      this.depthLimiter.limitDepth(result, displayDepth);
      return result;
    }
    
    const focusNodeData = nodeMap[focusNode];
    if (!focusNodeData) return null;
    
    const result = JSON.parse(JSON.stringify(focusNodeData));
    this.depthLimiter.limitDepth(result, displayDepth);
    return result;
  }

  buildNodeMap(graphData) {
    const nodeMap = {};
    
    graphData.nodes.forEach(node => {
      nodeMap[node.name] = {
        name: node.name,
        children: [],
        value: node.children.length === 0 ? 10 : undefined
      };
    });
    
    graphData.nodes.forEach(node => {
      if (node.children.length > 0) {
        node.children.forEach(childName => {
          if (nodeMap[childName]) {
            nodeMap[node.name].children.push(nodeMap[childName]);
          }
        });
      }
    });
    
    return nodeMap;
  }
}

module.exports = KnowledgeGraphTransformer;