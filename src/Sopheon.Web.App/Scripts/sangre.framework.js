/// <reference path="raphael.js" />
/// <reference path="jquery.scrollTo.js" />
/// <reference path="jquery-1.7.2.js" />

(function (window) {
	// - overrides
	/** extending **/
	Function.prototype._thread = function (milliseconds) {
		setTimeout(this.call(this), milliseconds);
	}
	Function.prototype._start = function (milliseconds, condition) {
		return setInterval(this, milliseconds);
	}
	Function.prototype._while = function (milliseconds, condition) {
		var s = this;
		if (condition.call() == true) {
			s.call(this);
			setTimeout(function () {
				s._while(milliseconds, condition);
			}, milliseconds);
		}
	}

	String.prototype.contains = function (text) {
		return this.indexOf(text) >= 0;
	}
	String.format = function (tmp) {
		var args = arguments;
		return tmp.replace(/{(\d+)}/g, function (match, number) {
			return typeof args[number] != 'undefined'
      ? args[number]
      : match
    ;
		});
	};
	String.prototype.format = function () {
		var args = arguments;
		return this.replace(/{(\d+)}/g, function (match, number) {
			return typeof args[number] != 'undefined'
      ? args[number]
      : match
    ;
		});
	};
	String.prototype.bind = function (subject) {
		var s = this;
		var rex = /[\{][^\}]+[\}]/;
		var idx = 0;
		while (rex.test(s)) {
			var result = rex.exec(s);
			if (result) {
				var r = result[0];
				var ref = r.replace(/[\{\}]+/g, '');
				var val = '';
				if (typeof subject[ref] != 'undefined') {
					val = (subject[ref] === 'function') ? subject[ref]() : subject[ref];
				}
				else {
					try {
						var e = eval(ref);
						val = e === 'function' ? e() : e;
					}
					catch (ex) {
						throw new Error('Badly named binding ' + ref);
					}
				}
				s = s.replace(r, val);
			}
		}
		return s;
	}
	String.prototype.splitByUCase = function () {
		return this.replace(/([A-Z])/g, ' $1');
	}

	window.parseBool = function (str) {
		return str.toString().toLowerCase() == 'true';
	}

	Number.prototype.between = function (a, b) {
		if (typeof a == 'number') {
			return this >= a && this <= b;
		}
		return false;
	};
	Number.prototype._for = function (a, b) {
		if (typeof a == 'number') {
			for (var i = this; i < a; i++) { b.call(this, i); }
		}
		else {
			for (var i = 0; i < this; i++) { a.call(this, i); }
		}
	};
	Date.prototype.clone = function () { return new Date(this.getYear(), this.getMonth(), this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds()); }
	Date.prototype.firstDay = function () { this.setDate(1); return this; }
	Date.prototype.addMonth = function () { this.setMonth(this.getMonth() + 1); return this; }
	Date.prototype.lastDay = function () { this.setMonth(0); return this; }
	Date.prototype.addDay = function (day) { this.setDate(day); return this; }
	Date.prototype.getHour = function () { var hour = this.getHours(); return hour == 0 ? 12 : hour > 12 ? hour - 12 : hour; }
	Date.prototype.getMinute = function () { return this.getMinutes(); }
	Date.prototype.isValid = function () {
		return !isNaN(this.getDate()) || !isNaN(this.getMonth()) || !isNaN(this.getYear()) || !(this.getDate() > 31) || !(this.getYear() < 1900) || !(this.getMonth() > 12);
	}
	Date.prototype.setPeriod = function (period) {
		if (this.getPeriod() != period) {
			if (this.getPeriod() == 'AM') {
				this.setHours(this.getHours() + 12);
			}
			else {
				this.setHours(this.getHours() - 12);
			}
		}
		return this;
	}
	Date.prototype.getPeriod = function () {
		return this.getHours() > 11 ? 'PM' : 'AM';
	}
	Date.fromJson = function (date) {
		return eval('new ' + date.replace(/\//g, ''));
	}
	Date.prototype.getMonthInfo = function () {
		var firstDay = this.clone().firstDay();
		var lastDay = this.clone().addMonth().firstDay().addDay(0);
		var weeks = Math.ceil(((firstDay.getDay() - 1) + lastDay.getDate()) / 7);
		return { firstDay: firstDay, lastDay: lastDay, weeks: weeks };
	}

	Array.prototype.count = function (action) {
		var result = 0;
		for (var i = 0; i < this.length; i++) {
			if (action && action.call(this[i]))
				result++;
			else if (!action) {
				result++;
			}
		}
		return result;
	}
	Array.prototype.where = function (action) {
		var arr = [];
		for (var i = 0; i < this.length; i++) {
			if (action.call(this[i]))
				arr.push(this[i]);
		}
		return arr;
	}
	Array.prototype.first = function (action) {
		var arr = [];
		if (action) {
			for (var i = 0; i < this.length; i++) {
				if (action.call(this[i]))
					arr.push(this[i]);
			}
			return arr.length > 0 ? arr[0] : null;
		}
		return this.length > 0 ? this[0] : null;
	}
	Array.prototype.last = function (action) {
		var arr = [];
		var t = this.reverse();
		if (action) {
			for (var i = 0; i < t.length; i++) {
				if (action.call(t[i]))
					arr.push(t[i]);
			}
			return arr.length > 0 ? arr[0] : null;
		}
		return t.length > 0 ? t[0] : null;
	}
	Array.prototype.select = function (action) {
		var arr = [];
		for (var i = 0; i < this.length; i++) {
			arr.push(action.call(this[i], i));
		}
		return arr;
	};
	Array.prototype._select = function (action) {
		var arr = [];
		for (var i = 0; i < this.length; i++) {
			arr.push(action.call(this[i]));
		}
		return arr;
	};
	Array.prototype.distinct = function () {
		var result = [];
		for (var i = 0; i < this.length; i++) {
			if (!result.contains(this[i])) {
				result.push(this[i]);
			}
		}
		return result;
	};
	Array.prototype.sum = function (action) {
		var result = 0;
		for (var i = 0; i < this.length; i++) {
			result += action ? parseInt(action.call(this[i])) : parseInt(this[i]);
		}
		return result;
	};
	Array.prototype.contains = function (value) {
		for (key in this) {
			if (this[key] == value) {
				return true;
			}
		}
		return false;
	}

	window.sangre = {
		init: function () {
			sangre.inits.select(function () {
				var key = this.key !== undefined ? this.key : 'UNKNOWN';
				if ($.isFunction(this.init)) {
					this.init();
					sangre.event.fire('INIT-{key}'.bind({ key: key }));
				}
				if ($.isArray(this.dependencies)) {
					this.dependencies.select(function () {
						var name = this;
						var r = false;
						var verify = function (val) {
							sangre.m.getP(sangre.m.getOpState('x{id}'.bind({ id: sangre.util.rnd() })))
								.then(function () {
									var f = eval(val.toString());
									r = typeof f != 'undefined';
								});
							return r;
						}
						var s = this;
						if (this.isCritical !== undefined && this.isCritical) {
							name = this.name;
							if (!verify(name)) {
								throw new Error('{key} {dep} validation failed.'.bind({ key: key, dep: name }));
							}
						}
						else if (this.name !== undefined && !verify(this.name)) {
							sangre.sayDebug('dependency', function () {
								sangre.event.fire('DEPENDENCY-CHECK-FAIL-{key}'.bind({ key: s.name !== undefined ? s.name : 'UNKNOWN' }));
							});
						}
						else if (!verify(name)) {
							sangre.sayDebug('dependency', function () {
								sangre.event.fire('DEPENDENCY-CHECK-FAIL-{key}'.bind({ key: name !== undefined ? name : 'UNKNOWN' }));
							});
						}
						else {
							sangre.sayDebug('dependency', function () {
								sangre.event.fire('DEPENDENCY-CHECK-SUCCEEDED-{key}'.bind({ key: name !== undefined ? name : 'UNKNOWN' }));
							});
						}
					});
					sangre.event.fire('INIT-{key}'.bind({ key: this.key !== undefined ? this.key : 'UNKNOWN' }));
				}
			});
		}
		, inits: []
		, sayDebug: function (key, eventcall) {
			if (typeof DEBUG != 'undefine' && typeof DEBUGGERS != 'undefined' && DEBUGGERS[key] !== undefined) {
				eventcall();
			}
		}
	};

	sangre.querystring = {
		strings: []
		, stringsSet: false
		, get: function (key) {
			if (!this.stringsSet) {
				this.parse();
				this.stringsSet = true;
			}
			if (this.strings[key]) {
				return this.strings[key];
			}
			return '';
		}
		, parse: function () {
			var fullstring = window.location.search.substring(1);
			var splitstring = fullstring.split("&");
			var final = [];
			$(splitstring).each(function (idx) {
				var partial = this.split("=");
				final[partial[0]] = partial.length > 1 ? partial[1] : '';
			});
			this.strings = final;
		}
	};
	if (sangre.querystring.get('sWarning') != '') {
		window.DEBUG = true;
		window.DEBUGGERS = {};
		sangre.querystring.get('sWarning').split(',').select(function () {
			window.DEBUGGERS[this] = true;
		});
	}


	// debug
	sangre.debug = {
		init: function () {
			if (typeof DEBUG != 'undefined') {
				sangre.debug.watcher = sangre.debug.getWatcher();
			}
		}
		, getWatcher: function () {
			var getW = function () {
				var w = window.open('', '', 'width=960,height=600,scrollbars=1');
				w.document.write('<h1>Debugging</h1>');
				return w;
			}
			var w = getW();
			sangre.event.debug = function (event, args) {
				try {
					w.document.write('<div style="font-size: 10pt;;"><strong>{event}</strong></div><div style="font-size: 10pt;;">{a}</div>'.bind({ event: event, a: args.join(' ') }));
				}
				catch (ex) {
					w = getW();
					w.document.write('<div style="font-size: 10pt;;"><strong>{event}</strong></div><div style="font-size: 10pt;;">{a}</div>'.bind({ event: event, a: args.join(' ') }));
				}
			}
		}
	};
	// util
	sangre.util = {
		getAttr: function (sel, name, def) {
			var a = $(sel).attr(name);
			a = a === undefined || a.length == 0 ? def : a;
			return a;
		}
		, transforms: {
			func: function (val) {
				return eval(val.toString());
			}
		}
		, getAtts: function (sel, manifestArr) {
			var obj = {};
			var subject = $(sel).length > 0 ? $(sel)[0] : null;
			if (subject == null) { return obj };
			if (subject.value !== undefined) {
				obj.value = subject.value;
			}
			if ($(subject).attr('type') !== undefined && $(subject).attr('type').toLowerCase() == 'checkbox') {
				obj.checked = $(subject).is(':checked');
			}
			if (manifestArr === undefined) return obj;
			manifestArr.select(function () {
				var val = $(subject).attr('data-' + this.key) === undefined || $(subject).attr('data-' + this.key).length == 0 ? this.def : $(subject).attr('data-' + this.key);
				if (this.transform !== undefined) {
					var f = eval(this.transform);
					val = f(val);
				}
				obj[this.key] = val;
			});
			return obj;
		}
		, callIf: function (meth, args) {
			var func = eval(meth);
			if (func !== undefined && $.isFunction(func)) {
				return func.apply(this, args);
			}
			else {
				sangre.event.fire('UTIL-CALLIF-FAIL', meth);
			}
			return '';
		}
		, rnd: function (factor) {
			factor = isNaN(factor) ? 100000 : factor;
			return Math.round(factor * Math.random());
		}
		, setValue: function (sel, name) {
			var r = false;
		}

	};

	// event processing
	sangre.event = {
		init: function () {
			$(window).resize(function () {
				sangre.event.fire(sangre.event.common.RESIZE);
			});
		}
		, key: 'sangre.event'
		, common: { RESIZE: 'WIN-RESIZE' }
		, events: []
		, on: function (options) {
			var s = this;
			options.key.split(' ').select(function () {
				var o = $.extend({ func: function () { }, scope: this, key: 'none', fault: true, source: 'anon' }, options);
				o.key = this;
				var ea = s.get(o.key);
				ea.push(o);
				return o;
			});
		}
		, get: function (eventKey) {
			if (!this.events[eventKey]) {
				this.events[eventKey] = [];
			}
			return this.events[eventKey];
		}
		, debug: function (eventKey, args) {

		}
		, fire: function (eventKey) {
			var args = Array.prototype.slice.call(arguments, 1);
			var arr = this.get(eventKey);
			if ($.isFunction(sangre.event.debug)) {
				sangre.event.debug(eventKey, args);
			}
			$(arr).each(function (idx) {
				var s = this;
				var p = sangre.m.getProcessor(sangre.m.getOpState(eventKey));
				p.then(function () {
					s.func.apply(s.scope, args);
				})
				;
			});
		}
	};
	sangre.inits.push(sangre.event);

	sangre.debug.init();

	// monadic processing
	sangre.m = {
		getProcessor: function (opState, failH, exH) {
			var good = true;
			var final = {
				then: function (action) {
					if (good) {
						try {
							sangre.sayDebug('monad', function () {
								sangre.event.fire('MONAD-THEN', opState.step, opState.key);
							});
							action(opState);
							good = !(opState.state == sangre.m.state.FAIL || opState.state == sangre.m.state.CRASH);
							if (!good) {
								if ($.isFunction(failH)) failH(opState);
								sangre.event.fire('FAIL-' + opState.key, opState);
								sangre.event.fire(sangre.m.events.FAIL, opState);
							}
							else {
								opState.step++;
							}
						}
						catch (ex) {
							opState.crash(ex.message);
							good = false;
							sangre.event.fire('CRASH-' + opState.key, opState);
							sangre.event.fire(sangre.m.events.CRASH, opState);
							if ($.isFunction(exH)) { exH(opState); }
						}
					}
					return final;
				}
			};
			return final;
		}
		, init: function () {
			sangre.m.getP = sangre.m.getProcessor;
		}
		, getOpState: function (key) {
			var c = {
				key: key
				, messages: []
				, state: sangre.m.state.NEW
				, step: 1
				, fail: function (msg) {
					this.state = sangre.m.state.FAIL;
					this.messages.push(msg);
				}
				, crash: function (msg) {
					this.state = sangre.m.state.CRASH;
					this.messages.push(msg);
				}
			};
			return c;
		}
		, state: { NEW: 'NEW', FAIL: 'FAILED', SUCCESS: 'SUCCESS', CRASH: 'CRASH' }
		, events: { CRASH: 'PROCESSOR-CRASH', FAIL: 'PROCESSOR-FAIL' }
		, key: 'sangre.monadic'
	};
	sangre.inits.push(sangre.m);

	// unobtrusive
	sangre.u = {
		init: function () {
			var generalF = function (type) {
				sangre.u.register(sangre.u.getMeth('sangre-' + type, function (sel) {
					$(sel)[type](function (e) {
						var s = this;
						sangre.m.getProcessor(sangre.m.getOpState('sangre-' + type))
							.then(function (r) {
								var f = $(s).attr('data-method');
								f.split(' ').select(function () {
									var t = this;
									var func = eval(t.toString());
									if ($.isFunction(func)) {
										func.call(s, e);
									}
								});
							})
							.then(function (r) {
								sangre.sayDebug('u', function () {
									sangre.event.fire('NORMAL-U-EVENT', type, sel.id, sel.tagName, sel.className);
								});
							});
					});
				}));
			};
			['click', 'focus', 'blur', 'mousedown', 'mouseup', 'keypress', 'keydown', 'keyup', 'mouseenter', 'mouseout', 'mousemove', 'change']
				.select(function () {
					generalF(this);
				});
		}
		, key: 'sangre.unobtrusive'
		, register: function (meth) {
			sangre.u.methods.push(meth);
			sangre.event.fire('U-REGISTER', meth);
		}
		, applyFor: function (selector) {
			sangre.u.methods.select(function () {
				var meth = this;
				if (meth.getCls) {
					$(selector).find(this.getCls()).each(function () {
						sangre.u.apply(this, meth);
					});
				}
			});
		}
		, apply: function (selector, meth) {
			$(selector).each(function (idx) {
				var key = 'sangre-set-{key}'.bind({ key: meth.key });
				if ($(this).attr(key)) return;
				$(this).attr(key, true);
				meth.func(this, this);
			});
		}
		, methods: []
		, getMeth: function (key, applyF) {
			return (function () {
				return {
					key: key
					, func: applyF
					, getCls: function () {
						return '.{k}'.bind({ k: this.key });
					}
				};
			})();
		}
	};
	sangre.inits.push(sangre.u);

	// markup
	sangre.ml = {
		init: function () {
			['html', 'append', 'prepend']
				.select(function () {
					var s = this;
					sangre.ml[s] = function (selector, ml) {
						$(selector)[s](ml);
						sangre.u.applyFor(selector);
						sangre.sayDebug('ml', function () {
							sangre.event.fire('ML-{s}-{sel}'.bind({ s: s, sel: selector }), ml);
						});
					}
				});
		}
		, key: 'sangre.ml'
	};
	sangre.inits.push(sangre.ml);

	// ui
	sangre.ui = {
		corner: {
			disps: { TOPRIGHT: 'TR', TOPLEFT: 'TL', BOTTOMRIGHT: 'BR', BOTTOMLEFT: 'BL' }
			, get: function (sel, disp) {
				var c = sangre.ui.corner;
				var r = { x: $(sel).position().left, y: $(sel).position().top };
				if ([c.disps.TOPRIGHT, c.disps.BOTTOMRIGHT].contains(disp)) {
					r.x = r.x + $(sel).width();
				}
				if ([c.disps.BOTTOMLEFT, c.disps.BOTTOMRIGHT].contains(disp)) {
					r.y = r.y + $(sel).height();
				}
				return r;
			}
			, getRelative: function (selFrom, selTo) {
				var c = sangre.ui.corner;
				var posF = $(selFrom).position();
				var posT = $(selTo).position();
				var y = posF.y >= posT.y ? 'BOTTOM' : 'TOP';
				var x = posF.x >= posT.x ? 'LEFT' : 'RIGHT';
				var r = c.get(selFrom, c.disps[y + x]);
				r.disposition = y + x;
				return r;
			}
		}
		, bestSide: {
			disps: { TOP: 'T', BOTTOM: 'B', LEFT: 'L', RIGHT: 'R' }
			, get: function (sel) {

			}
		}
	};

	// msg - todo
	sangre.msg = {
		send: function (sel, cls, msg) {
			alert(msg);
		}
		, sendInfo: function (sel, msg) {
			alert('INFO {m}'.bind({ m: msg }));
		}
		, sendError: function (sel, msg) {
			alert('ERROR {m}'.bind({ m: msg }));
		}
		, sendWarning: function (sel, msg) {
			alert('WARNING {m}'.bind({ m: msg }));
		}
	};

	// ajax
	sangre.jax = {
		send: function (config) {
			config.url = encodeURI(config.url);
			var options = $.extend({ type: 'GET', async: true, cache: false
			, success: function (data) {
				if ($.isFunction(options.successHandler)) options.successHandler.call(scope, data);
				sangre.event.fire(sangre.jax.events.CALL, config.url, config.data);
			}
			, error: function (data) {
				if ($.isFunction(options.errorHandler)) {
					options.errorHandler.call(scope, data);
				}
				sangre.event.fire(sangre.jax.events.EXCEPTION, config.url, data.status);
			}
			}, config);
			var scope = this;
			$.ajax(options);
		}
		, init: function () {

		}
		, key: 'sangre.jax'
		, events: { CALL: 'JAX-CALL', CALLSUCCEEDED: 'JAX-CALLSUCCEEDED', EXCEPTION: 'JAX-EXCEPTION' }
		, manifests: {
			inject: [
					{ key: 'target', def: '' }
					, { key: 'url', def: '' }
					, { key: 'data', def: '' }
					, { key: 'type', def: 'GET' }
					, { key: 'before', def: '' }
					, { key: 'attributes', def: '' }
					, { key: 'after', def: '' }
					, { key: 'onload', def: '' }
					, { key: 'onerror', def: '' }
					, { key: 'onfail', def: '' }
					, { key: 'form', def: '' }
					, { key: 'validate', def: false, transform: 'parseBool' }
					, { key: 'datamethod', def: '' }
					, { key: 'israw', def: false, transform: 'parseBool' }
					, { key: 'loadingmessage', def: 'Loading ...' }
					, { key: 'event', def: 'click' }
				]
		}
	};

	// thread
	sangre.thread = {
		get: function (xconfig) {
			/* example
			var thread = sangre.thread.get({ key: 'cumbia', oncomplete: function () {
			sangre.event.fire('CUMBIA-COMPLETE');
			}, ontimeout: function () {
			sangre.event.fire('CUMBIA-TIMEOUT');
			}, testF: function () {
			return $('#Name').val() == 'stop';
			}, oniterate: function (time) {
			sangre.event.fire('CUMBIA-TIMEOUT', time);
			}
			});
			thread.start();
			*/
			if (sangre.thread.threads[xconfig.key] === undefined) {
				var config = $.extend({ startTime: new Date()
					, key: xconfig.key
					, oncomplete: function () { }
					, ontimeout: function () { }
					, oniterate: function () { }
					, testF: function () { return true; }, timeout: 20000, interval: 1000
				}, xconfig);
				var t = function () {
					var stop = false;
					var runner = function () {
						var fc = sangre.thread.threads[xconfig.key];
						if (!stop && !fc.getConfig().testF() && (new Date()).getTime() - fc.getConfig().startTime.getTime() < fc.getConfig().timeout) {
							fc.getConfig().oniterate((new Date()).getTime() - fc.getConfig().startTime.getTime());
							setTimeout(runner, fc.getConfig().interval);
						}
						else if (fc.getConfig().testF() || stop) {
							fc.getConfig().oncomplete();
						}
						else {
							fc.getConfig().ontimeout();
						}
					}
					var c = {
						id: sangre.util.rnd()
						, key: config.key
						, cancel: function () { stop = true; }
						, config: config
						, touch: function () {
							this.getConfig().startTime = new Date();
						}
						, getConfig: function () {
							return this.config;
						}
						, start: function () { runner(); }
					};
					sangre.thread.threads[xconfig.key] = c;

					return c;
				};
				return t();
			}
			return this.threads[xconfig.key];
		}
		, threads: []
	};

	// general unobtrusive
	sangre.u.extensions = {
		init: function () {
			for (key in this) {
				if (key != 'init') {
					if ($.isFunction(this[key])) {
						var meth = this[key]();
						sangre.u.register(meth);
						sangre.event.fire('EXTENSION-ADDED-{ex}'.bind({ ex: key }));
					}
				}
			}
		}
		, key: 'sangre.extensions'
		, scroll: function () {
			return sangre.u.getMeth('sangre-scroll', function (sel) {
				var config = sangre.util.getAtts(sel, [
					{ key: 'container', def: 'body' }, { key: 'target', def: '' }
					, { key: 'duration', def: 1000, transform: 'parseInt' }, { key: 'target', def: '' }
					, { key: 'meth', def: function () { }, transform: 'eval'}]);
				$(sel).click(function () {
					jQuery.scrollTo.window().queue([]).stop();
					var s = this;
					sangre.m.getProcessor(sangre.m.getOpState('scroll'), function (ex) { }, function (ex) { })
					.then(function (r) {
						$(config.container).scrollTo(config.target, config.duration, {});
						if (config.meth !== undefined) {
							var func = eval(config.meth.toString());
							if ($.isFunction(func)) {
								func.call(s);
							}
						}
					});
				});
			});
		}
		, validate: function () {
			return sangre.u.getMeth('sangre-validate', function (sel) {
				var config = sangre.util.getAtts(sel, [{ key: 'config', def: ''}]);
				if (config.config !== '') {
					$(sel).validate(eval(config.config));
				}
				else
					$(sel).validate();
			});
		}
		, effect: function () {
			return sangre.u.getMeth('sangre-effect', function (sel) {
				var config = sangre.util.getAtts(sel, [{ key: 'effect-target', def: '' }, { key: 'effect-action', def: '' }, { key: 'effect-speed', def: ''}]);
				$(sel).click(function (e) {
					var els = config['effect-target'].split(' ');
					var act = config['effect-action'].split(' ');
					var speed = config['effect-speed'];
					els.select(function (idx) {
						var xel = this.toString();
						if (speed != '') {
							$(xel)[act[idx]](speed);
						}
						else {
							$(xel)[act[idx]]();
						}
					});
				});
			});
		}
		, line: function () {
			return sangre.u.getMeth('sangre-line-connect', function (sel) {
				var config = sangre.util.getAtts(sel, [
					{ key: 'target', def: '' }
					, { key: 'sourceend', def: 'Rectangle' }
					, { key: 'targetend', def: 'Rectangle', transform: 'parseInt' }
					, { key: 'connector', def: 'Straight' }
					, { key: 'curviness', def: 0, transform: 'parseInt' }
					, { key: 'anchorstart', def: 'Continuous' }
					, { key: 'anchorend', def: 'Continuous' }

					]);
				var jP = jsPlumb.getInstance();
				jP.importDefaults({
					Connector: [connector, { curviness: curve}],
					Anchors: [config.anchorstart, config.anchorend],
					Endpoints: [targetsrc, targetend]
				});
				if (sel.id === undefined || sel.id == '') {
					throw new Error('No id specified for line');
				}
				target = target.replace('#', '');
				target.split(' ').select(function () {
					var s = this.toString();
					jP.connect({ source: sel.id, target: s });
				});
			});
		}
		, inject: function () {
			return sangre.u.getMeth('sangre-inject', function (sel) {
				var config = sangre.util.getAtts(sel, sangre.jax.manifests.inject);
				sangre.event.fire(sangre.jax.events.CALL, config);
				var atts = config.attributes.split(' ').select(function () {
					return '{key}={val}'.bind({ key: this, val: $(sel).attr('data-{key}'.bind({ key: this })) });
				}).join('&');
				config.event.split(' ').select(function () {
					$(sel)[config.event](function (e) {
						var scope = this;
						if ((config.validate && $(config.form).valid()) || !config.validate) {
							var data = config.form != '' ? $(config.form).serialize() : config.datamethod != '' ? sangre.util.callIf.call(this, config.datamethod) :
								config.attributes != '' ? atts : '';
							sangre.jax.send({ url: config.url
								, data: data
								, type: config.type
								, successHandler: function (result) {
									sangre.event.fire(sangre.jax.events.CALLSUCCEEDED, config, result);
									sangre.util.callIf.call(scope, config.onload, [result]);
									if (config.israw) {
										sangre.ml.html(config.target, result);
										sangre.util.callIf.call(scope, config.after, [result]);
									}
									else if (result.State == 0 || result.State == 1) {
										sangre.ml.html(config.target, result.HtmlResult);
										sangre.util.callIf.call(scope, config.after, [result]);
									}
									else {
										sangre.util.callIf.call(scope, config.onfail, [result]);
									}
								}
								, errorHandler: function (ex) {
									sangre.util.callIf.call(scope, config.onfail, [ex]);
									sangre.event.fire(sangre.jax.events.EXCEPTION, ex.responseText);
								}
							});
						}
					});
				});
			});
		}
		, trigger: function () {
			return sangre.u.getMeth('sangre-trigger', function (sel) {
				var config = sangre.util.getAtts(sel, [{ key: 'event', def: 'click' }, { key: 'sourceevent', def: 'click' }, { key: 'target', def: ''}]);
				$(sel)[config.sourceevent](function (e) {
					$(config.target)[config.event]();
				});
			});
		}
		, hover: function () {
			return sangre.u.getMeth('sangre-hover', function (sel) {
				var config = sangre.util.getAtts(sel, [{ key: 'subjects', def: '.hoverOnly' }, { key: 'hoverclass', def: 'hover'}]);
				$(sel).find(config.subjects).hide();
				$(sel).mousemove(function (e) {
					$(this).addClass(config.hoverclass);
					$(this).find(config.subjects).show();
				});
				$(sel).mouseout(function (e) {
					$(this).find(config.subjects).hide();
					$(this).removeClass(config.hoverclass);
				});
			});
		}
		, eventChange: function () {
			return sangre.u.getMeth('sangre-event-change', function (sel) {
				var config = sangre.util.getAtts(sel,
					[
						{ key: 'eventkey', def: '' }
						, { key: 'selector', def: '' }
						, { key: 'attribute', def: 'html' }
						, { key: 'processor', def: function (val) { return val; }, transform: 'eval' }
						, { key: 'method', def: function () { } }
					]);
				sangre.event.on({ key: config.eventkey
					, func: function (value) {
						if ($(sel).length == 0) return;
						value = config.processor.call($(sel)[0], value);
						var el = $(sel);
						if (config.selector != '') {
							el = $(sel).find(config.selector);
						}
						if (config.attribute == 'html') {
							sangre.ml.html(el, value);
						}
						else {
							el.attr(config.attribute, value);
						}
						config.method(value, config);
					}
				});
			});
		}
		, dependencies: ['jQuery', { isCritical: false, name: 'jqueryship'}]
	};
	sangre.inits.push(sangre.u.extensions);
	$(document).ready(function () {
		sangre.init();
		sangre.u.applyFor('body');
	});

})(window);