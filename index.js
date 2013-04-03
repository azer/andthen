module.exports = andThen;

function andThen(/* functions */){

  var functions = Array.prototype.slice.call(arguments);

  call.then = then;

  return call;

  function call(/* [firstValue,] callback */){

    var hasFirstValue = arguments.length > 1,
        firstValue    = hasFirstValue ? arguments[0] : undefined,
        callback      = arguments[ hasFirstValue ? 1 : 0 ],
        bind, currentValue, params;

    function next(i/* [, currentValue ] */){

      currentValue = arguments[1];
      params = arguments.length > 1 ? [ currentValue ] : [];

      if(typeof functions[i] == 'string'){
        bind = functions[i];
        return next(i+1, currentValue);
      }

      if(bind != undefined && params[0]){
        params[0] = currentValue[bind];
      }

      params.push(function(error, newValue){

        if(error) return callback(error, currentValue);

        if(bind != undefined) {
          currentValue[ bind ] = newValue;
          bind = undefined;
          newValue = currentValue;
        }

        if( i + 1 >= functions.length ) return callback(undefined, newValue);

        next( i + 1, newValue );

      });

      functions[i].apply(undefined, params);

    }

    hasFirstValue ? next(0, firstValue) : next(0);

  };

  function then(/* [callbacks] */){
    Array.prototype.push.apply(functions, arguments);
    return call;
  }

};
