var Qwery = require("./qwery");
exports.applyQuerySelectorPrototype = function(dom) {

  function qwery(doc) {
    if (!doc._qwery) {
      doc._qwery = Qwery(doc);
    }
    return doc._qwery;
  }

  dom.Document.prototype.querySelector = function(selector) {
    return qwery(this)(selector)[0];
  };

  dom.Document.prototype.querySelectorAll = function(selector) {
    var q = qwery(this);
    return new dom.NodeList(this, function() {
      return q(selector);
    });
  };

  dom.Element.prototype.querySelector = function(selector) {
    return qwery(this.ownerDocument)(selector, this)[0];
  };

  dom.Element.prototype.querySelectorAll = function(selector) {
    var self = this,
      q = qwery(this.ownerDocument);
    return new dom.NodeList(this, function() {
      return q(selector, self);
    });
  };
};
