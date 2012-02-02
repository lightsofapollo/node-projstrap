var expect = require('expect.js');

describe('bootstrap', function(){

  var Bootstrap = require('../lib/Bootstrap');

  it("should contain a reference to Watchr", function(){
    expect(Bootstrap.Watchr).to.be(require('../lib/watchr'));
  });

  it("should contain a reference to Suite", function(){
    expect(Bootstrap.Suite).to.be(require('../lib/suite'));
  });

});
