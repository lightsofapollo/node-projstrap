var path = require('path');

Bootstrap.Watchr = require('./watchr');
module.exports = exports = Bootstrap;


Bootstrap.defaults = {
  specDir: 'spec/',
  libDir: 'lib/',
  specSuffix: '-spec.js',
  libSuffix: '.js'
};

Bootstrap._pathJoins = [
  'path',
  'libDir',
  'specDir'
];

Bootstrap._joinPath = function(key){
  this[key] = path.join(this[key], '/');
};

function Bootstrap(options){
  var option;

  for(option in options){
    if(options.hasOwnProperty(option)){
      this[option] = options[option];
    }
  }

  for(option in Bootstrap.defaults){
    if(Bootstrap.defaults.hasOwnProperty(option)){
      if(typeof(this[option]) === 'undefined'){
        this[option] = Bootstrap.defaults[option];
      }
    }
  }

  Bootstrap._pathJoins.forEach(
    Bootstrap._joinPath, this
  );

  this._definePatterns();

};

Bootstrap.prototype = {

  _definePatterns: function(){
    var ptns = this.patterns = {};

    ptns.specSuffix = new RegExp(
      this.specSuffix + '$'
    );

    ptns.libSuffix = new RegExp(
      this.libSuffix + '$'
    );

    ptns.specDir = new RegExp(
      '^' + this.specDir
    );

    ptns.libDir = new RegExp(
      '^' + this.libDir
    );
  },

  relativePath: function(path){
    return path.replace(this.path, '');
  },

  swapPaths: function(path, type){
    var other = (type == 'lib')? 'spec' : 'lib';

    if(this.patterns[type + 'Dir'].test(path)){
      return path;
    }

    return path.
           replace(this.patterns[other + 'Dir'], this[type + 'Dir']).
           replace(this.patterns[other + 'Suffix'], this[type + 'Suffix']);
  },

  pathDetails: function(path){
    var results = {};
    path = this.relativePath(path);

    results.isSpec = !!this.patterns.specDir(path);
    results.isLib = !results.isSpec;

    results.specPath = this.swapPaths(path, 'spec');
    results.libPath = this.swapPaths(path, 'lib');

    return results;
  }

}
