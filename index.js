
var eventmap = {
  8:  'backspace',
  9:  'tab',
  13: 'return',
  16: 'shift',
  17: 'ctrl',
  18: 'alt',
  20: 'caps',
  27: 'escape',
  33: 'page up',
  34: 'page down',
  35: 'end',
  36: 'home',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
  45: 'insert',
  46: 'delete',
  91: 'meta'
};

var keyname = function(e){
  var b = eventmap[e.keyCode] || String.fromCharCode(e.keyCode);
  var name = b;
  if (e.altKey && b !== 'alt') name = 'alt ' + name;
  if (e.shiftKey && b !== 'shift') name = 'shift ' + name;
  if (e.ctrlKey && b !== 'ctrl') name = 'ctrl ' + name;
  if (e.metaKey && b !== 'meta') name = 'meta ' + name;
  return name;
};

var keys = module.exports = function (config) {
  var names = Object.keys(config);
  for (var i=0; i<names.length; i++) {
    if (names[i].indexOf('|') !== -1) {
      var val = config[names[i]];
      delete config[names[i]];
      var parts = names[i].split('|');
      for (var j=0; j<parts.length; j++) {
        config[parts[j]] = val;
      }
    }
  }
  return function (e) {
    var name = keyname(e);
    if (config[name]) {
      return config[name](e);
    }
  };
};

