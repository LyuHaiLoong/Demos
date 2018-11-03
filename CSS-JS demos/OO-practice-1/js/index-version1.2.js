//设计思路
//尽量解耦，形参为主，并通过对参数类型及事件类型的判断，执行不同的操作
//version-1.1
/* 实现效果：
        1、bgColor：1)通过控制event及num是否传入，判定是否为隔行变色行为。并通过判断colors是否为字符串，颜色统一时，直接等于colors;
		    2)通过传入数组类型colors，执行onmouseout事件。缺点——如果没有隔行变色，也要传入数组;
		    3)通过传入字符串类型colors(li标签背景颜色)，并判定event是否为onclick，执行onclick事件。并在onclick事件中添加选择事件；
		    4)通过传入字符串类型colors(li标签背景颜色)，event非onclick事件，执行期望的颜色效果，此例主要为onmouseover。并在事件中添加判定，如果被选中，不执行代码效果;
		    5)通过传入字符串类型colors(li标签背景颜色)，并在此基础上判定color(li标签字体颜色与多选框被选中状态背景颜色)类型，实现li标签字体颜色与多选框被选中状态背景颜色是否一致。color为字符串则颜色一致，color为数组则颜色不一致;

	2、selectorAll： 1)通过控制event是否传参，判定是事件调用，还是选中状态判定调用。此例中用于onclick事件判定li标签是否全被选中;
		         2)通过控制color1的数组的第三个元素是否写入，判断被选中状态下，li标签字体颜色与多选框背景颜色是否一致;
*/

/*总结： 
      1、通过判断参数，执行不同操作;
      2、通过判断li标签是否被选中，打断其他事件的执行;
      3、通过操作数组arr，仅给没被选中的li标签添加选中状态，减少循环执行次数;
      4、函数判断仍不够智能，实现方法仍可以优化，因为对其他人代码review较少，掌握的方法及应用场景的实施仍缺乏思考;
      5、逻辑依赖于形参的输入，不知道是否符合实际应用;
*/


//version-1.2
/*优化内容： 
        1、bgColor：1)优化num传参，绑定到对象属性，除了隔行变色，其他事件不再需要传入num，共享num值;
                    2)优化onmouseout事件，由于num及colors的共享，不再需要传入事件之外的其他参数;
            
        2、selectorAll：1)优化num传参，直接调用对象属性，不再传参;
                        2)优化li选中判断，增加对象属性flag，选中++，取消选中--，通过判断flag === li的个数，切换选中状态;
*/

/*总结： 
      1、提取公用属性num，直接提升为对象属性。除了重新初始化li背景色，其他方法不再传入num参数;
      2、保存初始化的li背景色，使mouseout事件不再需要传入背景色参数;因为num及colors的共享，调用mouseout时，只需传入事件参数;
      3、考虑到mouseover、click事件以及selectAll方法间的颜色不一定相同，所以仍采用传参形势调用，减少关联性;
*/

function Music(cla, i) {
    //目标节点
    this.dom = document.getElementsByClassName(cla)[i];
    //获取列表
    // this.domUl = document.getElementById("list"); //获取id，只能用document做前缀？？
    this.domUlList = this.dom.getElementsByTagName("li");
    this.checkboxs = this.dom.getElementsByTagName("div");
    //获取按钮
    // this.domSelect = this.dom.querySelector(".select");
    this.domSelectAll = this.dom.querySelector(".selectAll");
    this.num = 1; //初始化隔行变色行数，默认为1，即颜色均相同
    this.flag = false; //li被选中计数
}

