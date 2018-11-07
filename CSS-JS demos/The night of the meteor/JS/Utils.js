//———————————————————————————————————————————动画———————————————————————————————————————————————————
//运动动画，调用Tween.js
//ele: dom | class | id | tag  节点 | 类名 | id名 | 标签名，只支持选择一个节点，class类名以及标签名只能选择页面中第一个
//attr: attribute 属性名
//value: target value 目标值
//time: duration 持续时间
//tween: timing function 函数方程
//flag: Boolean 判断是按值移动还是按位置移动,默认按位置移动
//fn: callback 回调函数
//增加返回值: 将内部参数对象返回，可以通过设置返回对象的属性stop为true打断动画
function requestAnimation(obj) {
    //—————————————————————————————————————参数设置—————————————————————————————————————————————
    //默认属性
    const parameter = {
        ele: null,
        attr: null,
        value: null,
        time: 1000,
        tween: "linear",
        flag: true,
        stop: false,
        fn: ""
    }

    //合并传入属性
    Object.assign(parameter, obj); //覆盖重名属性

    //—————————————————————————————————————动画设置—————————————————————————————————————————————
    //创建运动方程初始参数,方便复用
    let start = 0; //用于保存初始时间戳
    let target = (typeof parameter.ele === "string" ? document.querySelector(parameter.ele) : parameter.ele), //目标节点
        attr = parameter.attr, //目标属性
        beginAttr = parseFloat(getComputedStyle(target)[attr]), //attr起始值
        value = parameter.value, //运动目标值
        count = value - beginAttr, //实际运动值
        time = parameter.time, //运动持续时间,
        tween = parameter.tween, //运动函数
        flag = parameter.flag,
        callback = parameter.fn, //回调函数
        curVal = 0; //运动当前值

    //判断传入函数是否为数组，多段运动
    (function() {
        if (attr instanceof Array) {
            beginAttr = [];
            count = [];
            for (let i of attr) {
                const val = parseFloat(getComputedStyle(target)[i]);
                beginAttr.push(val);
                count.push(value - val);
            }
        }
        if (value instanceof Array) {
            for (let i in value) {
                count[i] = value[i] - beginAttr[i];
            }
        }
    })();

    //运动函数
    function animate(timestamp) {
        if (parameter.stop) return; //打断
        //存储初始时间戳
        if (!start) start = timestamp;
        //已运动时间
        let t = timestamp - start;
        //判断多段运动
        if (beginAttr instanceof Array) {
            // const len = beginAttr.length //存数组长度，复用

            //多段运动第1类——多属性，同目标，同时间/不同时间
            if (typeof count === "number") { //同目标
                //同时间
                if (typeof time === "number") {
                    if (t > time) t = time; //判断是否超出目标值

                    //循环attr，分别赋值
                    for (let i in beginAttr) {
                        if (flag) curVal = Tween[tween](t, beginAttr[i], count, time); //调用Tween，返回当前属性值,此时计算方法为移动到写入位置
                        else curVal = Tween[tween](t, beginAttr[i], count + beginAttr[i], time); //调用Tween，返回当前属性值，此时计算方法为移动了写入距离
                        if (attr[i] === "opacity") target.style[attr[i]] = curVal; //给属性赋值
                        else target.style[attr[i]] = curVal + "px"; //给属性赋值

                        if (t < time) requestAnimationFrame(animate); //判断是否运动完
                        else callback && callback(); //调用回调函数
                    }
                    return;
                }

                //不同时间
                if (time instanceof Array) {
                    //循环time，attr，分别赋值
                    for (let i in beginAttr) {
                        //错误判断
                        if (!time[i] && time[i] !== 0) {
                            throw new Error(
                                "The input time's length is not equal to attribute's length");
                        }

                        //判断是否已经完成动画，完成则跳过此次循环
                        if (parseFloat(getComputedStyle(target)[attr[i]]) === (typeof value === "number" ? value : value[i]))
                            continue;
                        // t = timestamp - start; //每次循环初始化t
                        if (t > time[i]) t = time[i]; //判断是否超出目标值

                        if (flag || attr[i] === "opacity") curVal = Tween[tween](t, beginAttr[i], count, i); //调用Tween，返回当前属性值,此时计算方法为移动到写入位置
                        else curVal = Tween[tween](t, beginAttr[i], count + beginAttr[i], i); //调用Tween，返回当前属性值，此时计算方法为移动了写入距离
                        if (attr[i] === "opacity") target.style[attr[i]] = curVal; //给属性赋值
                        else target.style[attr[i]] = curVal + "px"; //给属性赋值
                    }

                    if (t < Math.max(...time)) requestAnimationFrame(animate); //判断函数是否运动完
                    else callback && callback(); //如果已经执行完时间最长的动画，则调用回调函数
                    return;
                }
            }

            //多段运动第2类——多属性，不同目标，同时间/不同时间
            if (count instanceof Array) {
                //同时间
                if (typeof time === "number") {

                    if (t > time) t = time; //判断是否超出目标值

                    for (let i in beginAttr) { //循环attr，count，分别赋值
                        //错误判断
                        if (!count[i] && count[i] !== 0) {
                            throw new Error(
                                "The input value's length is not equal to attribute's length");
                        }

                        if (flag || attr[i] === "opacity") curVal = Tween[tween](t, beginAttr[i], count[i], time); //调用Tween，返回当前属性值,此时计算方法为移动到写入位置
                        else curVal = Tween[tween](t, beginAttr[i], count[i] + beginAttr[i], time); //调用Tween，返回当前属性值，此时计算方法为移动了写入距离
                        if (attr[i] === "opacity") target.style[attr[i]] = curVal; //给属性赋值
                        else target.style[attr[i]] = curVal + "px"; //给属性赋值
                    }

                    if (t < time) requestAnimationFrame(animate); //判断函数是否运动完
                    else callback && callback(); //如果已经执行完时间最长的动画，则调用回调函数
                    return;
                }

                //不同时间
                if (time instanceof Array) {
                    for (let i in beginAttr) {
                        //错误判断
                        if (!time[i] && time[i] !== 0) {
                            throw new Error(
                                "The input time's length is not equal to attribute's length");
                        }

                        //判断是否已经完成动画，完成则跳过此次循环
                        if (parseFloat(getComputedStyle(target)[attr[i]]) === (typeof value === "number" ? value : value[i]))
                            continue;

                        if (t > time[i]) t = time[i]; //判断是否超出目标值

                        //错误判断
                        if (!count[i] && count[i] !== 0) {
                            throw new Error(
                                "The input value's length is not equal to attribute's length");
                        }

                        if (flag || attr[i] === "opacity") curVal = Tween[tween](t, beginAttr[i], count[i], time[i]); //调用Tween，返回当前属性值,此时计算方法为移动到写入位置
                        else curVal = Tween[tween](t, beginAttr[i], count[i] + beginAttr[i], time[i]); //调用Tween，返回当前属性值，此时计算方法为移动了写入距离
                        if (attr[i] === "opacity") target.style[attr[i]] = curVal;
                        else target.style[attr[i]] = curVal + "px";
                    }

                    if (t < Math.max(...time)) requestAnimationFrame(animate);
                    else callback && callback();
                    return;
                }
            }

        }

        //单运动模式
        if (t > time) t = time;
        if (flag || attr === "opacity") curVal = Tween[tween](t, beginAttr, count, time); //调用Tween，返回当前属性值,此时计算方法为移动到写入位置
        else curVal = Tween[tween](t, beginAttr[i], count + beginAttr, time); //调用Tween，返回当前属性值，此时计算方法为移动了写入距离
        if (attr === "opacity") target.style[attr] = curVal;
        else target.style[attr] = curVal + "px";

        if (t < time) requestAnimationFrame(animate);
        else callback && callback();

    }

    requestAnimationFrame(animate);
    return parameter; //返回对象，供打断或其他用途
}
//Tween.js
/*
 * t : time 已过时间
 * b : begin 起始值
 * c : count 总的运动值
 * d : duration 持续时间
 *
 * 曲线方程
 *
 * http://www.cnblogs.com/bluedream2009/archive/2010/06/19/1760909.html
 * */

