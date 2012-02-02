var fsPath = require('path'),
    fs = require('fs');

module.exports = exports = Cli;

//CLI Operations are sync
function Cli(path){
  this.path = path;
}

/**
 * Values that are equal to true
 *
 * @type Array
 * @property YES
 */
Cli.YES = ['true', 'yes', 'y'];


/**
 * Gets a path relative to this.path
 *
 * @argument {String} path
 * @return {String} absolute path
 */
Cli.prototype.getPath = function(path){
  return fsPath.join(this.path, path);
};

/**
 * Checks if path exists relative to this.path
 *
 * @argument {String} path
 * @return {Boolean}
 */
Cli.prototype.pathExists = function(path){
  return !!fsPath.existsSync(this.getPath(path));
};

/**
 * Returns true if value is in Cli.YES
 *
 *
 * @argument {String} value
 * @return {Boolean}
 */
Cli.prototype.convertYN = function(value){
  return (Cli.YES.indexOf(value) !== -1);
};

/**
 * Creates directory if it does not exist relative to this.path
 *
 *
 * @argument {String} path
 */
Cli.prototype.createDir = function(path){
  if(!this.pathExists(path)){
    fs.mkdirSync(this.getPath(path), '0755');
  }
};

/**
 * Copies file's contents from an absolute path
 * into a file via relative path (relative to this.path)
 *
 * Will not override an existing file
 *
 * @argument {String} source absolute path
 * @argument {String} relativeDest relative path
 */
Cli.prototype.copyFile = function(source, relativeDest){
  var contents = fs.readFileSync(source);

  if(!this.pathExists(relativeDest)){
    fs.writeFileSync(this.getPath(relativeDest), contents);
  }

};
