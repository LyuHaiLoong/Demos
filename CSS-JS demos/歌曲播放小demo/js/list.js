class List extends Father {
	constructor(dom,list, add, del) {
		super();
		this.dom = this.find(list);
		this.list = this.find(list);
		this.add = this.find(add);
		this.del = this.find(del);
	}
	dblclick(ele, callback, funcName, boolean, stop, prevent, call) {
		if (ele instanceof Array && ele[ele.length - 1] !== true) ele = this.find(...ele);
		else if (ele instanceof Array && ele[ele.length - 1] === true) ele = this.find(ele);
		else ele = this.find(ele);

		if (ele.nodeType) {
			ele[funcName] = function(ev) {
				if (stop) ev.stopPropagation();
				if (prevent) ev.preventDefault();
				call ? callback.call(this, ev) : callback(ev);
			}
			ele.addEventListener("dblclick", ele[funcName], boolean);
		} else {
			for (let val of ele) {
				this.dbclick(val, callback, funcName, boolean, stop, prevent, call);
			}
		}
	}
}