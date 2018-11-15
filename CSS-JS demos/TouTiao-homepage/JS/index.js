class Carousel {
	//构造函数
	constructor(ele, section, btn, arrow) {
		//---------------声明父元素---------------
		this.parent = typeof ele === "string" ? document.querySelector(ele) : ele;

		//---------------声明节点下主要内容，即轮播内容个体，图片或内容页等。通常为类数组---------------
		if (section) {
			this.section = (section => {
				if (typeof section === "string") {
					return document.querySelector(section);
				}
				if (section instanceof Array) {
					if (section[1] === true) {
						return document.querySelectorAll(section[0]);
					}
					throw new Error("Array[1] must be Boolean(true)");
				}
			})(section)
		}

		//---------------声明按钮，通常为类数组---------------
		if (btn) {
			this.btn = (btn => {
				if (typeof btn === "string") {
					return document.querySelector(btn);
				}
				if (btn instanceof Array) {
					if (btn[1] === true) {
						return document.querySelectorAll(btn[0]);
					}
					throw new Error("Array[1] must be Boolean(true)");
				}
			})(btn)
		}

		//---------------声明箭头---------------
		if (arrow) {
			this.arrow = (arrow => {
				if (typeof arrow === "string") {
					return document.querySelector(arrow);
				}
				if (arrow instanceof Array) {
					if (btn[1] === true) {
						return document.querySelectorAll(arrow[0]);
					}
					throw new Error("Array[1] must be Boolean(true)");
				}
			})(arrow)
		}
	}

	//---------------初始化调用，执行轮播---------------
	init() {
		//获取高度
		this.getHeight();
		//限制变量
		let index = 0;
		//滚动事件
		window.onmousewheel = this.throttle(key => {
			if (key.deltaY > 0) {
				if (index < 5) {
					this.carousel(this.parent, "top", -(++index) * this.height, () => {
						this.removeClass(this.btn[index - 1], "active");
						this.addClass(this.btn[index], "active");
						if (index > 1) {
							this.addClass(this.section[index - 1], "in");
						}
						this.removeClass(this.section[index], "in");
					})
				}
			} else {
				if (index > 0) {
					this.carousel(this.parent, "top", -(--index) * this.height, () => {
						this.removeClass(this.btn[index + 1], "active");
						this.addClass(this.btn[index], "active");
						if (index < 4) {
	 						this.addClass(this.section[index + 1], "in");
 						}
						if (index > 0) {
							this.removeClass(this.section[index], "in");
						}
					})
				}
			}
		}, 2000)
		//点击事件
		//按钮点击
		for (let i = 0; i < this.btn.length; i++) {
			this.btn[i].onclick = () => {
				this.carousel(this.parent, "top", -i * this.height, () => {
					this.removeClass(this.btn[index], "active");
					this.addClass(this.btn[i], "active");

					if (index !== 0 && index < 5) {
						this.addClass(this.section[index], "in");
					};
					this.removeClass(this.section[i], "in");

					index = i;
				});
			}
		}
		//箭头点击
		for (let i = 0; i < this.arrow.length; i++) {
			this.arrow[i].onclick = () => {
				this.carousel(this.parent, "top", -(i + 1) * this.height, () => {
					this.addClass(this.btn[i + 1], "active");
					this.removeClass(this.btn[i], "active");
					if (i < 4) {
						this.removeClass(this.section[i + 1], "in");
						if (i) {
							this.addClass(this.section[i], "in");
						};
					}
					index = i + 1;
				})
			}
		}
		// 键盘事件
		// 

	}


	//---------------获取内容高度值，用于动画赋值---------------
	getHeight(ele) {
		ele = ele ? (typeof ele === "string" ? document.querySelector(ele) : ele) : this.parent;
		this.height = (ele => {
			window.onresize = this.debounce(() => {
				this.height = ele.offsetHeight; //因为return是给window.onresize赋值，所以这里用this.height赋值，此时箭头函数this指向构造函数
			}, 500);
			//返回当前值
			return ele.offsetHeight;
		})(ele); //传入当前节点
	}

	carousel(ele, attr, val, callback) {
		//initialization parameter
		ele = (() => {
			if (typeof ele === "string") {
				return document.querySelector(ele);
			}
			return ele;
		})(ele);

		const len = ele.length;

		//Transition
		//If ele is an array of elements,for loop
		if (attr === "opacity") {
			ele.style[attr] = val;
		} else {
			ele.style[attr] = val + "px";
		}

		if (callback) {
			setTimeout(callback,1000);
		}

		//When transition is over,execute function callback
		//fucking terrible
		// let transitions = {
		// 	transition: "transitionend",
		// 	webkitTransition: "webkitTransitionEnd",
		// 	Otransition: "oTransitionEnd",
		// 	MozTransition: "mozTransitionEnd"
		// }
		// for (let prop in transitions) {
		// 	if ((ele[0] ? ele[0] : ele).style[prop] !== undefined) {
		// 		transitions = transitions[prop];
		// 		break;
		// 	}
		// }
		// if (len > 1) {
		// 	for (let i = 0; i < len; i++) {
		// 		if (ele[i][transitions]) return;
		// 		ele[i].addEventListener(transitions, () => {
		// 			callback && callback();
		// 		},false)
		// 	}
		// } else {
		// 	if (ele[transitions]) return;
		// 	ele.addEventListener(transitions, () => {
		// 		callback && callback();
		// 	},false)
		// }
	}

	addClass(ele, className) {
		ele = typeof ele === "string" ? document.querySelector(ele) : ele;
		if (ele.length > 1) {
			for (let i = 0; i < ele.length; i++) {
				ele[i].classList.add(className);
			}
		} else {
			ele.classList.add(className);
		}
	}
	removeClass(ele, className) {
		ele = typeof ele === "string" ? document.querySelector(ele) : ele;
		if (ele.length > 1) {
			for (let i = 0; i < ele.length; i++) {
				ele[i].classList.remove(className);
			}
		} else {
			ele.classList.remove(className);
		}
	}
	debounce(func, wait) {
		let timer = null;
		let args, result;
		let previous = 0;

		const later = () => {
			const remaining = +new Date() - previous;
			if (remaining < wait && remaining >= 0) { //防止修改系统时间出现remaining < 0的情况
				timer = setTimeout(later, wait - remaining);
			} else {
				func.apply(this, args);
				timer = null;
			}
		}

		return () => { //箭头函数，保证this为构造对象
			previous = +new Date();
			args = arguments;
			if (timer === null) timer = setTimeout(later, wait);
			return result;
		}
	}
	throttle(func, wait) {
		let timer = null;
		let result;
		let previous = 0;
		const later = () => {
			previous = 0;
			timer = null;
		}

		return key => {
			const now = +new Date();
			if (previous === 0) previous = now;
			const remaining = wait - (now - previous);
			if (timer === null) {
				timer = setTimeout(later, wait);
				func.call(this, key)
			} else if (remaining > 0 || remaining < wait) { //防止系统时间被修改，所以remaining < wait
				timer = setTimeout(later, remaining);
			}
		}
	}
}

const carousel = new Carousel("main", [".standard-content", true], [".carousel-btn", true], [".guide-arrow", true]);
carousel.init();