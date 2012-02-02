var Projstrap = require('projstrap'),

    exec = require('child_process').exec,

    //Command to run tests (change this to whatever you use)
    cmd = 'mocha --growl -c --reporter spec ',
    watchr,
    suite;


suite = new Projstrap.Suite({

  //Path to the root of the project
  path: __dirname,

  //path to your javascript
  libPath: 'lib/',

  //path to your spec(s) or tests
  specPath: 'spec/',

  //what your files are named (usually .js)
  libSuffix: '.js',

  //suffix for tests (usually -spec.js or Spec.js)
  specSuffix: '-spec.js'
});


//Create new Watchr instance
//Assumes this file is in the root of your project
watchr = new Projstrap.Watchr(__dirname, {
  //Poll very frequently
  rate: 5
});


//change is fired when file is created, modified or deleted
watchr.on('change', function(event){
  var spec = suite.specFromPath(event.path);

  //Skip deletion events
  if(event.type == 'deleted'){
    return;
  }


  //Skip changes on files we don't care about
  if(!spec.isSpec && !spec.isLib){
    return;
  }

  console.log('Executing:', cmd + spec.specPath);

  exec(cmd + spec.specPath, function(err, stdout, stderr){
    if(stderr){
      console.error(stderr);
    }

    console.log(stdout);
  });
});

watchr.start();


var Strap = require('projstrap'),
    Suite = Strap.Suite,
    Watchr = Strap.Watchr,
    suiteOptions,
    watchr,
    exec = require('child_process').exec,
    cmd = 'mocha --growl -c --reporter spec ';


suiteOptions = {
  libPath: 'lib/',
  specPath: 'spec/',
  libSuffix: '.js',
  specSuffix: '-spec.js'
};


watchr = new Watchr(__dirname, {
  rate: 2
});


watchr.on('change', function(event){
  var spec = strap.pathDetails(event.path);

  exec(cmd + spec.specPath, function(err, stdout, stderr){
    if(err){
      console.log('Node Error: ', err);
    }

    if(stderr){
      console.error(stderr);
    }

    console.log(stdout);
  });
});

watchr.start();

