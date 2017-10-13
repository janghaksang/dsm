'use strict';
import EventEmitter from 'events';

export default class StateMachine {
  constructor(initials) {
    var priv = {
      eventLoop: new EventEmitter(),
      current: -1,
      states: [],
      hash: {}
    };

    this.current = ()=>priv.states[priv.current];
    this.has = state=>{
      if(priv.hash[state.name()]) return new Error('Duplicated State');
      let index = priv.states.length;
      state.index = ()=>index;
      state.eventLoop = ()=>priv.eventLoop;
      state.clear = ()=>priv.states.forEach(state=>state.activate(false));
      priv.states.push(state);
      priv.hash[state.name()] = state;
      if(state.activate()) priv.current = state.index();
    };
    this.state = name=>priv.hash[name];
    this.states = ()=>priv.states;
    let onEvent = (event,sender)=>{
      if(sender) {
        sender.onRun(priv,event);
        sender.onTransit(priv,event);
      } else {
        if(!(0<=priv.current&&priv.current<priv.states.length)) return;
        this.current().onRun(priv,event);
        this.current().onTransit(priv,event);
      }
    };
    priv.eventLoop.on('state-event',(event,sender)=>onEvent.call(this,event,sender));
    this.transit = (event)=>priv.eventLoop.emit('state-event',event);

    if(initials) {
      initials.forEach(initial=>this.has(initial));
    }
  }
}
