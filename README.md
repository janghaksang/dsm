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

dsm.state('solid').act('melt',()=>console.log('I melted'));
dsm.state('liquid').act('freeze',()=>console.log('I freezed'));
dsm.state('liquid').act('vaporize',()=>console.log('I vaporized'));
dsm.state('gas').act('condense',()=>console.log('I condensed'));

dsm.state('solid').act('activated',()=>console.log('I am solid'));
dsm.state('liquid').act('activated',()=>console.log('I am liquid'));
dsm.state('gas').act('activated',()=>console.log('I am gas'));

console.log(dsm.current().name());

dsm.send('melt');
dsm.send('freeze');
dsm.send('melt');
dsm.send('vaporize');
dsm.send('condense');

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

    this.state('green').act('activated',()=>console.log('green'));
    this.state('yellow').act('activated',()=>console.log('yellow'));
    this.state('red').act('activated',()=>console.log('red'));
    this.state('final').act('activated',()=>console.log('final'));
  }
}

let bf = new BranchingFlow();

console.log(bf.current().name());

bf.send('warn');
bf.send('clear');
bf.send('panic');
bf.send('clear');
bf.send('warn');
bf.send('panic');
bf.send('calm');
bf.send('panic');
bf.send('finish');

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
