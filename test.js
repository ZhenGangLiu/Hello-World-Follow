const EventEmitter = require("events"),
	events = require("./events"),
	life = new EventEmitter(),
	work = new EventEmitter();
// life.setMaxListeners(20);

// console.log(zp, life);
// zp.on("newListener", type => {
// 	console.log(type + "add a new handle function");
// });
function pull () {
	console.log("git pull");
};
// work.on("removeListener", (type, fn) => {
// 	console.log(`remove ${type} ${fn.name} event`);
// });
work.once("git", pull);
work.on("git", () => {
	console.log("git status");
});
work.emit("git");
console.log("第二次");
work.emit("git");

// console.log(zp);
// life.emit("error", "zp1996");
// console.log(new Error("test").context);
