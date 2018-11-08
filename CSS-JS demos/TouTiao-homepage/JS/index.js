class Carousel {
	//构造函数
	constructor(ele,section,btn,arrow) {
		//---------------声明父元素---------------
		this.parent = typeof ele === "string" ? document.querySelector(ele) : ele;

		//---------------声明节点下主要内容，即轮播内容个体，图片或内容页等。通常为类数组---------------
		if (section) {
			this.section = (section => {
				if (typeof section === "string") { return document.querySelector(section); }
				if (section instanceof Array) {
					if (section[1] === true) { return document.querySelectorAll(section[0]); }
					throw new Error("Array[1] must be Boolean(true)");
				}
			})(secton)	
		}

		//---------------声明按钮，通常为类数组---------------
		if (btn) {
			this.btn = (btn => {
				if (typeof btn === "string") { return document.querySelector(btn); }
				if (btn instanceof Array) {
					if (btn[1] === true) { return document.querySelectorAll(btn[0]); }
					throw new Error("Array[1] must be Boolean(true)");
				}
			})(btn)
		}

		//---------------声明箭头---------------
		if (arrow) {
			this.arrow = (arrow => {
				if (typeof arrow === "string") { return document.querySelector(arrow); }
				if (arrow instanceof Array) {
					if (btn[1] === true) { return document.querySelectorAll(arrow[0]); }
					throw new Error("Array[1] must be Boolean(true)");
				}
			})
		}
	
		//---------------声明索引值，用于轮播跳转及按钮点击跳转---------------
		this.index = 0;
	}

	//---------------初始化调用，执行轮播---------------
	init () {
		//滚动事件
		//点击事件
		//键盘事件
	}


	//---------------获取内容高度值，用于动画赋值---------------
	getHeight(ele) {
		this.height = (ele => {
			//如果传入参数为类数组，多个节点
			if (ele instanceof Array) {
				//创建数组，用于保存结果
				const arr = [];

				//当窗口尺寸被调整时调用
				window.onresize = () => {
					for (let i = 0;i < ele.length;i++) {
						arr[i] = ele[i].offsetHeight;
					}
					this.height = arr; //因为return是给window.onresize赋值，所以这里用this.height赋值，此时箭头函数this指向构造函数
				}

				//返回当前值
				for (let i = 0;i < ele.length;i++) {
					arr[i] = ele[i].offsetHeight;
				}
				return arr;
			}
			//如果不是类数组，单个节点
			else {
				//当窗口尺寸被调整时调用
				window.onresize = () => {
					this.height =  ele.offsetHeight; //因为return是给window.onresize赋值，所以这里用this.height赋值，此时箭头函数this指向构造函数
				}

				//返回当前值
				return ele.offsetHeight;
		}
		})(ele); //传入当前节点
	}

	//---------------添加事件---------------

	//---------------点击事件---------------
	click(ele,attr,val,callback) {}
	//---------------滚动事件---------------
	mousewheel(ele,attr,val,callback) {
		//初始化节点
		ele = (ele => {
			if (ele === window) return ele;
			if (typeof ele === "string") return document.querySelector(ele);
			return ele;
		})(ele)
		//
		if (ele === window) {
			window.onmousewheel = () => {
				// if ()
				this.parent[attr] = val + "px";
			}
		}
	}
	//---------------键盘事件---------------
	keyboard(ele,attr,val,callback) {}
}