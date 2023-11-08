// class Example{
//     constructor(name) {
//         this.name = name;
//     }
//     init(){
//         const fnc = () => {
//             console.log(this.name);
//         }
//         fnc();
//     }
// }
// const example = new Example('hello');
// example.init();

Example.prototype.sayName = function(){
    'use strict';
    if(new.target){
        throw new Error('no new');
    }
    console.log('say name');
}
function Example(name){
    'use strict';
    if(!new.target){
        throw new Error('new');
    }
    this.name = name;
}

Object.defineProperty(Example.prototype, 'init', {
    value : function() {
        const func = function (){
            console.log(this.name);
        }
        func.call(this)
    },
    enumerable: false,
})
const example = new Example('world');
example.init();
// example.sayName();
for (const key in example) {
    console.log(key, 'key')
}


