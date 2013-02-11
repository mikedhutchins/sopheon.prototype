/// <reference path="sangre.framework.js" />

(function (window) {
    window.sopheon = {
        init: function () {
            sangre.u.register(sopheon.extensions.addNav());
        }
        , extensions: {
            addNav: function () {
                return sangre.u.getMeth('sopheon-nav', function (sel) {
                    var config = sangre.util.getAtts(sel,
                        [
                            { key: 'nav-target', def: '#primarynavigation' }
                            , { key: 'nav-path', def: '' }
                            , { key: 'nav-keepclasses', def: 'permanent' }
                        ]);
                    $(sel).click(function (e) {
                        var target = config['nav-target'];
                        var url = '/nav?path={p}'.bind({ p: config['nav-path'] });
                        $(target).find('li').each(function (e) {
                            var found = false;
                            var li = this;
                            config['nav-keepclasses'].split(' ')
                                .select(function () {
                                    var cls = this;
                                    if ($(li).hasClass(cls)) {
                                        found = true;
                                    }
                                });
                            if (!found) {
                                $(li).remove();
                            }
                        });
                        if (config['nav-path'] != '') {
                            sangre.jax.send({
                                url: url
                                , successHandler: function (r) {
                                    sangre.ml.append(target, r.toString());
                                }
                                , errorHandler: function (r) {

                                }
                            });
                        }
                    });
                });
            }
        }
        , key: 'sopheon'
    };

    sangre.inits.push(sopheon);

})(window);