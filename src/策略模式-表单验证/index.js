const formDom = document.forms[0];
const strategies = {
    isNonEmpty: function (value, errMsg) {
        if (value === "") {
            return errMsg;
        }
    },
    minLength: function (value, length, errMsg) {
        if (value.length < length) {
            return errMsg;
        }
    },
    isMobile: function (value, errMsg) {
        if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(value)) {
            return errMsg;
        }
    },
};
const Validator = function () {
    this.cache = [];
};
Validator.prototype.add = function (dom, rules) {
    const self = this;
    for (let i = 0, rule; rule = rules[i++];) {
        const strategyAry = rule.strategy.split(":");
        const errMsg = rule.errMsg;
        self.cache.push(function () {
            const strategy = strategyAry.shift();
            strategyAry.unshift(dom.value);
            strategyAry.push(errMsg);
            return strategies[strategy].apply(dom, strategyAry);
        });
    }
};
Validator.prototype.start = function () {
    for (let i = 0, valFun; (valFun = this.cache[i++]);) {
        const errMsg = valFun();
        if (errMsg) {
            return errMsg;
        }
    }
};
const validatorFunc = function () {
    const validator = new Validator();

    validator.add(formDom.username, [
        { strategy: "isNonEmpty", errMsg: "用户名不能为空" },
        { strategy: "minLength:6", errMsg: "用户名不能少于6位" },
    ]);
    validator.add(formDom.password, [
        { strategy: "minLength:8", errMsg: "密码长度不能少于8位" },
    ]);
    validator.add(formDom.phone, [
        { strategy: "isMobile", errMsg: "手机号格式不正确" },
    ]);

    return validator.start();
};

formDom.onsubmit = function (event) {
    event.preventDefault();
    const errMsg = validatorFunc();
    if (errMsg) {
        console.log(errMsg, 'errMsg')
        return false;
    }
    console.log('验证通过');
};
