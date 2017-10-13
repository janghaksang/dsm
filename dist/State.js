'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var State = function State(props) {
  var _this = this;

  _classCallCheck(this, State);

  var priv = _extends({}, props, {
    active: props.active || false,
    name: props.name || 'NoName',
    transitables: {},
    runnables: {}
  });

  this.activate = function (boolean) {
    if (priv.active == boolean) return;
    if (boolean) _this.clear();
    if (typeof boolean == 'boolean') {
      priv.active = boolean;
      _this.eventLoop().emit('state-event', boolean ? 'activated' : 'deactivated', _this);
    }
    return priv.active;
  };
  this.name = function () {
    return priv.name;
  };
  this.transit = function (event, state) {
    priv.transitables[event] = state;
  };
  this.run = function (event, callback) {
    priv.runnables[event] = callback;
  };
  this.onTransit = function (machine, event) {
    var next = priv.transitables[event];
    if (next) {
      _this.activate(false);
      next.activate(true);
      machine.current = next.index();
    }
  };
  this.onRun = function (machine, event) {
    var callback = priv.runnables[event];
    if (callback) {
      callback();
    }
  };
};

exports.default = State;