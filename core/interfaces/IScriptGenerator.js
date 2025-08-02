/**
 * Interface for client script generators
 */
class IScriptGenerator {
  generate(data, options) {
    throw new Error('generate method must be implemented');
  }
}

module.exports = IScriptGenerator;