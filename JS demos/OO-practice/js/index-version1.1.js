//设计思路
//尽量解耦，形参为主，并通过对参数类型及事件类型的判断，执行不同的操作

/* 实现效果：
    1、bgColor： 
            1)通过控制event及num是否传入，判定是否为隔行变色行为;
            2)通过传入数组类型colors，执行onmouseout事件。缺点——如果没有隔行变色，也要传入数组;
            3)通过传入字符串类型colors(li标签背景颜色)，并判定event是否为onclick，执行onclick事件。并在onclick事件中添加选择事件；
            4)通过传入字符串类型colors(li标签背景颜色)，event非onclick事件，执行期望的颜色效果，此例主要为onmouseover。并在事件中添加判定，如果被选中，不执行代码效果;
            5)通过传入字符串类型colors(li标签背景颜色)，并在此基础上判定color(li标签字体颜色与多选框被选中状态背景颜色)类型，实现li标签字体颜色与多选框被选中状态背景颜色是否一致。color为字符串则颜色一致，color为数组则颜色不一致;

2、selectorAll： 
            1)通过控制event是否传参，判定是事件调用，还是选中状态判定调用。此例中用于onclick事件判定li标签是否全被选中;
            2)通过控制color1的数组的第三个元素是否写入，判断被选中状态下，li标签字体颜色与多选框背景颜色是否一致;
*/

/*总结： 
    1、通过判断参数，执行不同操作;
    2、通过判断li标签是否被选中，打断其他事件的执行;
    3、通过操作数组arr，仅给没被选中的li标签添加选中状态，减少循环执行次数;
    4、函数判断仍不够智能，实现方法仍可以优化，因为对其他人代码review较少，掌握的方法及应用场景的实施仍缺乏思考;
    5、逻辑依赖于形参的输入，不知道是否符合实际应用;
  */


function Music(cla, i) {
    //目标节点
    this.dom = document.getElementsByClassName(cla)[i];
    //获取列表
    this.domUl = document.getElementById("list"); //获取id，只能用document做前缀？？
    this.domUlList = this.domUl.getElementsByTagName("li");
    this.checkboxs = this.domUl.getElementsByTagName("div");
    //获取按钮
    this.domSelect = this.dom.querySelector(".select");
    this.domSelectAll = this.domSelect.querySelector(".selectAll");
}

Music.prototype.bgColor = function(event, colors, color, num) { //4个形参，event事件，colors用于li标签背景，num用于隔行变色行数，color用于li标签字体颜色以及多选框背景——colors和color的逻辑可以组合替换
    const _this = this; //存this指针
    if (!event && num) { //如果没有event事件，并且num有值的话,则判定为隔行变色
        for (let i = 0; i < this.domUlList.length; i++) {
            this.domUlList[i].style.background = colors[i % num] || colors; //通过num取余添加背景色
        }
        return; //打断代码执行
    }
    if (event && typeof colors === "string" || color instanceof Array) { //如果事件存在，colors是字符串或者color是数组的话
        for (let i = 0; i < this.domUlList.length; i++) {
            this.domUlList[i][event] = function() { //给每个li添加事件
                const bg = _this.checkboxs[i].style.background;
                if (bg && event !== "onclick") return; //如果已经被选中，但是不是click事件，不执行代码
                if (!bg && event === "onclick") { //如果li没被选中，并且是click事件的话，执行代码
                    _this.checkboxs[i].style.background = color instanceof Array ? color[1] : color; //多选框添加背景颜色
                    _this.selectAll("", color instanceof Array ? color[1] : color); //判断是否已经被全部选中，第三个参数与传入的颜色绑定
                }
                if (bg && event === "onclick") {
                    _this.checkboxs[i].style.background = ""; //如果已经被选中，并且是click事件，取消多选框背景
                    // _this.domSelectAll.style.background = ""; //取消全选按钮背景
                    _this.selectAll();
                }

                //改变字体颜色及背景颜色
                this.style.color = color instanceof Array ? color[0] : color; //判断是否为数组，如果click事件需要字体颜色和多选框被选中的颜色不一样，就传入数组；如果传入的不是数组是字符串，就直接等于字符串颜色
                this.style.background = colors; //背景颜色始终是一个颜色
            }
        }
    }
    if (event && colors instanceof Array) { //如果colors是数组，那就是onmouseout，则执行下边代码
        for (let i = 0; i < this.domUlList.length; i++) {
            this.domUlList[i][event] = function() {
                const bg = _this.checkboxs[i].style.background;
                if (bg) return; //如果已经被选中，onmouseout不执行
                this.style.color = ""; //字体颜色恢复默认值
                this.style.background = colors[i % num]; //背景颜色恢复初始值，初始值通过传参可知
            }
        }
    }
}

Music.prototype.selectAll = function(event, colors1, colors2) {
    if (!event) { //如果没传event事件，则是被click事件调用，就单纯判定是否被全部选中

        //点击取消判定
        if (this.domSelectAll.style.background) {
            this.domSelectAll.style.background = "";
            return;
        }
        if (!arguments.length) return; //如果没传参，就不执行下边代码

        //点击选中判定
        let num = 0;
        for (let i = 0; i < this.domUlList.length; i++) {
            if (this.checkboxs[i].style.background) num++; //被选中，num++
        }
        if (num === this.domUlList.length) this.domSelectAll.style.background = colors1; //全部被选中，就改变全选按钮颜色
    }
    const _this = this; //存this指针
    this.domSelectAll[event] = function() {
        const arr = []; //创建个用于保存数据的数组arr
        for (let i = 0; i < _this.domUlList.length; i++) {
            if (!_this.checkboxs[i].style.background) arr.push(i); //遍历list，如果没被选中，就push到数组arr里
        }
        if (!arr.length) { //如果数组arr里没有数据，说明list全被选中，就把所有list的选中状态清空
            for (let i = 0; i < _this.domUlList.length; i++) {
                _this.domUlList[i].style.color = "";
                _this.domUlList[i].style.background = colors2[i % 2]; //恢复隔行变色
                _this.checkboxs[i].style.background = "";
                this.style.background = ""; //取消全选按钮背景
            }
            return; //不再执行后边代码
        }

        //如果数组arr里有数据，就遍历数组arr中的数据，添加选中状态。
        for (let i = 0; i < arr.length; i++) {
            _this.domUlList[arr[i]].style.color = colors1[0];
            _this.domUlList[arr[i]].style.background = colors1[1];
            _this.checkboxs[arr[i]].style.background = colors1.length === 3 ? colors1[2] : colors1[0];
            this.style.background = colors1.length === 3 ? colors1[2] : colors1[0];
        }
    }
}

const go = new Music("music", 0);
go.bgColor("", ["#fff", "#aaa"], "", 2);
go.bgColor("onmouseover", "rgb(180,86,113)", "#fff");
go.bgColor("onmouseout", ["#fff", "#aaa"], "", 2);
go.bgColor("onclick", "rgb(180,86,113)", ["#fff", "#000"]);
go.selectAll("onclick", ["#fff", "rgb(180,86,113)", "#000"], ["#fff", "#aaa"]);