/**
 * Interface for data transformers
 */
class IDataTransformer {
  transform(data, options) {
    throw new Error('transform method must be implemented');
  }

  getDataForFocus(data, focusNode, options) {
    throw new Error('getDataForFocus method must be implemented');
  }
}

module.exports = IDataTransformer;