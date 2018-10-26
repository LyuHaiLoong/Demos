//流星动画
setInterval(function() {
    const obj = add("#sky", "div", 2, "star");

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
    const obj = add("#stars", "div", 2, "blink");

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

//月亮移动
requestAnimation({
    ele: "#moon",
    attr: "right",
    value: 1200,
    time: 10000000,
});


// 添加云
const clouds = add(".cloud", "div", 14, "circle", true);
console.log(clouds);
for (let i = 0; i < clouds.children.length; i++) {
    for (let j = 0; j < clouds.children[i].length;) {
        clouds.children[i][j].classList.add(`circle-${++j}`);
    }
}
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