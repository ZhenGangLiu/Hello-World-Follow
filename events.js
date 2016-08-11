// 事件对象构造函数
function EventEmitter () {
	EventEmitter.init.call(this);
}

module.exports = EventEmitter;

// 为兼容低版本下写的node代码,避免改动
EventEmitter.EventEmitter = EventEmitter;