var domain;

function EventHandlers () {}
EventHandlers.prototype = Object.create(null);

// 事件对象构造函数
function EventEmitter () {
	EventEmitter.init.call(this);
}

module.exports = EventEmitter;

// 为兼容低版本下写的node代码,避免改动
EventEmitter.EventEmitter = EventEmitter;

// 是否使用domains模块
EventEmitter.usingDomains = false;

EventEmitter.prototype.domain = undefined;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// 默认事件的最大容量
var defaultMaxListeners = 10;

Object.defineProperty(EventEmitter, "defaultMaxListeners", {
	enumerable: true,
	get: function () {
		return defaultMaxListeners;
	},
	set: function (val) {
		defaultMaxListeners = val;
	}
});

EventEmitter.init = function () {
	this.domain = null;
	// 使用domain模块
	if (EventEmitter.usingDomains) {
		domain = domain || require("domain");
		if (domain.active && !(this instanceof domain.Domain)) {
			this.domain = domain.active;
		}
	}
	if (!this._events || this._events === Object.getPrototyeOf(this)._events) {
		this._events = new EventHandlers();
		this._eventsCount = 0;
	}
	this._maxListeners = this._maxListeners || undefined;
};
EventEmitter.prototype.setMaxListeners = function (n) {
	if (typeof n !== "number" || n < 0 || isNaN(n))
		throw new TypeError("n must be a position number");
	this._maxListeners = n;
	return this;
};
function $getMaxListeners (that) {
	if (that._maxListeners === undefined) 
		return EventEmitter.defaultMaxListeners;
	return that._maxListeners;
}
EventEmitter.prototype.getMaxListeners = function () {
	return $getMaxListeners(this);
};
function emitNone (handler, isFn, self) {
	if (isFn)
		handler.call(self);
	else {
		var len = handler.length;
		var listeners = arrayClone(handler, len);
		for (var i = 0; i < len; i++)
			listeners[i].call(self);
	}
}
function emitOne (handler, isFn, self, arg1) {
	if (isFn)
		handler.call(self, arg1);
	else {
		var len = handler.length;
		var listeners = arrayClone(handler, len);
		for (var i = 0; i < len; i++)
			listeners[i].call(self, arg1);
	}
}
function emitTwo (handler, isFn, self, arg1, arg2) {
	if (isFn)
		handler.call(self, arg1, arg2);
	else {
		var len = handler.length;
		var listeners = arrayClone(handler, len);
		for (var i = 0; i < len; i++)
			listeners[i].call(self, arg1, arg2);
	}
}
function emitThree (handler, isFn, self, arg1, arg2, arg3) {
	if (isFn)
		handler.call(self, arg1, arg2, arg3);
	else {
		var len = handler.length;
		var listeners = arrayClone(handler, len);
		for (var i = 0; i < len; i++)
			listeners[i].call(self, arg1, arg2, arg3);
	}
}
function emitMany (handler, isFn, self, args) {
	if (isFn)
		handler.apply(self, args);
	else {
		var len = handler.length;
		var listeners = arrayClone(handler, len);
		for (var i = 0; i < len; i++)
			listeners[i].apply(self, args);
	}
}
EventEmitter.prototype.emit = function (type) {
	var er, handler, len, args, i, events, domain;
	var needDomainExit = false;
	var doError = type === "error";
	events = this._events;
	if (events) 
		doError = (doError && events.error == null);
	else if (!doError)
		return false;
	domain = this.domain;
	if (doError) {
		er = arguments[1];
		if (!er)
			er = new Error('Uncaught, unspecified "error" event');
		er.domainEmitter = this;
		er.domain = domain;
		er.domainThrown = false;
		domain.emit("error", er);
	} else if (er instanceof Error) {
		throw er;    // 普通的抛出错误异常
	} else {
		var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
		err.context = er;
		throw er;
	}
	return false;
};	
function arrayClone (arr, i) {
	var copy = new Array(i);
	while (i--) 
		copy[i] = arr[i];
	return copy;
}