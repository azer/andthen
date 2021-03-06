var comp    = require("./"),
    andThen = comp;

describe('andThen', function(){

  it('binds properties with following functions', function(done){

    andThen(getContents, 'posts', getPosts, 'images', getImages, lastStep)(function(error, contents){

      expect(contents.posts).to.deep.equal(['Foo', 'bar', 'qux']);
      expect(contents.images).to.deep.equal(['11.jpg', '7.jpg', '3.jpg']);
      expect(contents.lastStep).to.be.true;

      done();

    });

  });

  function getContents(callback){
    callback(undefined, { posts: [3, 1, 4], images: [11, 7, 3] });
  }

  function getPosts(ids, callback){
    callback(undefined, ['Foo', 'bar', 'qux']);
  }

  function getImages(ids, callback){
    callback(undefined, ['11.jpg', '7.jpg', '3.jpg']);
  }

  function lastStep(value, callback){
    value.lastStep = true;
    callback(undefined, value);
  }


});


describe('comp', function(){

  var values, currentStep, step1, step2, step3, errorStep,
      expectedError = new Error('I produce an error');

  it('returns a composition of given async functions', function(done){

    var steps = comp(step1, step2, step3);

    steps(values[0], function(error, value){

      expect(error).to.not.exist;
      expect(value).to.equal(values[3]);

      done();

    });

  });

  it('stops the progress if a function produced error', function(done){

    var steps = comp(step1, step2, errorStep, step3);

    steps(values[0], function(error, value){

      expect(error).to.equal(expectedError);
      expect(value).to.equal(values[2]);
      expect(currentStep).to.equal(2.5);

      done();

    });

  });

  it('may not take an initial value', function(done){

    var steps = comp(step0, step1, step2, step3);

    steps(function(error, value){

      expect(error).to.not.exist;
      expect(value).to.equal(values[3]);

      done();

    });

    function step0(callback){
      return callback(undefined, values[0]);
    }

  });

  it('allows adding new functions later with then method', function(done){

    var steps = comp(step1);

    steps.then(step2).then(step3);

    steps(values[0], function(error, value){

      expect(error).to.not.exist;
      expect(value).to.equal(values[3]);

      done();

    });

  });


  beforeEach(function(done){

    values    = [{ value1: true }, { value2: true }, { value3: true }, { value4: true }];
    step1     = newStep(1);
    step2     = newStep(2);
    step3     = newStep(3);
    errorStep = newStep(2.5, expectedError);

    done();

  });

  function newStep(n, error){

    return function(value, callback){

      currentStep = n;

      !error && expect(value).to.equal( values[ n - 1 ] );

      process.nextTick(function(){
        callback(error, values[n]);
      });

    }
  }

});
