
var keyCodeNames = {
  8:  'backspace',
  9:  'tab',
  13: 'return',
  16: 'shift',
  17: 'ctrl',
  18: 'alt',
  20: 'caps',
  27: 'escape',
  32: 'space',
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

var nameCodeKeys = {};
Object.keys(keyCodeNames).forEach(function(name){
  nameCodeKeys[keyCodeNames[name]] = name;
});

var keyname = function(e){
  var b = keyCodeNames[e.keyCode] || String.fromCharCode(e.keyCode);
  var name = b;
  if (e.shiftKey && b !== 'shift') name = 'shift ' + name;
  if (e.altKey && b !== 'alt') name = 'alt ' + name;
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
      var res = config[name](e);
      if (!res) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      return res;
    }
  };
};

module.exports.normalize = function (value) {
  var parts = value.split('|')
    , normal = [];
  for (var i=0; i<parts.length; i++) {
    if (!parts[i].trim()) continue;
    var one = normalize(parts[i]);
    if (one.value) normal.push(one.value);
    else normal.push(parts[i]);
    if (one.error) {
      return {error: one.error, value: normal.concat(parts.slice(i+1)).join('|')};
    }
  }
  return {value: normal.join('|')};
};

/**
 * name = a key
 *
 * If it's invalid: {error: message, [value: normalized]}
 * If it's valid: {value: normalized}
 */
var normalize = function(name){
  var parts = name.replace(/^\s+/, '')
                  .replace(/\s+$/, '').toLowerCase().split(/\s+/);
  var mods = {ctrl:false, shift:false, alt:false, meta:false};
  for (var i=0; i<parts.length - 1; i++) {
    if (typeof mods[parts[i]] === 'undefined') {
      // invalid modifiers
      return {error: 'Unknown modifier'};
    } else {
      mods[parts[i]] = true;
    }
  }
  var pre = [];
  if (mods.meta)  pre.push('meta');
  if (mods.ctrl)  pre.push('ctrl');
  if (mods.alt)   pre.push('alt');
  if (mods.shift) pre.push('shift');
  pre.push('');
  pre = pre.join(' ');
  var main = parts[parts.length - 1];
  if (!nameCodeKeys[main] && main.length > 1) {
    // invalid final
    return {error: 'Unknown key', value: pre + main};
  }
  if (!nameCodeKeys[main]) {
    main = main.toUpperCase();
  }
  return {value: pre + main};
};

var serialize = function (name) {
  var parts = name.replace(/^\s+/, '')
                  .replace(/\s+$/, '').toLowerCase().split(/\s+/);
  var mods = {ctrlKey:false, shiftKey:false, altKey:false, metaKey:false};
  for (var i=0; i<parts.length - 1; i++) {
    if (typeof mods[parts[i] + 'Key'] === 'undefined') {
      // invalid modifiers
      return false;
    } else {
      mods[parts[i] + 'Key'] = true;
    }
  }
  var main = parts[parts.length - 1];
  if (!nameCodeKeys[main] && main.length > 1) {
    // invalid final
    return false;
  }
  if (nameCodeKeys[main]) {
    mods.keyCode = nameCodeKeys[main];
  } else {
    mods.keyCode = main.charCodeAt(0);
  }
  return mods;
};

module.exports.serialize = serialize;
module.exports.keyname = keyname;

