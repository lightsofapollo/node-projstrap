var expect = require('expect.js');

describe('spec', function(){

  var subject,
      Spec = require('../lib/spec'),
      setup = function(isSpec){

        if(typeof(isSpec) === 'undefined'){
          isSpec = true;
        }

        var options = {
          isSpec: isSpec,
          specPath: 'foo',
          libPath: 'boo'
        };

        beforeEach(function(){
          subject = new Spec(options);
        });
      };

  describe("initialization", function(){

    setup(true);

    it("should anything given in options as a property", function(){
      expect(subject.isSpec).to.be(true);
      expect(subject.specPath).to.be('foo');
      expect(subject.libPath).to.be('boo');
    });

  });

});
