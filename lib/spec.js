module.exports = exports = Spec;

function Spec(options) {
  var key;
  for (key in options) {
    if (options.hasOwnProperty(key)) {
      this[key] = options[key];
    }
  }
}
