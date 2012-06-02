var fsPath = require('path'),
    fs = require('fs');

function Projects(paths) {
  this.types = {};

  if (paths instanceof Array) {
    this.pathQueue = paths;
  } else {
    this.pathQueue = [];
  }
}

Projects.prototype = {

  SUFFIX: /\.(js|coffee)$/,

  /**
   * All currently loaded project types
   *
   * @property types
   * @type Array
   */
  types: null,

  /**
   * Queue of paths to load used during .load
   *
   * @property pathQueue
   * @type Function
   */
  pathQueue: null,

  /**
   * Adds a path to the queue
   *
   *
   * @param {String} path
   */
  add: function(path) {
    this.pathQueue.push(path);
  },

  /**
   * Loads each path in the queue and
   * executes callback on completion.
   *
   *
   * @param {Function} callback
   */
  load: function(callback) {
    var pending = this.pathQueue.length, i,
        length = pending;

    if (pending === 0) {
      callback();
    }

    function next(err) {
      pending--;

      if (err) {
        throw new Error(err);
      }

      if (pending === 0) {
        callback();
      }
    }

    for (i = 0; i < length; i++) {
      this.loadTypes(this.pathQueue.shift(), next);
    }
  },

  /**
   * Loads project types from a directory
   *
   * @param {String} path
   * @param {Function} callback
   */
  loadTypes: function(path, callback) {
    var self = this;

    fs.readdir(path, function(err, files) {
      var i, len, project;

      if (err) {
        callback(err, null);
        return;
      }

      for (i = 0, len = files.length; i < len; i++) {
        project = self.loadFile(fsPath.join(path, files[i]));
        if (project) {
          self.types[project.name] = project;
        }
      }

      callback(null);
    });
  },

  /**
   * Loads a single file if it matches .SUFFIX
   *
   * @param {String} fileName absolute path to file.
   * @return {Object|False}
   */
  loadFile: function(fileName) {
    if (fileName.match(this.SUFFIX)) {
      return require(fsPath.resolve(fileName));
    }

    return false;
  }

};

module.exports = exports = Projects;


