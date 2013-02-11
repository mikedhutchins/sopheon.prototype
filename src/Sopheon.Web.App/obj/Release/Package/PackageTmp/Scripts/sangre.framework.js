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
						sangre.msg.console('Badly named binding ' + ref);
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
                sangre.msg.console('sangre.framework is initializing: {key}'.bind({ key: key }));
				if ($.isFunction(this.init)) {
					this.init();
					sangre.event.fire('INIT-{key}'.bind({ key: key }));
				}
				if ($.isArray(this.dependencies)) {
					this.dependencies.select(function () {

						var name = this;
						var r = false;
						var verify = function (val) {
							sangre.m.getP(sangre.m.getOpState('{id}'.bind({ id: key })))
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
				sangre.msg.console('sangre.event {key} is now being watched by {source} with {func}'.bind(o));
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
			var allArr = this.get('*');
			if ($.isFunction(sangre.event.debug)) {
				sangre.event.debug(eventKey, args);
			}
			sangre.msg.console("sangre.event fired: {key}".bind({ key: eventKey }));
			var f = function (idx) {
			    var s = this;
			    var p = sangre.m.getProcessor(sangre.m.getOpState(eventKey));
			    p.then(function () {
			        s.func.apply(s.scope, args);
			    })
			    ;
			};
			$(arr).each(f);
			$(allArr).each(f);
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
							sangre.msg.console('sangre-monad crash: key={key} at step={step} with={msg}'.bind({ key: opState.key, step: opState.step, msg: ex.message }));
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
                , getMessages: function () {
                    return c.messages !== undefined && c.messages.length > 0 ? c.messages.join('|') : '';
                }
                , getString: function () {
                    return '<div>key={key}, step={step}, state={state}, msg={getMessages}</div>'.bind(c);
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
							    if (f === undefined) {
							        throw new Error('missing data method on {key}'.bind(r));
							    }
							    sangre.msg.console('sangre-u on {key} call {meth}'.bind({ key: r.key, meth: f }));
								f.split(' ').select(function () {
									var t = this;
									var func = eval(t.toString());
									if ($.isFunction(func)) {
									    func.call(s, e);
									}
									else {
									    throw new Error("data-method {f} was not a valid function or is empty".bind({ f: t }));
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
				sangre.msg.console('{status} {url}'.bind({ status: data.status, url: config.url, c: data.responseText.replace(/[\{\}]+/g, '...') }));
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
					, { key: 'clear', def: '' }
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
			this.initPackage.call(this);
		}
		, initPackage: function (prefix) {
			var s = this;
			for (key in s) {
				if (key != 'init' && key != 'initPackage') {
					if ($.isFunction(s[key]) && (prefix === undefined || key.indexOf(prefix) >= 0)) {
						var meth = s[key]();
						var methkey = key;
						sangre.u.register(meth);
						sangre.event.fire('EXTENSION-ADDED-{pkg}-{key}'.bind({ pkg: s.key === undefined ? 'no-pkg-key' : s.key, key: methkey }));
					}
				}
			}
		}
		, key: 'sangre.extensions'
		, scroll: function () {
			return sangre.u.getMeth('sangre-scroll', function (sel) {
				var config = sangre.util.getAtts(sel, [
					{ key: 'scroll-container', def: 'body' }, { key: 'scroll-target', def: '' }
					, { key: 'scroll-duration', def: 1000, transform: 'parseInt' }
					, { key: 'scroll-meth', def: function () { }, transform: 'eval' }]);
				$(sel).click(function () {
					jQuery.scrollTo.window().queue([]).stop();
					var s = this;
					sangre.m.getProcessor(sangre.m.getOpState('scroll'), function (ex) { }, function (ex) { })
					.then(function (r) {
					    $(config['scroll-container']).scrollTo(config['scroll-target'], config['scroll-duration'], {});
					    if (config['scroll-meth'] !== undefined) {
					        var func = eval(config['scroll-meth'].toString());
							if ($.isFunction(func)) {
								func.call(s);
							}
						}
					});
				});
			});
		}
		, clickNav: function () {
			return sangre.u.getMeth('sangre-click-nav', function (sel) {
				var config = sangre.util.getAtts(sel, [
					{ key: 'nav-url', def: '' }
					]);
				$(sel).click(function(e){
					if (config['nav-url'] != '') {
						document.location = config['nav-url'];
					}
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
										if (config.clear != '') {
											config.clear.split(' ').select(function () {
												var o = this;
												$(o.toString()).html('');
											});
										}
										sangre.msg.sendInfo('...', result);
										sangre.util.callIf.call(scope, config.after, [result]);
									}
									else {
										sangre.util.callIf.call(scope, config.onfail, [result]);
										sangre.msg.sendError('...', result);
									}
								}
								, errorHandler: function (ex) {
									sangre.util.callIf.call(scope, config.onfail, [ex]);
									sangre.event.fire(sangre.jax.events.EXCEPTION, ex.responseText);
									sangre.msg.sendError('...', sangre.msg.getMsgC().msgs.SYSTEMERROR);
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
        , remove: function () {
            return sangre.u.getMeth('sangre-remove', function (sel) {
                var config = sangre.util.getAtts(sel, [{ key: 'target', def: '' }]);
                $(sel).click(function (e) {
                    $(config.target).remove();
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
						{ key: 'event-key', def: '*' }
						, { key: 'event-selector', def: '' }
						, { key: 'event-attribute', def: 'html' }
						, { key: 'event-template', def: '' }
						, { key: 'event-processor', def: function (val) { return val; }, transform: 'eval' }
						, { key: 'event-method', def: function () { } }
					]);

				sangre.event.on({ key: config['event-key']
					, func: function (value) {
						if ($(sel).length == 0) return;
						value = config['event-processor'].call($(sel)[0], value);
						if (config['event-template'] != '') {
							value = config['event-template'].bind(value);
						}
						var stringValue = value;
						if (value.messages !== undefined) {
						    stringValue = value.getString();
						}
						var el = $(sel);
						if (config['event-selector'] != '') {
							el = $(sel).find(config['event-selector']);
						}
						if (config['event-attribute'] == 'prepend') {
						    sangre.ml.prepend(el, stringValue);
						}
						if (config['event-attribute'] == 'append') {
						    sangre.ml.append(el, stringValue);
						}
						if (config['event-attribute'] == 'html') {
						    sangre.ml.html(el, stringValue);
						}
						else {
							el.attr(config['event-attribute'], value);
						}
						config['event-method'](value, config);
					}
				});
			});
		}
		, dependencies: []
	};

	// lists - heavy metal
	sangre.lists = {
		init: function () {
			sangre.u.extensions.initPackage.call(sangre.lists.extensions);
		}
		, getNavConfig: function (sel) {
			var config = sangre.util.getAtts(sel, [
				{ key: 'list-key', def: '' }
				, { key: 'list-pages', def: 1 }
			, { key: 'list-event-trigger', def: 'click' }]);
			config.key = config['list-key'];
			return config;
		}
		, getConfig: function(sel, type){
			var config = sangre.util.getAtts(sel, [
				{ key: 'list-container', def: sel }, { key: 'list-key', def: 'list{n}'.bind({ n: sangre.util.rnd(1000)}) }
				, { key: 'list-current-index', def: 0, transform: 'parseInt' }
				, { key: 'list-total-count', def: 0, transform: 'parseInt' }
				, { key: 'list-horizontal', def: false, transform: 'parseBool' }
				, { key: 'list-page-size', def: 10, transform: 'parseInt' }
				, { key: 'list-sleep', def: 0, transform: 'parseInt' }
				, { key: 'list-filter-form', def: '' }
				, { key: 'list-url', def: '' }]);
			config.type = type;
			config.populateMethod = 'append';
			config.loading = false;
			return config
		}

		, lists: []
		// return the closure that will manage this instance of the list
		, getList: function (sel, config) {
			sangre.msg.console('sangre-lists: found list: {list-key}'.bind(config));
			config.form = $.isFunction(config.form) ? config.form : function(){
				return $(config['list-filter-form']).serialize();
			};
			config.next = $.isFunction(config.next) ? config.next : function(){
				var a = parseInt(config['list-current-index']) + parseInt(config['list-page-size']);
				return a > parseInt(config['list-total-count']) ? parseInt(config['list-current-index']) : a;
			};
			config.prev = $.isFunction(config.prev) ? config.prev : function(){
				var a = parseInt(config['list-current-index']) - parseInt(config['list-page-size']);
				return a < 0 ? 1 : a;
			};
			var c = {
				filter: function () {
					return '{form}&CurrentIndex={next}&PageSize={list-page-size}'.bind(config);
				}
				, canPrev: function () {
					var a = parseInt(config['list-current-index']) - parseInt(config['list-page-size']);
					return a >= 0;
				}
				, canNext: function () {
					var a = parseInt(config['list-current-index']) + parseInt(config['list-page-size']);
					return a <= parseInt(config['list-total-count']);
				}
				, config: config
			};
			sangre.lists.lists[config['list-key']] = c;
			return c;
		}
		, getNavMeth: function (type, sel, ontrigger) {
			return sangre.u.getMeth('sangre-list-' + type, function (sel) {
				var config = sangre.lists.getNavConfig(sel);
				sangre.msg.console('sangre-lists: found nav method: {list-key}'.bind(config));
				$(sel)[config['list-event-trigger']](function (e) {
					var list = sangre.lists.lists[config.key];
					ontrigger(config, list);
				});
			});
		}
		, getMeth: function (type, sel, onlistcomplete, after) {
			return sangre.u.getMeth('sangre-list-' + type, function (sel) {
				var config = sangre.lists.getConfig(sel, type);
				var list = sangre.lists.getList(sel, config);
				config.loading = true;
				config.validate = function (resp) {
					if (config.Subject.TotalRecords == 0) {
						sangre.msg.console('sangre.lists.{type} validation failed because total records was 0.'.bind(config));
					}
				};
				config.get = function () {
					var data = list.filter();
					config.data = data;
					sangre.msg.console('sangre.lists.{type}.paging: {list-key} {list-current-index} sending!'.bind(config));
					sangre.event.fire('{list-key}-preload'.bind(config), config);
					sangre.jax.send({
						url: config['list-url']
						, data: data
						, successHandler: function (response) {
							if (response.State == 0 || response.State == 1) { // it worked
								sangre.ml[config.populateMethod](config['list-container'], response.HtmlResult);
								var listE = response.PagedList;
								config['list-current-index'] = response.Subject.CurrentIndex;
								config['list-total-count'] = response.Subject.TotalRecords;
								config.pageIndex = Math.ceil(response.Subject.CurrentIndex > response.Subject.PageSize ? response.Subject.CurrentIndex / response.Subject.PageSize : 1);
								config.totalPages = Math.ceil(response.Subject.TotalRecords > response.Subject.PageSize ? response.Subject.TotalRecords / response.Subject.PageSize : 1);
								sangre.msg.console('sangre.lists.{type}.paging: {list-key} {list-current-index} finished!'.bind(config));
								if ($.isFunction(onlistcomplete)) {
									onlistcomplete(config, list);
								}
								sangre.event.fire('{list-key}-postload'.bind(config), config);
							}
							config.loading = false;
						}
					});
				};
				after(config, list);
			});
		}
		, extensions: {
			deferred: function (sel) {
				return sangre.lists.getMeth('deferred', sel, function (config, list) {
					if (list.canNext()) {
						setTimeout(function () {
							config.get(config, list);
						}, config['list-sleep']);
					}
				}, function (config, list) {
					config.get();
				});
			}
			, paged: function (sel) {
				return sangre.lists.getMeth('paged', sel, function (config, list) {

				}, function (config, list) {
					config.populateMethod = 'html';
					config.get();
				});
			}
			, lazy: function (sel) {
				return sangre.lists.getMeth('lazy', sel, function (config, list) {
					
				}, function (config, list) {
					var c = config['list-container'];
					var id = 'lazylistinner{key}'.bind(config);
					$(c).html('<div id="{id}"></div>'.bind({ id: id }));
					var inner = '#{i}'.bind({ i: id });
					config['list-container'] = inner;
					config.parent = c;
					$(c).scroll(function (e) {
						var t = $(c).scrollTop() + $(c).height();
						if (!config.loading && list.canNext() && t + 20 > $(inner).height()) {
							config.get();
						}
					});
					config.get();
				});
			}
			, next: function (sel) {
				return sangre.lists.getNavMeth('next', sel, function (config, list) {
					if (list.canNext()) {
						list.filter = function () {
							return '{form}&CurrentIndex={next}&PageSize={list-page-size}'.bind(list.config);
						};
						list.config.get();
					}
				});
			}
			, previous: function (sel) {
				return sangre.lists.getNavMeth('previous', sel, function (config, list) {
					if (list.canPrev()) {
						list.filter = function () {
							return '{form}&CurrentIndex={prev}&PageSize={list-page-size}'.bind(list.config);
						};
						list.config.get();
					}
				});
			}
			, restart: function (sel) {
				return sangre.lists.getNavMeth('restart', sel, function (config, list) {
					if (!list.config.loading) {
						sangre.ml.html(list.config['list-container'], '');
						list.config['list-current-index'] = 0;
						list.config['list-total-count'] = 0;
						list.config.get();
					}
				});
			}
			, clear: function (sel) {

			}
			, key: 'sangre.lists'
		}
		, key: 'sangre.lists'
	};
	sangre.inits.push(sangre.lists);


	// msg
	sangre.message =
		{
		get: function (context, messageSel, msgs) {
			sangre.ml.html(messageSel, '');
			msgs = $.extend(msgs, {
				SYSTEMERROR: 'A serious error has occurred.  If this continues please contact an administrator.'
				, GENERALSAVE: 'Save was successful.'
			});
			var msgC = {
				sendInfo: function (msg, stickyUntil) {
					$(messageSel).removeClass('secondary alert success');
					msgC.send('New', msg, stickyUntil);
				}
			, sendError: function (msg, stickyUntil) {
				msgC.send('Exception', msg, stickyUntil);
			}
			, sendWarning: function (msg, stickyUntil) {
				msgC.send('Failure', msg, stickyUntil);
			}
			, msgs: msgs
			, qCtrl: new __queueController({})
			, messageKeys: []
			, getMsg: function (status, msg, stickyUntil) {
				var scope = this;
				var s = msgC.lookupStatus(status);
				var pid = '{c}_{id}'.bind({ c: context.replace(/[^\w^\d]+/g, '_'), id: msg.replace(/[^\w^\d]+/g, '_') }).toLowerCase();
				var id = '__msg_{id}'.bind({ id: pid });
				msgC.messageKeys.push(id);
				if ($('#' + id).length > 0) {
					$('#' + id).remove();
					$('#' + id).remove();
				}
				var msgMl = '<div id="{id}" class="alert-box {cls} round">{msg}</div>'.bind({ id: id, cls: s.cls, stat: s.title, msg: msg });
				return $.isFunction(stickyUntil) ? {
					send: function () {
						sangre.ml.append(messageSel, msgMl);
						(function () { })._while(1000, stickyUntil, function () {
							$('#' + id).slideUp('fast', function () {
								$('#' + id).remove();
							});
						});
					}
					, status: s
					, msg: msgMl
				} : {
					send: function () {
						sangre.ml.append(messageSel, msgMl);
						var qI = new __queueInfo({
							key: '{c}-PAGEMESSAGE'.bind({ c: context })
							, interval: 200
							, lifespan: 1500
							, onComplete: function () {
								if (s.onFClear) {
									$('#' + id).slideUp('fast', function () {
										$('#' + id).remove();
										$('#' + id).remove();
									});
								}
							}
						});
						scope.qCtrl.queue(qI);
					}
					, status: s
					, msg: msgMl
				};
				return;
			}
			, send: function (status, msg, stickyUntil) {
				if (msg.Messages === undefined) {
					var m = msgC.getMsg(status, msg, stickyUntil);
					m.send();
				}
				else {
					for (key in msg.Messages) {
						var mx = msg.Messages[key];
						if (mx.Message !== undefined && mx.Message != '') {
							var m = msgC.getMsg(mx.State, mx.Message, stickyUntil);
							m.send();
						}
					}
				}
			}
			, clear: function () {
				msgC.messageKeys.select(function () {
					$('#' + this).remove();
				});
			}
			, lookupStatus: function (id) {
				return msgC.statususes[id];
			}
			, statususes: {
				New: { title: 'New', cls: 'alert-success', onFClear: false }
				, 0: { title: 'Succeeded', cls: 'alert alert-success', onFClear: true }
				, 2: { title: 'Failed', cls: 'alert alert-error', onFClear: true }
				, 3: { title: 'Exception', cls: '', onFClear: true }
				, Exception: { title: 'Exception', cls: 'alert alert-error', onFClear: true }
			}
			}
			return msgC;
		}
	, showSystemError: function () {
		var msg = $(this).find('.bigmessage').html();
	}
	}

	sangre.msg = {
		path: function (hasContainer, noContainer) {
			if ($('.messageBox').length > 0) {
				hasContainer(sangre.msg.getMsgC());
			}
			else {
				noContainer();
			}
		}
		, send: function (sel, cls, msg) {
			alert(msg);
		}
	, sendInfo: function (sel, msg) {
		this.path(function (m) {
			m.sendInfo(msg, sangre.msg.infoStickyUntil);
		}, function () {
			sangre.msg.processMsg(msg, 'INFO {m}');
		});
	}
	, ERRORSTICKYUNTIL: 6000
	, INFOSTICKYUNTIL: 3000
	, getMsgC: function () {
		if (sangre.msg.msgC === undefined) {
			sangre.msg.msgC = sangre.message.get('global', '.messageBox', []);
		}
		return sangre.msg.msgC;
	}
	, processMsg: function (msg, template) {
		msg.Messages.select(function () {
			alert(template.bind({ m: this.Message }));
			if (this.Exception !== undefined) {
				sangre.msg.console(this.Exception);
			}
		});
	}
	, sendError: function (sel, msg) {
		this.path(function (m) {
			m.sendError(msg, sangre.msg.ERRORSTICKYUNTIL);
		}, function () {
			sangre.msg.processMsg(msg, 'ERROR {m}');
		});
	}
	, sendWarning: function (sel, msg) {
		this.path(function (m) {
			m.sendError(msg, sangre.msg.INFOSTICKYUNTIL);
		}, function () {
			sangre.msg.processMsg(msg, 'WARNING {m}');
		});
	}
	, console: function () {
		try {
			var r = [];
			for (key in arguments) {
				r.push(arguments[key]);
			}
			console.log(r.join(', '));
		}
		catch (ex) {

		}
	}
	};


	
	sangre.inits.push(sangre.u.extensions);
	$(document).ready(function () {
		sangre.init();
		sangre.u.applyFor('body');
	});

	/*** controller ***/
	function __base(config) {
		if (this.init) {
			this.init(config);
		}
	}
	function __queueInfo(config) { if (this.init) { this.init(config); } }
	__queueInfo.prototype = {
		init: function (config) { for (key in config) { this[key] = config[key]; } }
	, key: null
	, id: -1
	, interval: -1
	, lifespan: 0
	, onComplete: function () { }
	, onInterval: function () { }
	, completedHandlers: []
	};

	function __queue(config) { if (this.init) { this.init(config); } }
	__queue.prototype = {
		init: function (config) { for (key in config) { this[key] = config[key]; } }
	, qIs: []
	, qI: null
	, controller: null
	, interval: 3000
	, intervalId: null
	, finished: false
	, startTime: null, lifespan: 0, initialized: false, launched: false
	, initialize: function (qI) { // first pass
		if (!this.initialized) {
			if (qI.interval > 1000) {
				this.interval = qI.interval;
			}
			this.qIs = [];
			this.qI = qI;
			this.lifespan = qI.lifespan;
			this.initialized = true;
		}
		this.startTime = new Date();
		this.qIs.push(qI);
	}
	, submitQueueInfo: function (qI) {
		this.initialize(qI);
		this.launch();
	}
	, complete: function () {
		var s = this;
		clearInterval(this.intervalId);
		if ($.isFunction(this.qI.onComplete)) {
			this.qI.onComplete.call(this, this.qI);
		}
		$(this.qIs).each(function (idx) {
			if (this != s.qI && $.isFunction(this.onComplete)) {
				this.onComplete.call(s, this);
			}
		});
		this.launched = false;
	}
	, processInterval: function () {
		var s = this;
		var dif = new Date() - this.startTime;
		if (dif > this.lifespan) {
			this.complete();
		}
		if ($.isFunction(this.qI.onInterval)) {
			this.qI.onInterval.call(this, this.qI);
		}
		$(this.qIs).each(function (idx) {
			if (this != s.qI && $.isFunction(this.onInterval)) {
				this.onInterval.call(s, this);
			}
		});
	}
	, launch: function () {
		var s = this;

		if (!this.launched) {
			this.startTime = new Date();
			this.intervalId = setInterval(function () {
				s.processInterval.call(s);
			}, this.interval);
			this.launched = true;
		}
	}
	};
	function __queueController(config) { if (this.init) { this.init(config); } }
	__queueController.prototype = {
		init: function (config) { for (key in config) { this[key] = config[key]; } }
	, queues: []
	, queue: function (qI) {
		if (!this.queues[qI.key]) {
			this.create(qI);
		}
		var q = this.queues[qI.key]; // get the queue
		q.submitQueueInfo(qI); // submit the queue for processing
		q.launch();
	}
	, create: function (qI) {
		var q = new __queue();
		this.queues[qI.key] = q;
	}
	}


})(window);