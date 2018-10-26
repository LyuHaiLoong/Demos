//流星动画
setInterval(function() {
    const obj = add("#sky", 2, "star");

    for (let i = 0; i < obj.children.length; i++) {
        const top = -50 + Math.random() * 200 + "px",
            left = 200 + Math.random() * 1200 + "px",
            scale = 0.3 + Math.random() * 0.5;
        const timer = 1000 + Math.random() * 1000;

        obj.children[i].style.top = top;
        obj.children[i].style.left = left;
        obj.children[i].style.transform = `scale(${scale})`;

        requestAnimation({
            ele: obj.children[i],
            attr: ["top", "left", "opacity"],
            value: [150, -150, .8],
            time: timer,
            flag: false,
            fn: function() {
                requestAnimation({
                    ele: obj.children[i],
                    attr: ["top", "left", "opacity"],
                    value: [150, -150, 0],
                    time: timer,
                    flag: false,
                    fn: () => {
                        obj.parent.removeChild(obj.children[i]);
                    }
                })
            }
        });
    }

}, 1000);

//闪烁星星动画
setInterval(function() {
    const obj = add("#stars", 2, "blink");

    for (let i = 0; i < obj.children.length; i++) {
        const top = -50 + Math.random() * 500 + "px",
            left = 200 + Math.random() * 1200 + "px",
            round = 1 + Math.random() * 2 + "px";
        const timer = 1000 + Math.random() * 4000;

        obj.children[i].style.top = top;
        obj.children[i].style.left = left;
        obj.children[i].style.width = round;
        obj.children[i].style.height = round;

        requestAnimation({
            ele: obj.children[i],
            attr: "opacity",
            value: .5,
            time: timer,
            flag: false,
            fn: function() {
                requestAnimation({
                    ele: obj.children[i],
                    attr: "opacity",
                    value: 0,
                    time: timer,
                    flag: false,
                    fn: function() {
                        obj.parent.removeChild(obj.children[i]);
                    }
                });
            }
        });
    }

}, 1000);

//云动画

let flag = 1;
setInterval(
    function() {
        const clouds = document.querySelectorAll(".cloud");
        const left = Math.random() * 5;
        bottom = Math.random() * 5;

        let timer = 0;
        for (let i = 0; i < clouds.length; i++) {
            requestAnimation({
                ele: clouds[i],
                attr: ["left", "bottom"],
                value: flag % 2 ? [-left, -bottom] : [left, bottom],
                time: timer += 500,
                flag: false,
                fn: function() {
                    requestAnimation({
                        ele: clouds[i],
                        attr: ["left", "bottom"],
                        value: flag % 2 ? [left, bottom] : [-left, -bottom],
                        time: timer,
                        flag: false
                    })
                }
            });
        }

        flag++;
    }, 2000)

//月亮移动
requestAnimation({
    ele: "#moon",
    attr: "right",
    value: 1200,
    time: 10000000,
});

//封装添加函数
function add(ele, n, className, boolean) {
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
    for (let i = 0; i < n; i++) {
        const div = document.createElement("div");
        div.className = className;
        parent.appendChild(div);

        obj.children.push(div);
    }

    //返回参数，供动画函数调用
    return obj;
}