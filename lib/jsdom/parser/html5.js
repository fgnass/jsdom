var html5 = require('html5');

module.exports = function(document) {
  var parser = new html5.Parser({document: document});

  return function(html, element) {
    if (typeof html !== 'string') html += '';
    if (html.length > 0) {
      if (element.nodeType == 9) {
        parser.parse(html);
      }
      else {
        parser.parse_fragment(html, element);
      }
    }
  };

};

