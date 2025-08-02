/**
 * Interface for HTML generation
 */
class IHTMLGenerator {
  wrapInHTML(bodyContent, script, showSearch) {
    throw new Error('wrapInHTML method must be implemented');
  }
}

module.exports = IHTMLGenerator;