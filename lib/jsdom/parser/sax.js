var sax = require("sax");

module.exports = function(document) {

  var parser = sax.parser();
  var el;

  parser.onerror = function (e) {
  };

  parser.onopentag = function(node) {
    var doc = el.ownerDocument || el;
    var newElement = doc.createElement(node.name.toLowerCase());
    var i;
    var length = (node.attributes && node.attributes.length) || 0;

    for (i=0; i < length; i++) {
      newElement.setAttribute(i, node.attributes.item(i));
    }
    el.appendChild(newElement);
    el = newElement;
  };

  parser.onclosetag = function(node) {
    el = el.parentNode;
  };

  parser.ontext = function(t) {
    var doc = el.ownerDocument || el;
    el.appendChild(doc.createTextNode(t));
  };

  return function(html, element) {
    el = element;
    parser.write(html).close();
    return element;
  };
};
