var optimist = require('optimist'),
    Projects = require('../projects');

function ListProjects(args){
  var options, paths;

  this.options = options = optimist.
    usage("Usage: node-projstrap " + this.commandName + " [options]").
    argv;

  if(options.help){
    console.log(optimist.help());
  }

  this.projectPaths = this._arrayArg('projectPath', __dirname + '/../../projects/');
}

ListProjects.prototype._arrayArg = function(optionName, firstValue){
  var value = this.options[optionName],
      result = [firstValue];

  if(value){
    if(!(value instanceof Array)){
      value = [value];
    }

    result = result.concat(value);
  }

  return result;
};

ListProjects.prototype.commandName = 'list-projects';

ListProjects.prototype._loadProjects = function(callback){
  this.projects = new Projects(this.projectPaths);
  this.projects.load(callback);
};

ListProjects.prototype.run = function(){
  var self = this;

  this._loadProjects(function(){
    var key;

    console.log('Available project types:\n');

    for(key in self.projects.types){
      console.log('    %s : %s', key, self.projects.types[key].description);
    }
  });
};

module.exports = exports = ListProjects;

