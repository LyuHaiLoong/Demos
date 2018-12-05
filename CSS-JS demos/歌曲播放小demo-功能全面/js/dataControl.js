class DataControl extends Father {
	constructor(add,del){
		super();
		this.addMessage = this.find(add);
		this.delMessage = this.find(del);
	}
	getValue(ele) {
		if (ele instanceof Array && ele[ele.length - 1] !== true) ele = this.find(...ele);
		else if (ele instanceof Array && ele[ele.length - 1] === true) ele = this.find(ele.slice(0,ele.length - 1));
		else ele = this.find(ele);

		if (ele.nodeType) {
			return ele.value;
		}
		else {
			const valueArray = [];
			for (let i in ele) {
				valueArray[i] = this.getValue(ele[i]);
			}
			return valueArray;
		}
	}
	addData(data, title, src, lrc) {
		if (this.compareData(data,title,"title")) {
			alert("歌单中已经存在同名歌曲啦~");
			return 0;
		}
		if (!title || !src || !lrc) {
			alert("请输入正确内容~");
			return 0;
		}
		// data数据类型必须为[{}]
		if (!(data instanceof Array)) throw new Error("The parameter 1 must be Array");
		const obj = {};
		obj.id = data.length; // id值就是data的length - 1;
		obj.title = title;
		obj.src = src;
		obj.lrc = lrc;
		data.push(obj);
		return 1;
	}
	delData(data, val, prop = "id") {
		// data数据类型必须为[{}]
		if (!(data instanceof Array)) throw new Error("The parameter 1 must be Array");

		// clonedata数据源，如果下方num报错，就执行重新赋值，取消之前操作
		const clone = JSON.parse(JSON.stringify(data));

		// flag用于判断是否找到目标
		let flag = true;
		// num用于判断数据中是否只有一个目标值，如果不止1个或者1个都没有就报错
		let num = 0;
		// 保存i，用于循环完后删除目标数据
		let target = -1;
		// 第二个参数可以直接传入对象，那就按对象匹配
		if (val instanceof Object) {
			for (let i = data.length - 1; i >= 0; i--) { // 倒循环，省去删除项后的i++				
				if (data[i] === val) { // 找到目标值
					num++; // 目标数量+1;
					// 如果目标值不止1个，还原数据，然后报错
					if (num > 1) {
						data = clone; // 还原数据
						throw new Error("data error: The target in data is more than 1");
					}

					flag = false; // 已经找到目标值，id--不再执行操作

					target = i;
				}

				if (flag) data[i].id--; // 如果还没找到目标就id--，保持id值与data.length的一致性
			}
		} else {
			// 如果传入的是属性值，就按属性值匹配
			for (let i = data.length - 1; i >= 0; i--) {
				if (data[i][prop] === val) {
					num++;
					if (num > 1) {
						data = clone;
						throw new Error("data error: The target in data is more than 1");
					}

					flag = false;

					target = i;
				}

				if (flag) data[i].id--;
			}
		}

		// 如果一个目标没找到，还原数据，报错
		if (target === -1) {
			data = clone;
			throw new Error("No target");
		}
		data.splice(target, 1); // 删除目标位置的数据值	
	}
	compareData(data,obj,prop) {
		if (!(data instanceof Array)) throw new Error("data must be Array");
		if (obj instanceof Object) obj = obj[prop];  
		for (let val of data) {
			if (val[prop] === obj) return true;
		}
	}
}