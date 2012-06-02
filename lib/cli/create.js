var optimist = require('optimist'),
    fsPath = require('path'),
    ListProjects = require('./list-projects'),
    Generator = require('file-generator');


function Create(args) {
  optimist.
      usage('Usage: node-projstrap ' + this.commandName + ' [options] <path>').
      option('type', {
        alias: 't',
        desc: 'Project type. Run list-project to see all available types'
      });

  this.targetPath = args.pop();

  if (!this.targetPath || this.targetPath == '--help') {
    console.log('You must pass path see help: \n');
    console.log(optimist.help());

    process.exit(0);
  }

  if (!fsPath.existsSync(this.targetPath)) {
    console.log('"%s" does not exist cannot create', this.targetPath);
    process.exit(0);
  }

  ListProjects.apply(this, arguments);

  this.project = this.options.type || 'node';

}

Create.prototype.__proto__ = ListProjects.prototype;
Create.prototype.commandName = 'create';

Create.prototype.run = function() {
  var self = this,
      generator,
      project;

  this._loadProjects(function() {
    if (self.project in self.projects.types) {
      project = self.projects.types[self.project];
      console.log(project.template);
      generator = new Generator({
        templatePaths: [project.template],
        target: self.targetPath
      });

      generator.log(self.targetPath, 'project', 'creating');
      project.generator(generator);

      generator.run(function(err) {
        if (err) {
          console.log(err);
          throw new Error(err);
        }
        generator.log(self.targetPath, 'project', 'complete');
        // process.stdin.destroy();
      });

    } else {
      console.log(
        "'%s' is not a valid project. run 'list-projects' ",
        self.project
      );
    }
  });
};

module.exports = exports = Create;
