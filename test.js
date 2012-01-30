var bootstrap = require('spec-bootstrap'),
    watchr = new bootstrap.Watchr(__dirname, {
      rate: 2
    }),
    path = require('path'),
    exec = require('child_process').exec,
    strap = new bootstrap({path: __dirname});


watchr.on('change', function(event){
  var details = strap.pathDetails(event.path);

  if(details.specPath){
    exec('mocha --growl -c --reporter spec --require expect.js ' + details.specPath, function(err, stdout, stderr){
      console.log(stdout);
      if(stderr){
        console.error(stderr);
      }
    });
  }
});

watchr.start();
