'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StateMachine = function StateMachine(initials) {
  var _this = this;

  _classCallCheck(this, StateMachine);

  var priv = {
    eventLoop: new _events2.default(),
    current: -1,
    states: [],
    hash: {}
  };

  this.current = function () {
    return priv.states[priv.current];
  };
  this.has = function (state) {
    if (priv.hash[state.name()]) return new Error('Duplicated State');
    var index = priv.states.length;
    state.index = function () {
      return index;
    };
    state.eventLoop = function () {
      return priv.eventLoop;
    };
    state.clear = function () {
      return priv.states.forEach(function (state) {
        return state.activate(false);
      });
    };
    priv.states.push(state);
    priv.hash[state.name()] = state;
    if (state.activate()) priv.current = state.index();
  };
  this.state = function (name) {
    return priv.hash[name];
  };
  this.states = function () {
    return priv.states;
  };
  var onEvent = function onEvent(event, sender) {
    if (sender) {
      sender.onRun(priv, event);
      sender.onTransit(priv, event);
    } else {
      if (!(0 <= priv.current && priv.current < priv.states.length)) return;
      _this.current().onRun(priv, event);
      _this.current().onTransit(priv, event);
    }
  };
  priv.eventLoop.on('state-event', function (event, sender) {
    return onEvent.call(_this, event, sender);
  });
  this.transit = function (event) {
    return priv.eventLoop.emit('state-event', event);
  };

  if (initials) {
    initials.forEach(function (initial) {
      return _this.has(initial);
    });
  }
};

exports.default = StateMachine;