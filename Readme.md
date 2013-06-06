
# keys

[![Build Status](https://travis-ci.org/notablemind/keys.png?branch=master)](https://travis-ci.org/notablemind/keys)

  Simple intuitive keybinding

## Installation

    $ component install notablemind/keys

## API

Order is currently important (it probably shouldn't be though...) for modifiers.

- [meta] [ctrl] [alt] [shift] key

You can bind multiple key chords to the same function with the pipe `|`. Note:
whitespace is also currently significant (though it probably shouldn't be).

If you want to bind the when someone presses a modifier key, though, it always
comes last. Ex: `alt shift` would bind to a user pressing "shift" while
holding the "alt" key.

    events.bind(el, 'keydown', keys({
        'left': goleft,
        'ctrl up': frown,
        'ctrl shift down': smile,
        'shift tab': function (e) { alert(e); },
        'left|right': leftorright
    });
    
## License

  MIT
