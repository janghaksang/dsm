'use strict';

export default class State {
  constructor(props) {
    var priv = {
      ...props,
      active: props.active||false,
      name: props.name||'NoName',
      transitables: {},
      runnables: {},
    };

    this.active = (boolean)=>{
      if(priv.active==boolean) return;
      if(boolean) this.clear();
      if(typeof(boolean)=='boolean') {
        priv.active = boolean;
        this.eventLoop().emit('state-event',boolean?'activated':'deactivated',this);
      }
      return priv.active;
    };
    this.name = ()=>priv.name;
    this.transit = (event,state)=>{
      priv.transitables[event] = state;
    };
    this.run = (event,callback)=>{
      priv.runnables[event] = callback;
    };
    this.onTransit = (machine,event)=>{
      let next = priv.transitables[event];
      if(next) {
        this.active(false);
        next.active(true);
        machine.current = next.index();
      }
    };
    this.onRun = (machine,event)=>{
      let callback = priv.runnables[event];
      if(callback) {
        callback();
      }
    };
  }
}
