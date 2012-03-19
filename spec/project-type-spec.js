var ProjectType = require('../lib/project-type');

describe("project-type", function(){

  var subject;


  describe("initializer", function(){

    var config = {
      name: 'name',
      description: 'desc',
      template: './foo',
      generator: function(){}
    }, key;

    beforeEach(function(){
      subject = new ProjectType(config);
    });

    it("should save each config property/key in object", function(){
      expect(subject).to.eql(config);
    });

  });

});
