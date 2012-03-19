var ProjectType = require('../lib/project-type');

module.exports = exports = new ProjectType({

  name: 'node',

  description: 'node js project that includes everything you need to publish and test a npm package.',
  
  template: __dirname + '/../templates/node/',

  generator: function(generator){

    var author;

    //setup variables
    generator.
      question('package.name', { prompt: 'Name: ' }).
      question('package.tags', { prompt: 'Tags: '}).
      question('package.version', { prompt: 'Version: ', defaultValue: '0.0.1' }).
      question('package.author', { prompt: 'Author: ', defaultValue: author }).
      question('package.description', { prompt: 'Description: '}).
      question('package.main', { prompt: 'Main: ', defaultValue: 'lib/index.js' }).
      question('package.license', { prompt: 'Version: ', defaultValue: 'MIT' }).
      question('github.url', { prompt: 'Github Url: '}).
      mkdir('spec').
      mkdir('lib').
      template('package.json').
      file('spec/helper.js').
      file('.npmignore').
      file('.gitignore').
      file('watchr.js');
  }

});
