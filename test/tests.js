
var expect = require('chai').expect;
var keys = require('../');

var keynaming = [
  ['create a name correctly', {keyCode: 32}, 'space'],
  ['recognize alt',   {keyCode: 32, altKey: true},   'alt space'],
  ['recognize ctrl',  {keyCode: 32, ctrlKey: true},  'ctrl space'],
  ['recognize meta',  {keyCode: 32, metaKey: true},  'meta space'],
  ['recognize shift', {keyCode: 32, shiftKey: true}, 'shift space'],
  ['recognize ctrl+alt', {keyCode: 32, ctrlKey: true, altKey: true}, 'ctrl alt space'],
];

describe('keyname', function(){
  keynaming.forEach(function(item){
    it('should ' + item[0], function(){
      expect(keys.keyname(item[1])).to.eql(item[2]);
    });
  });
});

describe('keys', function(){
  keynaming.forEach(function(item){
    it('should ' + item[0], function(){
      var called = false;
      var callb = function(){called=true;};
      var config = {};
      config[item[2]] = callb;
      var fn = keys(config);
      item[1].preventDefault = function(){};
      item[1].stopPropagation = function(){};
      fn(item[1]);
      expect(called).to.be.true;
    });
  });
});

var normalizing = [
  ['preserve single', 'A', 'A'],
  ['ctrl', 'ctrl'],
  ['ucase char', 'shift a', 'shift A'],
  ['preserve good', 'ctrl shift space', 'ctrl shift space'],
  ['order mods', 'shift ctrl space', 'ctrl shift space'],
  ['fail unknown mod', 'a a', false],
  ['fail unknown main', 'bad', false],
  ['fail unknown main after mods', 'ctrl shift bad', false]
];

describe('normalize', function(){
  normalizing.forEach(function(item){
    var title = item.length == 3 ? item.shift() : 'normalize ' + item[0];
    it('should ' + title, function(){
      var res = keys.normalize(item[0]);
      if (item[1] === false){
        expect(res.error).to.be.ok;
      } else {
        expect(res.error).to.not.be.ok;
        expect(res.value).to.eql(item[1]);
      }
    });
  });
});