//封装鼠标事件
Music.prototype.bgColor = function(event, colors, color, num) { //4个形参，event事件，colors用于li标签背景，num用于隔行变色行数，color用于li标签字体颜色以及多选框背景——colors和color的逻辑可以组合替换
    const _this = this; //存this指针

    //隔行变色
    if (!event && num) { //如果没有event事件，并且num有值的话,则判定为隔行变色
        this.num = num; //调用隔行变色，则改变num值
        this.colors = colors; //调用隔行变色，才添加this.colors属性
        for (let i = 0; i < this.domUlList.length; i++) {
            this.domUlList[i].style.background = typeof colors === "string" ? colors : colors[i % num]; //判断colors是字符串还是数组，如果是字符串直接等于colors，如果是数组就通过num取余添加背景色。实现如果背景颜色统一，直接传入字符串即可
        }
        return; //打断代码执行
    }

    //click及mouseover
    if (event && typeof colors === "string" || color instanceof Array) { //如果事件存在，colors是字符串或者color是数组的话
        for (let i = 0; i < this.domUlList.length; i++) {
            this.domUlList[i][event] = function() { //给每个li添加事件
                const bg = _this.checkboxs[i].style.background;
                if (bg && event === "onmouseover") return; //如果已经被选中，但是是onmouseover事件，不执行代码
                if (!bg && event !== "onmouseover") { //如果li没被选中，并且不是onmouseover事件的话，执行代码
                    _this.checkboxs[i].style.background = color instanceof Array ? color[1] : color; //多选框添加背景颜色
                    _this.flag++;
                    _this.selectAll("", color instanceof Array ? color[1] : color); //判断是否已经被全部选中，第二个参数与传入的颜色绑定
                }
                if (bg && event !== "onmouseover") {
                    _this.checkboxs[i].style.background = ""; //如果已经被选中，并且是click事件，取消多选框背景
                    _this.flag--;
                    _this.selectAll(); //取消全选按钮背景
                }

                //改变字体颜色及背景颜色
                this.style.color = color instanceof Array ? color[0] : color; //判断是否为数组，如果click事件需要字体颜色和多选框被选中的颜色不一样，就传入数组；如果传入的不是数组是字符串，就直接等于字符串颜色
                this.style.background = colors; //背景颜色始终是一个颜色
            }
        }
    }

    //mouseout
    if (event && arguments.length === 1) { //如果只传入了一个事件参数，则判定为onmouseout
        if (!this.colors) { //如果未初始化隔行变色
            for (let i = 0; i < this.domUlList.length; i++) {
                this.domUlList[i][event] = function() {
                    if (_this.checkboxs[i].style.background) return; //如果已经被选中，onmouseout不执行
                    this.style.color = ""; //字体颜色恢复默认值
                    this.style.background = ""; //背景颜色恢复初始值
                }
            }
        } else { //如果隔行变色
            for (let i = 0; i < this.domUlList.length; i++) {
                this.domUlList[i][event] = function() {
                    if (_this.checkboxs[i].style.background) return; //如果已经被选中，onmouseout不执行
                    this.style.color = ""; //字体颜色恢复默认值
                    this.style.background = _this.colors[i % _this.num] //背景颜色恢复初始值
                }
            }
        }
    }
}

//封装全选事件
Music.prototype.selectAll = function(event, colors) { //event事件，colors为数组时表示li字体颜色、背景颜色及多选框背景颜色 || colors为单纯一个颜色值时表示全选按钮的背景颜色
    if (!event) { //如果没传event事件，则是被click事件调用，就单纯判定是否被全部选中

        //点击取消判定
        if (this.domSelectAll.style.background) {
            this.domSelectAll.style.background = "";
            return;
        }
        if (!arguments.length) return; //如果没传参，就不执行下边代码

        //点击选中判定
        if (this.flag === this.domUlList.length) this.domSelectAll.style.background = colors; //全部被选中，就改变全选按钮颜色
        return; //打断执行
    }

    const _this = this; //存this指针
    this.domSelectAll[event] = function() {
        if (_this.flag === _this.domUlList.length) { //说明li全被选中，就把所有li的选中状态清空
            for (let i = 0; i < _this.domUlList.length; i++) {
                _this.domUlList[i].style.color = "";
                _this.domUlList[i].style.background = _this.colors ? _this.colors[i % _this.num] : ""; //恢复隔行变色
                _this.checkboxs[i].style.background = "";
                this.style.background = ""; //取消全选按钮背景
            }
            _this.flag = !_this.flag; //flag取反，恢复默认值false
            return; //不再执行后边代码
        }

        const arr = [];
        for (let i = 0; i < _this.domUlList.length; i++) {
            if (!_this.checkboxs[i].style.background) arr.push(i); //遍历li，如果没被选中，就push到数组arr里
        }

        //就遍历数组arr中的数据，添加选中状态
        for (let i = 0; i < arr.length; i++) {
            _this.domUlList[arr[i]].style.color = colors[0];
            _this.domUlList[arr[i]].style.background = colors[1];
            _this.checkboxs[arr[i]].style.background = colors.length === 3 ? colors[2] : colors[0];
            this.style.background = colors.length === 3 ? colors[2] : colors[0];
        }
        _this.flag = _this.domUlList.length; //flag = li的个数，即falg = 全选个数
    }
}

const go = new Music("music", 0);
go.bgColor("", ["#fff", "#aaa"], "", 2); //隔行变色,修改this.num值
go.bgColor("onmouseover", "rgb(180,86,113)", "#fff"); //添加onmouseover事件，传入li背景颜色和字体颜色
go.bgColor("onmouseout"); //添加onmouseout事件，由于背景色的共享，不再传入其余参数
go.bgColor("onclick", "rgb(180,86,113)", ["#fff", "#000"]); //添加click事件，传入li背景颜色、字体颜色及多选框背景颜色
go.selectAll("onclick", ["#fff", "rgb(180,86,113)", "#000"]); //全选事件，传入li字体颜色、背景颜色及多选框背景颜色
