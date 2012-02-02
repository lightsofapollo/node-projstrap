var expect = require('expect.js');

describe("cli", function(){
  var subject, 
      path = __dirname + '/testapp/',
      fs = require('fs'),
      fsPath = require('path'),
      Cli = require('../lib/cli'),
      rm = function(path){
        var type;
        if(fsPath.existsSync(path)){
          type = fs.statSync(path);
          if(type.isFile()){
            fs.unlinkSync(path);
          } else if(type.isDirectory()){
            fs.rmdirSync(path);
          }
        }
      };

  it("should use an existing path", function(){
    expect(fsPath.existsSync(path)).to.be(true);
  });

  beforeEach(function(){
    subject = new Cli(path);
  });

  describe("initialization", function(){

    it("should save first argument in creation to .path", function(){
      expect(subject.path).to.equal(path);
    });

  });

  describe(".getPath", function(){
    it("should return a path relative to this.path + arguments[0]", function(){
      expect(subject.getPath('foo')).to.equal(path + 'foo');
    });
  });

  describe(".pathExists", function(){

    it("should return true when this.path + arguments[0] exists", function(){
      expect(subject.pathExists('lib/')).to.be(true);
    });

    it("should return false when this.path + arguments[0] does not exist", function(){
      expect(subject.pathExists('fooBar/')).to.be(false);
    });

  });

  describe(".convertYN", function(){

    var accepted = {
      'true': true,
      'false': false,
      'y': true,
      'n': false,
      'yes': true,
      'no': false
    }, stringName;

    for(stringName in accepted){
      (function(stringName){
        it("should return " + accepted[stringName] + " when given " + stringName, function(){
          expect(subject.convertYN(stringName)).to.be(accepted[stringName]);
        });
      }(stringName))
    }
  });

  describe(".createDir", function(){
    
    var myLog = function(arg){
      logs.push(arg);
    }, logs, oldLog;

    beforeEach(function(){
      oldLog = console.error;
      console.error = myLog;
      logs = [];
    });

    afterEach(function(){
      console.error = oldLog;
      rm(path + 'spec/')
    });

    it("should create directory if does not exist", function(){
      subject.createDir('spec/');
      expect(subject.pathExists('spec')).to.be(true);
    });

    it("should not throw an error when it does exist", function(){
      subject.createDir('spec/');
      subject.createDir('spec/');
      expect(subject.pathExists('spec')).to.be(true);
    });

  });

  describe(".copyFile", function(){

    var templatePath = __dirname + '/test_file.txt';

    beforeEach(function(){
      subject.copyFile(
        templatePath, 
        'watchr.js'
      );
    });

    afterEach(function(){
      rm(subject.getPath('watchr.js'));
    });

    it("should create watchr.js relative to this.path", function(){
      expect(subject.pathExists('watchr.js')).to.be(true);
    });

    it("should have copied contents from the templats/watchr.js", function(){
      var expected =  fs.readFileSync(templatePath).toString(),
          actual = fs.readFileSync(subject.getPath('watchr.js')).toString();

      expect(actual).to.equal(expected);
    });

  });

});
