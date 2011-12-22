var HTMLDecode = require('../utils/htmlencoding').HTMLDecode;
var htmlparser = require('htmlparser');

function createNode(token, doc) {
  if (token.type == 'tag' || token.type ==  'script' || token.type == 'style') {
    try {
      node = doc.createElement(token.name);
      if (token.location) {
        node.sourceLocation = token.location;
        node.sourceLocation.file = parent.sourceLocation.file;
      }
      return node;
    }
    catch (err) {
      currentDocument.raise('error', 'invalid markup', {
        exception: err,
        node : token
      });
      return null;
    }
  }
  if (token.type == 'text') {
    return doc.createTextNode(HTMLDecode(token.data));
  }
  if (token.type == 'comment') {
    return doc.createComment(token.data);
  }
  return null;
}

function setChild(parent, token) {
  var node = createNode(token, parent._ownerDocument || parent)
  if (!node) return null;

  if (token.attribs) {
    for (var c in token.attribs) {
      // catchin errors here helps with improperly escaped attributes
      // but properly fixing parent should (can only?) be done in the htmlparser itself
      try {
        node.setAttribute(c.toLowerCase(), HTMLDecode(token.attribs[c]));
      } 
      catch(e) {
         /* noop */
      }
    }
  }

  if (token.children) {
    for (var i=0; i < token.children.length; i++) {
      setChild(node, token.children[i]);
    }
  }
  parent.appendChild(node);
}

module.exports = function(document) {
  var handler = new htmlparser.DefaultHandler();
  var parser = new htmlparser.Parser(handler);

  return function(html, element) {

    if (typeof html != 'string') html += '';

    parser.parseComplete(html);
    var tokens = handler.dom;
    for (var i = 0; i < tokens.length; i++) {
      setChild(element, tokens[i]);
    }
    return element;
  };
};
