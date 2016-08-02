const http = require("http"),
	jade = require("jade");

var members = {
	"AidanDai": 13,
	"zp1996": 14,
	"zhongjin": 14,
	"lsgoSunshine": 14,
	"GiantDwarf": 14,
	"ll": 14,
	"西北苏三": 14,
	"zln": 15,
	"lgc": 15
};
http.createServer((req, res) => {
	res.writeHead(200, {
		"Content-Type": "text/html"
	});
	const html = jade.renderFile("index.jade", {
		author: "zp1996",
		members: members,
		pretty: true
	});

	res.end(html);
}).listen(3000);
console.log("Server is on 3000");