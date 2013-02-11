/// <reference path="sangre.framework.js" />
(function (window) {
	sangre.bootstrap = {
		modal: {
			applyClose: function (sel, config) {
				$(sel).click(function (e) {
					var mid = '#{modal-id}'.bind(config);
					sangre.bootstrap.modal.close(mid);
				});
			}
			, apply: function (sel, config) {
				$(sel).click(function (e) {
					sangre.bootstrap.modal.buildBaseModalForm(config);
					sangre.jax.send({ url: config.url
						, successHandler: function (r) {
							var mid = '#{modal-id}'.bind(config);
							if (typeof r.HtmlResult === 'undefined') {
								sangre.ml.html('#{modal-id} > .modal-body'.bind(config), r.bind(config));
							}
							else {
								sangre.ml.html('#{modal-id} > .modal-body'.bind(config), r.HtmlResult.bind(config));
							}
							var m = $(mid).modal({ backdrop: true, keyboard: config.escape, show: true });
							m.css({ 'margin-left': function () { return -($(this).width() / 2); } });

							if ($(mid).find('.modal-footer-content').length > 0) {
								sangre.ml.html($(mid).find('.modal-footer'), $(mid).find('.modal-footer-content').html());
							}
							else if (config.footer != '') {
								sangre.ml.html($(mid).find('.modal-footer'), $(config.footer).html());
							}
							config.load(r);
							$(mid).find('.btn-save').click(function (e) {
								if ($.isFunction(config.save)) {
									config.save(config, r);
								}
								sangre.bootstrap.modal.close(mid);
							});
						}
						, errorHandler: function (r) {
							sangre.msg.sendError('', 'A system error has occurred.');
						}
					});
				});
			}
			, close: function(mid) {
				$(mid).modal('hide');
				$(mid).remove();
			}
			, buildBaseModalForm: function (config) {
				// copy the template
				var ml = $('#__modalTemplate').html();
				sangre.ml.append('#__modalBuffer', ml.toString().bind(config));
			}
		}
	};

	sangre.u.extensions.modal = function () {
		return sangre.u.getMeth('bootstrap-modal', function (sel) {
			var config = sangre.util.getAtts(sel,
					[
						{ key: 'url', def: '' }
						, { key: 'header', def: '' }
						, { key: 'class', def: '' }
						, { key: 'footer', def: '' }
						, { key: 'escape', def: true, transform: 'parseBool' }
						, { key: 'load', def: function () { }, transform: 'eval' }
						, { key: 'save', def: function () { }, transform: 'eval' }
						, { key: 'modal-id', def: 'modal_{id}'.bind({ id: sangre.util.rnd(100) }) }
					]);
			sangre.bootstrap.modal.apply(sel, config);
		});
	};

	sangre.u.extensions.modalClose = function () {
		return sangre.u.getMeth('bootstrap-close-modal', function (sel) {
			var config = sangre.util.getAtts(sel,
					[
						{ key: 'modal-id', def: '' }
					]);
			sangre.bootstrap.modal.applyClose(sel, config);
		});
	};
	window.test = function (r) { alert(r); }
})(window);