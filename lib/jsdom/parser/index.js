var adapters = {};

module.exports = function(parser) {
  if (typeof parser == 'function') return parser;
  if (!parser) parser = 'domjs';
  return adapters[parser] || (adapters[parser] = require('./' + parser));
};