/**
 * 添加图片
 *
 * @param {String} url
 */
function img_tag (url) {
	return `<img src="${url}" />`
}
var tpl = function (){
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
				keys.push(i);      // 参数名
				vals.push(d[i]);   // 参数对应的值
			}
			return (new Function(keys, main)).apply(d, vals);
		}
		if (!main) {
			tpl = tpl.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
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
	var cacheDiv = document.createElement("div");

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
	 * 渲染模板
	 *
	 * @param {DOM} tpl 模板节点
	 * @param {Object} data 模板所需数据
	 * @return {DOM}
	 */
	function render (tpl, data) {
		var dom = str2dom(tpl2dom(tpl.innerHTML, data)),
			parnet = tpl.parentNode;
		parnet.appendChild(dom);	
		parnet.removeChild(tpl);
		return dom;
	};

	return function (ele, data) {
		window.addEventListener && addEventListener('DOMContentLoaded', function() {
		  render(document.querySelector(ele), data);
		});
	}
}();