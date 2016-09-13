// 仿照esl语法，简单实现下模板引擎
function tpl2dom (tpl, data) {
	function fn (d) {
		var i, k = [], v = [];
		for (i in d) {
			k.push(i);
			v.push(d[i]);
		}
		return (new Function(k, fn.main)).apply(d, v);
	}
	if (!fn.main) {
		var tpls = tpl.split("<%"),
			len = tpls.length;
		fn.main = `var res = "${tpls[0].replace(/\s/g, '')}";\n`;
		for (var i = 1; i < len; i++) {
			var p = tpls[i].split("%>");
			fn.main += 0x3D === p[0].charCodeAt(0) ? 
													"+(" + p[0].substr(1) + ")" :
													p[0].replace(/\r\n/g, "").trim(); 		
			fn.main += `\nres += "${p[p.length - 1]
																.replace(/\s{2,}/g, '')
																.replace(/\"/g, "\'")
																.replace(/\r\n/g, '')
																.replace(/\n/g, '\\n')
																.replace(/\r/g, '\\n')}"`;
		}
		fn.main += "\nreturn res;";
	}
	return fn;
}
(function () {
	var tpl = document.getElementById("tpl"),
		app = document.getElementById("app"),
		cacheDiv = document.createElement("div");
	function str2dom (str) {
		cacheDiv.innerHTML = "";
		cacheDiv.innerHTML = str;
		return cacheDiv.childNodes[0];
	}
	app.appendChild(str2dom(tpl2dom(tpl.innerHTML)()));
	tpl.parentNode.removeChild(tpl);
})();