let Tween = {
    linear: function(t, b, c, d) { //匀速
        return c * t / d + b;
    },
    easeIn: function(t, b, c, d) { //加速曲线
        return c * (t /= d) * t + b;
    },
    easeOut: function(t, b, c, d) { //减速曲线
        return -c * (t /= d) * (t - 2) + b;
    },
    easeBoth: function(t, b, c, d) { //加速减速曲线
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t + b;
        }
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    },
    easeInStrong: function(t, b, c, d) { //加加速曲线
        return c * (t /= d) * t * t * t + b;
    },
    easeOutStrong: function(t, b, c, d) { //减减速曲线
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    easeBothStrong: function(t, b, c, d) { //加加速减减速曲线
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t + b;
        }
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    },
    elasticIn: function(t, b, c, d, a, p) { //正弦衰减曲线（弹动渐入）
        if (t === 0) {
            return b;
        }
        if ((t /= d) == 1) {
            return b + c;
        }
        if (!p) {
            p = d * 0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    elasticOut: function(t, b, c, d, a, p) { //正弦增强曲线（弹动渐出）
        if (t === 0) {
            return b;
        }
        if ((t /= d) == 1) {
            return b + c;
        }
        if (!p) {
            p = d * 0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    },
    elasticBoth: function(t, b, c, d, a, p) {
        if (t === 0) {
            return b;
        }
        if ((t /= d / 2) == 2) {
            return b + c;
        }
        if (!p) {
            p = d * (0.3 * 1.5);
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        if (t < 1) {
            return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) *
                Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        }
        return a * Math.pow(2, -10 * (t -= 1)) *
            Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
    },
    backIn: function(t, b, c, d, s) { //回退加速（回退渐入）
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    backOut: function(t, b, c, d, s) {
        if (typeof s == 'undefined') {
            s = 3.70158; //回缩的距离
        }
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    backBoth: function(t, b, c, d, s) {
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        if ((t /= d / 2) < 1) {
            return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        }
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    },
    bounceIn: function(t, b, c, d) { //弹球减振（弹球渐出）
        return c - Tween['bounceOut'](d - t, 0, c, d) + b;
    },
    bounceOut: function(t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
        } else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
        } else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
        }
        return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
    },
    bounceBoth: function(t, b, c, d) {
        if (t < d / 2) {
            return Tween['bounceIn'](t * 2, 0, c, d) * 0.5 + b;
        }
        return Tween['bounceOut'](t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
    }
}


//———————————————————————————————————————————DOM操作———————————————————————————————————————————————————
// 添加节点
// ele: 父节点，支持输入变量，id值，class值，标签值。除变量外，其余值必须为字符串
// node: 添加的标签名，值为字符串
// n: 节点添加个数
// className: 节点绑定的class名，，值为字符串，多个class名用空格隔开
// boolean: 是否选中所有目标父节点。可选参数，不输入则判定为false，则只匹配选中的第一个节点
function addChild(ele, node, n, className, boolean) {
    //获取节点
    let parent = null;

    if (typeof ele !== "string") parent = ele;
    else if (ele[0] === "#") parent = document.getElementById(ele.slice(1));
    else if (ele[0] === ".") {
        if (boolean === false) parent = document.getElementsByClassName(ele.slice(1))[0];
        else parent = document.getElementsByClassName(ele.slice(1));
    } else {
        if (boolean === false) parent = docuemnt.getElementsByTagName(ele)[0];
        else parent = document.getElementsByTagNameNS(ele);
    }

    //声明用于存储父节点及子节点的对象 
    const obj = {
        "parent": parent,
        "children": []
    };

    //添加节点
    if (boolean) {
        for (let i = 0; i < parent.length; i++) {
            //创建容器碎片
            const fragment = document.createDocumentFragment();
            //保存子节点，用于返回值
            obj.children[i] = [];

            for (let j = 0; j < n; j++) {
                const target = document.createElement(node);
                target.className = className;
                fragment.append(target);
                //添加子节点到数组，用于返回值
                obj.children[i][j] = target;
            }

            parent[i].appendChild(fragment)
        }
    } else {
        //创建碎片容器
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < n; i++) {
            const target = document.createElement(node);
            target.className = className;
            fragment.append(target);
            //添加子节点，用于返回值
            obj.children[i] = target;
        }
        //将碎片容器一次性添加到父节点
        parent.appendChild(fragment);
    }

    //返回参数，供动画函数调用
    return obj;
}