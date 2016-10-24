const http = require("http"),
	url = require("url"),
	querystring = require("querystring"),
	staticPath = __dirname,
	student = {
		name: "zp1996",
		age: 20,
		sex: "male"
	};
const routes = {
	jsonp: (req, res, query) => {
		res.writeHead(200, {
			"Content-Type": "application/json;charset=utf-8"
		});
		res.end(`${query.callback}(${JSON.stringify(student)})`);
	},
	cors: (req, res) => {
		var postData = "";
		// 注释下，下面示例后台代码补充在此处
		if (req.method === "OPTIONS") {
			res.writeHead(200, {
				// "Access-Control-Max-Age": 3000,
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Headers": "X-author",
				"Content-Type": "application/json;charset=utf-8"
			});	
			res.end();
			return void 0;		
		} 
		req.on("data", (data) => {
			postData += data;
		});
		req.on("end", () => {
			postData = querystring.parse(postData);
			res.writeHead(200, {
				"Access-Control-Allow-Origin": "*",
				"Content-Type": "application/json;charset=utf-8"
			});
			if (postData.name === student.name &&
  				Number(postData.age) === student.age &&
  				postData.sex === student.sex
				 ) {
				res.end(`yeah！${postData.name} is a good boy~`);
			} else {
				res.end("No！a bad boy~");
			}
		});
	}
}
http.createServer((req, res) => {
	var query = url.parse(req.url, true).query;
	routes[query.page](req, res, query);
}).listen(666);

console.log("server is on http://localhost:666/");