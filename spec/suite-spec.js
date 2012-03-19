
describe("suite", function(){

  var Suite = require('../lib/suite'),
      Spec = require('../lib/spec'),
      subject, root = __dirname + '/testapp',
      libPath = 'lib/foo.js',
      specPath = 'spec/foo-spec.js';

  beforeEach(function(){

    subject = new Suite({
      path: root
    });
  });


  describe("initialize", function(){

    describe("defaults", function(){

      beforeEach(function(){
        subject = new Suite({
          path: root
        });
      });

      it("should have set path and appended a slash", function(){
        expect(subject.path).to.eql(root + '/');
      });

      it("should have set specDir", function(){
        expect(subject.specDir).to.equal('spec/');
      });

      it("should have set libDir", function(){
        expect(subject.libDir).to.equal('lib/');
      });

      it("should have set specSuffix", function(){
        expect(subject.specSuffix).to.equal('-spec.js');
      });

      it("should have set libSuffix", function(){
        expect(subject.libSuffix).to.equal('.js');
      });

    });

    describe("overriding", function(){

      var val = 'foo', overrides = {
        specDir: val,
        libDir: val,
        specSuffix: val,
        libSuffix: val,
        path: root + '/'
      }, key;

      beforeEach(function(){
        subject = new Suite(overrides);
      });

      for(key in overrides){
        if(overrides.hasOwnProperty(key)){
          (function(){
            it("should allow overriding " + key, function(){
              expect(subject[key]).to.eql(overrides[key]);
            });
          }(key));
        }
      }

    });

  });

  describe("._definePatterns", function(){

    var r = function(str){
      return new RegExp(str);
    };

    var expected = {
      specSuffix: r('-spec.js$'),
      libSuffix: r('.js$'),
      specDir: r('^spec/'),
      libDir: r('^lib/')
    }, ptn;

    it("should have created .patterns object", function(){
      expect(subject.patterns).to.be.an('object');
    });

    for(ptn in expected){
      if(expected.hasOwnProperty(ptn)){
        (function(ptn){
          it("should have created a pattern " + ptn + " " + expected[ptn].toString(), function(){
            expect(subject.patterns[ptn]).to.be.a(RegExp);
            expect(subject.patterns[ptn].toString()).to.be(expected[ptn].toString());
          });
        }(ptn));
      }
    }

  });

  describe(".relativePath", function(){

    it("should return a path relative to the root without a starting slash", function(){
      var expected = 'myFoo/path.js';
      expect(subject.relativePath(root + '/myFoo/path.js')).to.eql(expected);
    });

  });

  describe(".swapPaths", function(){

    it("should return lib path when converting from lib -> lib", function(){
      expect(subject.swapPaths(libPath, 'lib')).to.eql(libPath);
    });

    it("should return lib path when converting from spec -> spec", function(){
      expect(subject.swapPaths(specPath, 'spec')).to.eql(specPath);
    });

    it("should return spec path when converting lib -> spec", function(){
      expect(subject.swapPaths(libPath, 'spec')).to.eql(
        specPath
      );
    });

    it("should return lib path when converting spec -> lib", function(){
      expect(subject.swapPaths(specPath, 'lib')).to.eql(
        libPath
      );
    });

  });

  describe(".matchesType", function(){

    var matches = {
      lib: {
        'lib/foo.js': true,
        'lib/MyOtherFoo.js': true,
        //Because suffix is .js
        'lib/MyFooSpec.js': true
      },

      spec: {
        'spec/foo.js': false,
        'spec/spec-spec.js': true,
        'spec/Other-spec.js': true,
        'spec/MyOtherFooSpec.js': false
      }
    }, type, path, expected;

    //Ok, this is bad.
    //When let is introduced we can use that
    for(type in matches){

      (function(type){

        describe("when matching for " + type, function(){
          for(path in matches[type]){
            (function(path, expected){
              it("should return " + expected + " when given " + path, function(){
                expect(subject.matchesType(type, path)).to.be(expected);
              });
            }(path, matches[type][path]));
          }
        });

      }(type));
    }

    it("should throw an error when given an invalid type", function(){
      expect(function(){
        subject.matchesType('fake', 'foo');
      }).to.throwException();
    });

  });

  describe('.specFromPath', function(){

    var results;

    shouldReturnPathDetails = function(path, isSpec){

      beforeEach(function(){
        results = subject.specFromPath(root + '/' + path);
      });

      it("should have .isSpec === " + isSpec, function(){
        expect(results.isSpec).to.be(isSpec);
      });

      it("should have .isLib === " + !isSpec, function(){
        expect(results.isLib).to.be(!isSpec);
      });

      it("should have .libPath", function(){
        expect(results.libPath).to.eql(libPath);
      });

      it("should return .specPath", function(){
        expect(results.specPath).to.eql(specPath);
      });

      it("should be an instanceof Spec", function(){
        expect(results).to.be.a(Spec);
      });

    };

    describe("when given a path that matches dir but not suffix", function(){

      beforeEach(function(){
        results = subject.specFromPath(root + '/' + 'spec/foo.js');
      });

      it("should set isSpec & isLib to false", function(){
        expect(results.isLib).to.be(false);
        expect(results.isSpec).to.be(false);
      });

    });

    describe("results after given a spec path", function(){
      shouldReturnPathDetails(specPath, true);
    });

    describe("results after given a lib path", function(){
      shouldReturnPathDetails(libPath, false);
    });

  });

});
