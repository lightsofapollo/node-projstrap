
/**

  Example project type creation:

  var nodeProject = new ProjectType({

    name: 'node',

    description: "Node based project, with spec watchr, gitignore and package.json",

    //default template path
    template: __dirname + '/templates/node',

    generator: function(gen){
      gen.file(...);
      //etc more generator stuff
    }

  });

  module.exports = exports = nodeProject;


@constructor
@class ProjectType
@param {Object} config configuration for project type see above example.
*/
function ProjectType(config) {
  var key;
  for (key in config) {
    this[key] = config[key];
  }
}

ProjectType.prototype = {

  /**
   * Name of the project type
   *
   * @property name
   * @type String
   */
  name: null,

  /**
   * Description for project
   *
   * @property description
   * @type String
   */
  description: null,

  /**
   * Directory path for default template
   *
   * @property template
   * @type String
   */
  template: null,

  /**
   * Generator function for project type.
   * Function will be passed a file generator object to use
   *
   *
   *    new ProjectType({
   *      //...
   *      generator: function(gen){
   *        gen.file(...);
   *      }
   *    });
   *
   *
   * @property generator
   * @type Function
   */
  generator: null

};

module.exports = exports = ProjectType;
