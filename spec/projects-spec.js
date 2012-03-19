var Projects = require('../lib/projects');

describe("cli", function(){
  var subject,
      projects = {
        node: require('./test-projects/b/node'),
        foo: require('./test-projects/a/foo')
      };

  beforeEach(function(){
    subject = new Projects();
  });

  describe("initializer", function(){

    it("should define .types as an object", function(){
      expect(subject.types).not.to.be(Projects.prototype.projectTypes);
      expect(subject.types).to.eql({});
    });

    it("should define pathQueue as an array", function(){
      expect(subject.pathQueue).to.be.a(Array);
    });

  });

  describe(".add", function(){
    beforeEach(function(){
      subject.add('foo');
    });

    it("should add foo to pathQueue", function(){
      expect(subject.pathQueue).to.contain('foo');
    });
    
  });

  describe(".load", function(){
    beforeEach(function(done){
      subject.add(__dirname + '/test-projects/b/');
      subject.add(__dirname + '/test-projects/a/');

      subject.load(done);
    });

    it("should remove paths from queue", function(){
      expect(subject.pathQueue.length).to.be(0);
    });

    it("should load paths", function(){
      expect(subject.types).to.eql(projects);
    });

  });

  describe(".loadFile", function(){

    var result;

    describe("when given a file that does not end in .js/.coffee", function(){

      beforeEach(function(){
        result = subject.loadFile('./test_file.txt');
      });

      it("should return false", function(){
        expect(result).to.be(false);
      });

    });

    describe("when given a .js file", function(){

      beforeEach(function(){
        result = subject.loadFile(__dirname + '/test-projects/b/node.js');
      });

      it("should return require(d) object", function(){
        expect(result).to.be(projects.node);
      });

    });

  });

  describe(".loadTypes", function(){

    var result;

    describe("for a single load", function(){

      beforeEach(function(done){
        subject.loadTypes(__dirname + '/test-projects/a/', function(err, loaded){
          result = loaded;
          done(err);
        });
      });

      it("should add loaded projects to .types", function(){
        expect(subject.types.foo).to.be(projects.foo);
      });

    });

    describe("after multiple loads", function(){
      beforeEach(function(done){
        subject.loadTypes(__dirname + '/test-projects/a/', done);
      });

      beforeEach(function(done){
        subject.loadTypes(__dirname + '/test-projects/b/', done);
      });

      it("should merge results of multiple loads", function(){
        expect(subject.types).to.eql(projects);
      });

    });

  });


});
