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

    this.activate = (boolean)=>{
      if(priv.active==boolean) return;
      if(boolean) this.clear();
      if(typeof(boolean)=='boolean') {
        priv.active = boolean;
        this.eventLoop().emit('state-event',boolean?'activated':'deactivated',this);
      }
      return priv.active;
    };
    this.name = ()=>priv.name;
    this.transit = (signal,state)=>{
      priv.transitables[signal] = state;
    };
    this.act = (signal,action)=>{
      priv.runnables[signal] = action;
    };
    this.onTransit = (machine,signal)=>{
      let next = priv.transitables[signal];
      if(next) {
        this.activate(false);
        next.activate(true);
        machine.current = next.index();
      }
    };
    this.onAct = (machine,signal)=>{
      let action = priv.runnables[signal];
      if(action) {
        action();
      }
    };
  }
}
