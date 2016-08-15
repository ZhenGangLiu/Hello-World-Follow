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
	// 发布error事件,并且error事件未被定义
	if (doError) {
		er = arguments[1];
		if (domain) {
			if (!er)
				er = new Error('Uncaught, unspecified "error" event');
			er.domainEmitter = this;
			er.domain = domain;
			er.domainThrown = false;
			domain.emit("error", er);
		}	else if (er instanceof Error) {
			throw er;    // 普通的抛出错误异常
		} else {
			var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
			err.context = er;
			throw er;
		}
		return false;
	} 

	handler = events[type];

	if (!handler)
		return false;

	if (domain && this !== process) {
		domain.enter();
		needDomainExit = true;
	}

	var isFn = typeof handler === "function";
	len = arguments.length;
	// 这样进行函数的发布,是因为可以提升代码效率,节省slice或者apply造成的开销？
	switch (len) {
		case 1:
			emitNone(handler, isFn, this);
			break;
		case 2:
			emitOne(handler, isFn, this, arguments[1]);
			break;
		case 3:
			emitTwo(handler, isFn, this, arguments[1], arguments[2]);
			break;
		case 4:
			emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);	
			break;
		default:
			args = new Array(len - 1);
			for (i = 1; i < len; i++)
				args[i - 1] = arguments[i];
			emitMany(handler, isFn, this, args);
	}
	if (needDomainExit)
		domain.exit();

	return true;
};	

// 订阅事件
function _addListener(target, type, listener, prepend) {
	var m;
	var events;
	var existing;

	if (typeof listener !== "function") 
		throw new TypeError('"listener" argument must be a function');

	events = target._events;
	if (!events) {
		events = target._events = new EventHandlers();
		target._eventsCount = 0;
	} else {
		// 如果有newListner事件,在订阅新事件前触发该事件
		if (events.newListener) {
			target.emit("newListener", type, listener.listener ? listener.listener : listener);
			events = target._events;
		}
		existing = events[type];
	}
	if (!existing) {
		existing = events[type] = listener;
		++target._eventsCount; 
	} else {
		if (typeof existing === "function") {
			existing = events[type] = prepend ? [listener, existing] : [existing, listener];
		} else {
			if (prepend) {
				existing.unshift(listener);
			} else {
				existing.push(listener);
			}
		}
	}

	// 一个事件的处理函数的数量超过其最大容量时,发出警告
	if (!existing.warned) {
		m = $getMaxListeners(target);
		if (m && m > 0 && existing.length > m) {
			existing.warned = true;
      process.emitWarning('Possible EventEmitter memory leak detected. ' +
                    `${existing.length} ${type} listeners added. ` +
                    'Use emitter.setMaxListeners() to increase limit');
		}
	}
	return target;
}

EventEmitter.prototype.addListener = function addListener (type, listener) {
	return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener = function prependListener (type, listener) {
	return _addListener(this, type, listener, true);
};

EventEmitter.prototype.removeListener = function removeListener (type, listener) {
	var list, events, position, i, originalListener;
	if (typeof listener !== "function")
		throw new TypeError('"listener" argument must be a function');
	
	events = this._events;
	if (!events) 
		return this;

	list = events[type];
	if (!list)
		return this;

	if (list === listener || (list.listener && list.listener === listener)) {  // 该事件只有一个待发布函数时
		if (--this._eventsCount === 0)
			this._events = new EventHandlers();
		else {
			delete events[type];
			// 假若有removeListener事件,发布事件
			if (events.removeListener) 
				this.emit("removeListener", type, list.listener || listener);
		}
	} else if (typeof list !== "function") {   // 该事件有多个待发布函数时
		position = -1;
		for (i = list.length; i-- > 0;) {
			if (list[i] === listener || 
					(list[i].listener && list[i].listener === listener)) {
				originalListener = list[i].listener;
				position = i;
				break;
			}
		}

		if (position < 0)
			return this;

		if (list.length === 1) {   // 该事件只有一个待发布函数时
			list[0] = undefined;
			if (--this._eventsCount === 0) {  // 该实例对象只有一个事件
				this._events = new EventHandlers();
				return this;
			} else {
				delete events[type];
			}
		} else{
			spliceOne(list, position);
		}

		if (events.removeListener)
			this.emit("removeListener", type, originalListener || listener);
	}
};

EventEmitter.prototype.removeAllListeners = function removeAllListeners (type) {
	var listeners, events;

	events = this._events;
	if (!events) 
		return this;
	if (!events.removeListener) {
		if (arguments.length === 0) {
			this._events = new EventHandlers();
			this._eventsCount = 0;
		} else if (events[type]) {
			if (--this._eventsCount === 0)
        this._events = new EventHandlers();
      else
        delete events[type];
		}
		return this;
	}

	if (arguments.length === 0) {
		var keys = Object.keys(events);
		for (var i = 0, key; i < keys.length; ++i) {
			key = keys[i];
			if (key === "removeListener") continue;
			this.removeAllListeners(key);
		}
		// 最后在移除removeListener事件
		this.removeAllListeners("removeListener");
		this._events = new EventHandlers();
		this._eventsCount = 0;
		return this;
	}

	listeners = events[type];

	if (typeof listeners === "function") {
		this.removeListener(type, listeners);
	} else if (listeners) {
		// 是数组的话,从后向前移除,并且每移除一个发布一个removeListener事件
		do {
			this.removeListener(type, listeners[listeners.length - 1]);
		} while (listeners[0]);
	}

	return this;
};

// 返回事件的待发布函数数量
EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};
EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount (type) {
	const events = this._events;
	
	if (events) {
		const evlistener = events[type];

		if (typeof evlistener === "function") {
			return 1;
		} else if (evlistener) {
			return evlistener.length;
		}
	}
}

EventEmitter.prototype.listeners = function listeners (type) {
	var evlistener;
	var res;
	var events = this._events;

	if (!events)
		ret = [];
	else {
		evlistener = events[type];
		if (!evlistener) 
			res = [];
		else if (typeof evlistener === 'function')
			ret = [evlistener.listener || evlistener];
		else
			ret = unwrapListeners(evlistener);
	}

	return ret;
};	


// 返回实例对象所有的事件名数组或者一个空数组
EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};

function spliceOne(list, index) {
	for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
		list[i] = list[k];
	list.pop();
}

function arrayClone (arr, i) {
	var copy = new Array(i);
	while (i--) 
		copy[i] = arr[i];
	return copy;
}

function unwrapListeners (arr) {
	const ret = new Array(arr.length);
	for (var i = 0; i < ret.length; ++i) {
		ret[i] = arr[i].listener || arr[i];
	}
	return ret;
}