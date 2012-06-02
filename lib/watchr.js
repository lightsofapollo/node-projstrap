module.exports = Watchr;

var watchr = require('fl-watch-tree'),
    EventEmitter = require('events').EventEmitter;

/**
 * Simple abstraction around fl-watch-tree
 *
 * @constructor
 * @class Watchr
 * @param String path.
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

  EventEmitter.call(this);
  this.path = path;
  this.options = options;
}


//Inherit from EventEmitter
Watchr.prototype.__proto__ = EventEmitter.prototype;

/** Types of events
 *
 *
 *
 */
Watchr.prototype.types = {
  deleted: 'deleted',
  modified: 'modified',
  created: 'created'
};

/**
 * Starts the watchr
 *
 */
Watchr.prototype.start = function() {
  this.watchr = watchr.watchTree(this.path, this.options);

  this.watchr.on('fileModified', this._fileChanged.bind(this, this.types.modified));
  this.watchr.on('fileCreated', this._fileChanged.bind(this, this.types.created));
  this.watchr.on('fileDeleted', this._fileChanged.bind(this, this.types.deleted));
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
