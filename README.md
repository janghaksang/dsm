# dsm
Declarative State Machine Library

# Example

```javascript
import { StateMachine, State } from 'declarative-state-machine';

let dsm = new StateMachine();

dsm.has(new State({name:'solid',active:true}));
dsm.has(new State({name:'liquid'}));
dsm.has(new State({name:'gas'}));

dsm.state('solid').transit('melt',dsm.state('liquid'));
dsm.state('liquid').transit('freeze',dsm.state('solid'));
dsm.state('liquid').transit('vaporize',dsm.state('gas'));
dsm.state('gas').transit('condense',dsm.state('liquid'));

dsm.state('solid').run('melt',()=>console.log('I melted'));
dsm.state('liquid').run('freeze',()=>console.log('I freezed'));
dsm.state('liquid').run('vaporize',()=>console.log('I vaporized'));
dsm.state('gas').run('condense',()=>console.log('I condensed'));

dsm.state('solid').run('activated',()=>console.log('I am solid'));
dsm.state('liquid').run('activated',()=>console.log('I am liquid'));
dsm.state('gas').run('activated',()=>console.log('I am gas'));

console.log(dsm.current().name());

dsm.transit('melt');
dsm.transit('freeze');
dsm.transit('melt');
dsm.transit('vaporize');
dsm.transit('condense');

console.log(dsm.current().name());

console.log('----');

class BranchingFlow extends StateMachine {
  constructor() {
    super([
      new State({name:'green',active:true}),
      new State({name:'yellow'}),
      new State({name:'red'}),
      new State({name:'final'})
    ]);

    this.state('green').transit('warn',this.state('yellow'));
    this.state('green').transit('panic',this.state('red'));
    this.state('yellow').transit('clear',this.state('green'));
    this.state('yellow').transit('panic',this.state('red'));
    this.state('red').transit('clear',this.state('green'));
    this.state('red').transit('calm',this.state('yellow'));
    this.state('red').transit('finish',this.state('final'));

    this.state('green').run('activated',()=>console.log('green'));
    this.state('yellow').run('activated',()=>console.log('yellow'));
    this.state('red').run('activated',()=>console.log('red'));
    this.state('final').run('activated',()=>console.log('final'));
  }
}

let bf = new BranchingFlow();

console.log(bf.current().name());

bf.transit('warn');
bf.transit('clear');
bf.transit('panic');
bf.transit('clear');
bf.transit('warn');
bf.transit('panic');
bf.transit('calm');
bf.transit('panic');
bf.transit('finish');

console.log(bf.current().name());
```

# Result

```javascript

solid
I melted
I am liquid
I freezed
I am solid
I melted
I am liquid
I vaporized
I am gas
I condensed
I am liquid
liquid
----
green
yellow
green
red
green
yellow
red
yellow
red
final
final
```
