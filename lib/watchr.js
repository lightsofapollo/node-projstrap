module.exports = Watchr;

var watchr = require('fl-watch-tree'),
    EventEmitter = require('events').EventEmitter;

/**
 * Simple abstraction around fl-watch-tree
 *
 * @constructor
 * @class Watchr
 * @param {String} path fs path.
 */
function Watchr(path, options) {
  if (typeof(options) === 'undefined') {
    options = {};
  }

  //Default sample rate
  options.rate = options.rate || options['sample-rate'] || 2;

  if (options.rate) {
    options['sample-rate'] = options.rate;
    delete options.rate;
  }

  this.types = {
    deleted: 'deleted',
    modified: 'modified',
    created: 'created'
  };

  EventEmitter.call(this);
  this.path = path;
  this.options = options;
}


//Inherit from EventEmitter
Watchr.prototype.__proto__ = EventEmitter.prototype;

/**
 * Starts the watchr
 *
 */
Watchr.prototype.start = function() {
  this.watchr = watchr.watchTree(this.path, this.options);

  function bind(type) {
    return this._fileChanged.bind(this, this.types[type]);
  }

  this.watchr.on('fileModified', bind('modified'));
  this.watchr.on('fileCreated', bind('created'));
  this.watchr.on('fileDeleted', bind('deleted'));
};

Watchr.prototype._fileChanged = function(type, path, stats) {

  var options = {
    path: path,
    type: type,
    stats: stats
  };

  this.emit(type, options);
  this.emit('change', options);

};
