var path = require('path'),
    Spec = require('./spec');

module.exports = exports = Suite;


Suite.defaults = {
  specDir: 'spec/',
  libDir: 'lib/',
  specSuffix: '-spec.js',
  libSuffix: '.js'
};

Suite._pathJoins = [
  'path',
  'libDir',
  'specDir'
];

Suite._joinPath = function(key){
  this[key] = path.join(this[key], '/');
};

function Suite(options){
  var option;

  for(option in options){
    if(options.hasOwnProperty(option)){
      this[option] = options[option];
    }
  }

  for(option in Suite.defaults){
    if(Suite.defaults.hasOwnProperty(option)){
      if(typeof(this[option]) === 'undefined'){
        this[option] = Suite.defaults[option];
      }
    }
  }

  Suite._pathJoins.forEach(
    Suite._joinPath, this
  );

  this._definePatterns();

};

Suite.prototype = {

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

  specFromPath: function(path){
    var results = {};
    path = this.relativePath(path);

    results.isSpec = !!this.patterns.specDir(path);
    results.isLib = !!this.patterns.libDir(path);

    results.specPath = this.swapPaths(path, 'spec');
    results.libPath = this.swapPaths(path, 'lib');

    return new Spec(results);
  }

}

