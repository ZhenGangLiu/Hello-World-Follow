const EventEmitter = require("events"),
	events = require("./events"),
	life = new EventEmitter(),
	work = new events();
life.setMaxListeners(20);
// console.log(zp, life);
// zp.on("newListener", type => {
// 	console.log(type + "add a new handle function");
// });
function pull () {
	console.log("git pull");
};
work.on("removeListener", (type, fn) => {
	console.log(`remove ${type} ${fn.name} event`);
})
work.on("git", pull);
work.on("git", () => {
	console.log("git status");
});

console.log(work.listenerCount("git"));

work.removeListener("git", pull);
work.emit("git");
// console.log(zp);
// life.emit("error", "zp1996");
// console.log(new Error("test").context);