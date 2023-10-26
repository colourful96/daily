/**
 * 发布-订阅模式又叫观察者模式，它定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖与
 * 它的对象都将的到通知
 */

const observer = {
    cacheList: {
        // key: [fn,fn...]
    },
    listen: function (key, fn) {
        if (!this.cacheList[key]) {
            this.cacheList[key] = [];
        }
        this.cacheList[key].push(fn);
    },
    trigger: function (...args) {
        const fns = this.cacheList[args[0]];
        if (!fns || fns.length === 0) {
            return false;
        }
        for (let i = 0; i < fns.length; i++) {
            fns[i].apply(this, args);
        }
    },
    remove: function (key, fn) {
        const fns = this.cacheList[key];
        if (!fns) {
            return false;
        }
        if (!fn) {
            fns && (fns.length = 0);
        } else {
            for(let i = fns.length - 1; i >= 0; i++){
                const _fn = fns[i];
                if(_fn === fn){
                    fns.splice(i,1);
                }
            }
        }
    }
}

function installObserver(obj) {
    for (const key in observer) {
        obj[key] = observer[key];
    }
}

const phone = {};
installObserver(phone);
phone.listen('test', function (...args) {
    console.log(args, 'args');
})

setInterval(() => {
    phone.trigger('test', 'trigger');
}, 1000)

