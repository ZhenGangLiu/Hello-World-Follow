/**
 * 将模板引擎转化为可用dom字符串
 *
 * @param {String} tpl
 * @param {Object} data 数据对象,为键值对形式,键值为数据名  
 * @return {String}
 */
function tpl2dom (tpl, data) {
	var nbspRE = /\s{2,}/g,	
		quotRE = /\"/g,
		main = "";
	function fn (d) {
		var i, keys = [], vals = [];
		for (i in d) {
			keys.push(i);
			vals.push(d[i]);
		}
		return (new Function(keys, main)).apply(d, vals);
	}
	if (!main) {
		var tpls = tpl.split("<%"),
			len = tpls.length;
		main = `var res = "${tpls[0].replace(nbspRE, '').replace(quotRE, "\'")}";\n`;
		for (var i = 1; i < len; i++) {
			var p = tpls[i].split("%>");
			main += 0x3D === p[0].charCodeAt(0) ? 
							`\nres += ${p[0].substr(1)}`: 
							`\n${p[0].replace(/\r\n/g, "").trim()}`; 		
			main += `\nres += "${p[p.length - 1]
							.replace(nbspRE, '')
							.replace(quotRE, "\'")
							.replace(/[\r\n]/g, '')}"`;
		}
		main += "\nreturn res;";
	}
	return data ? fn(data) : fn();
}
var cacheDiv = document.createElement("div"),
	MutationObserver = window.MutationObserver;

/**
 * 将可用dom字符串转为dom节点
 *
 * @param {String} str
 * @return {DOM}
 */
function str2dom (str) {
	cacheDiv.innerHTML = "";
	cacheDiv.innerHTML = str;
	// 由此可看出,模板必须要求有一个父节点
	return cacheDiv.childNodes[0];
}
/**
 * 为对象绑定getter/setter
 *
 * @param {String} str
 * @return {DOM}
 */
function bindObject (obj, vm) {
	var data = {};
	for (var k in obj) {
		Object.defineProperty(data, k, {
			configurable: true,
    	enumerable: true,
			get: function () {
				return obj[k];
			},
			set: function (val) {
				obj[k] = val;
				console.log("data changed", val);
				// 进行dom节点的更新

			}
		});
	}
	return data;
}
function VM (obj) {
	// 初始化
	this.ele = obj.el;
	this.tpl = obj.tpl;
	this.data = bindObject(obj.data, this);
	this.dom = this.render();
}
VM.prototype.render = function () {
	var dom = str2dom(tpl2dom(this.tpl.innerHTML, this.data));
	this.ele.appendChild(dom);	
	app.removeChild(this.tpl);
	return dom;
};
VM.prototype.change = function () {
	// fn();
};
(function () { 
	var tpl = document.getElementById("tpl"),
		app = tpl.parentNode || document.getElementById("app");
	var obj = {
		msg: "Hello World!"
	};
	setTimeout(function () {
		vm.data.msg = "go!go!go!";
	}, 1000);
	var vm = new VM({
		el: app,
		tpl: tpl,
		data: obj
	});
})();