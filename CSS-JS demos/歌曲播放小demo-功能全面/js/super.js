// 公用继承
class Father {
	constructor() {}

	find(x, y = document, i) {
		if (/^\[object (HTMLCollection|NodeList|HTML.+Element)\]$/.test(x.toString())) return x;
		if (typeof x !== "string") {
			if (x instanceof Array) {
				const DOMXArray = [];
				if (y instanceof Array) {
					for (let j = 0; j < x.length; j++) {
						DOMXArray[i] = this.find(x[j], y[j], i); // 还没执行到i判断，所以递归时把i也传参
					}
				} else {
					for (let j = 0; j < x.length; j++) {
						DOMXArray[i] = this.find(x[j], y, i);
					}
				}
				return DOMXArray;
			} else throw new Error("Invalid parameter 1.");
		}
		if (y instanceof Array) {
			if (i !== undefined) {
				y = y[i];
				x = this.find(x, y[i]);
				return x;
			} else {
				if (y.length) {
					const DOMYArray = [];
					for (let i = 0; i < y.length; i++) {
						const _y = this.find(y[i]); // for动态循环，每次循环都重新获取y的length值。改为_y
						DOMArray[i] = this.find(x, _y);
					}
					return DOMArray;
				} else throw new Error("Invalid parameter 2.")
			}
		}
		const flag = y.toString();
		if (flag === y) {
			if (i !== undefined) y = this.find(y)[i];
			else {
				y = this.find(y);
				x = this.find(x, y);
				return x;
			}
		} else if (flag === "[object HTMLCollection]") {
			if (i !== undefined) y = y[i];
			else {
				if (y.length) {
					const HTMLCollectionArray = [];
					for (let i = 0; i < y.length; i++) { // 这种循环写法，运行时间相对更稳定，平均用时更短，性能较好
						// if (!y[i].nodeType) continue; //如果用for-in写的话，HTMLCollection的length会被枚举，同理NodeList也一样。
						// for-of不会枚举length
						HTMLCollectionArray[i] = this.find(x, y[i]);
					}
					return HTMLCollectionArray;
				} else throw new Error("The target node has no parentNode.");
			}
		} else if (flag === "[object NodeList]") {
			if (i !== undefined) y = y[i];
			else {
				if (y.length) {
					const NodeListArray = [];
					for (let i = 0; i < y.length; i++) {
						NodeListArray[i] = this.find(x, y[i])
					}
					return NodeListArray;
				} else throw new Error("The target node has no parentNode.");
			}
		}

		x.replace(/([#.]?)(.+)/, ($0, $1, $2) => {
			switch ($1) {
				case "#":
					x = y.querySelector($0);
					break;
				case ".":
					x = y.getElementsByClassName($2);
					break;
				default:
					x = y.getElementsByTagName($2).length ? y.getElementsByTagName($2) : y.getElementsByName($2);
			}
		})

		return x;
	}
	html(ele, html, boolean) {
		if (ele instanceof Array && ele[ele.length - 1] !== true) ele = this.find(...ele);
		else if (ele instanceof Array && ele[ele.length - 1] === true) ele = this.find(ele.slice(0, ele.length - 1));
		else ele = this.find(ele);

		if (ele.nodeType) {
			if (!boolean) ele.innerHTML = html;
			else ele.innerHTML += html;
		} else {
			if (html instanceof Array) {
				for (let i = 0; i < ele.length; i++) {
					this.html(ele[i], html[i])
				}
			} else {
				for (let i = 0; i < ele.length; i++) {
					this.html(ele[i], html);
				}
			}
		}
	}
	changeStyle(ele, attr, num = "", boolean) { // boolean判断属性是叠加还是赋值
		if (ele instanceof Array && ele[ele.length - 1] !== true) ele = this.find(...ele);
		else if (ele instanceof Array && ele[ele.length - 1] === true) ele = this.find(ele.slice(0, ele.length - 1));
		else ele = this.find(ele);

		// 属性叠加
		if (boolean) {
			if (ele.nodeType) {
				if (attr instanceof Array) {
					if (num instanceof Array) {
						for (let i = 0; i < attr.length; i++) {
							this.changeStyle(ele, attr[i], num[i], boolean);
						}
					} else {
						for (let i = 0; i < attr.length; i++) {
							this.changeStyle(ele, attr[i], num, boolean);
						}
					}
				} else {
					const cur = parseFloat(getComputedStyle(ele)[attr]);
					if (/^opacity$/.test(attr)) ele.style[attr] = cur + num;
					else if (/^(transform|translate|scale|skew|rotate|transition|animation|((background|color|display|visibility)$))/.test(attr)) throw new Error("暂不支持该属性");
					else ele.style[attr] = cur + num + "px";
				}
			} else {
				for (let i = 0; i < ele.length; i++) {
					this.changeStyle(ele[i], attr, num, boolean);
				}
			}
		}
		// 属性赋值
		else {
			if (ele.nodeType) {
				if (attr instanceof Array) {
					if (num instanceof Array) {
						for (let i = 0; i < attr.length; i++) {
							this.changeStyle(ele, attr[i], num[i], boolean);
						}
					} else {
						for (let i = 0; i < attr.length; i++) {
							this.changeStyle(ele, attr[i], num, boolean);
						}
					}
				} else {
					if (/^(transform|translate|scale|skew|rotate|transition|animation|((background|color|opacity|display|visibility)$))/.test(attr)) ele.style[attr] = num;
					else ele.style[attr] = num + (/%|em/.test(num) ? "" : "px");
				}
			} else {
				for (let i = 0; i < ele.length; i++) {
					this.changeStyle(ele[i], attr, num, boolean);
				}
			}
		}
	}
	click(ele, callback, funcName, boolean, stop, prevent, call) {
		if (ele instanceof Array && ele[ele.length - 1] !== true) ele = this.find(...ele);
		else if (ele instanceof Array && ele[ele.length - 1] === true) ele = this.find(ele.slice(0, ele.length - 1));
		else ele = this.find(ele);

		if (ele.nodeType) {
			ele[funcName] = function(ev) {
				if (stop) ev.stopPropagation();
				if (prevent) ev.preventDefault();
				call ? callback.call(this, ev) : callback(ev);
			}
			ele.addEventListener("click", ele[funcName], boolean);
		} else {
			for (let val of ele) {
				this.click(val, callback, funcName, boolean, stop, prevent, call);
			}
		}
	}
	canplaythrough(ele, callback, funcName, boolean, stop, prevent, call) {
		if (ele instanceof Array && ele[ele.length - 1] !== true) ele = this.find(...ele);
		else if (ele instanceof Array && ele[ele.length - 1] === true) ele = this.find(ele.slice(0, ele.length - 1));
		else ele = this.find(ele);
		if (ele.nodeType) {
			ele[funcName] = function(ev) {
				if (stop) ev.stopPropagation();
				if (prevent) ev.preventDefault();
				call ? callback.call(this, ev) : callback(ev);
			}
			ele.addEventListener("canplaythrough", ele[funcName], boolean);
		} else {
			for (let val of ele) {
				this.load(val, callback, funcName, boolean, stop, prevent, call);
			}
		}
	}
	// 事件移除，支持节点事件查找
	removeEvent(ele, event, funcName, boolean) {
	  if (ele instanceof Array && ele[ele.length - 1] !== true) ele = this.find(...ele);
	  else if (ele instanceof Array && ele[ele.length - 1] === true) ele = this.find(ele.slice(0, ele.length - 1));
	  else ele = this.find(ele);

	  const fn = ele[funcName] ? ele[funcName] : funcName;
	  if (ele.nodeType) ele.removeEventListener(event, fn, boolean);
	  else {
	    for (let val of ele) {
	      if (!val.nodeType) this.removeEvent(val, event, funcName, boolean);
	      else {
	        const fn = val[funcName] ? val[funcName] : funcName;
	        val.removeEventListener(event, fn, boolean);
	      }
	    }
	  }

	  // 如果是节点方法，就把节点方法从节点上删除
	  if (fn === ele[funcName]) delete ele[funcName];
	}
}