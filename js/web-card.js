(function(ns){
  // Link card for a web app (`teacher` | `admin`); the URL comes from config.json.
  ns.createWebCard = function(app, env){
    var pill = env === 'dev' ? 'pill-dev' : 'pill-prod';
    var node = ns.el(
      '<div class="card"><div class="card-top"><span class="pill ' + pill + '" data-i18n="' + (env === 'dev' ? 'envDev' : 'envProd') + '"></span></div>' +
      '<div class="card-body"></div><a class="btn btn-disabled" href="#" tabindex="-1"></a></div>');
    var body = node.querySelector('.card-body');
    var state = { loading: true };

    function render(){
      if (state.loading){
        body.innerHTML = ns.skeleton;
        return ns.setBtn(node, 'btn-disabled', ns.iconLink, ns.t('checking'));
      }
      if (state.error || !state.url){
        body.innerHTML = '<p class="' + (state.error ? 'error-state' : 'empty-state') + '">' + ns.esc(ns.t(state.error ? 'webError' : 'webNotSet')) + '</p>';
        return ns.setBtn(node, 'btn-disabled', ns.iconLink, ns.t(state.error ? 'unavailable' : 'notYet'));
      }
      body.innerHTML = '<div class="build-version">' + ns.esc(ns.t('webTitle_' + app)) + '</div><div class="web-url mono" dir="ltr">' + ns.esc(state.url) + '</div>';
      ns.setBtn(node, 'btn-primary', ns.iconLink, ns.t('openWeb'), state.url);
    }

    function load(){
      return ns.loadConfig().then(function(config){
        var url = (((config[env] || {})[app + 'WebUrl']) || '').trim();
        state = /^https?:\/\//i.test(url) ? { url: url } : {};
      }).catch(function(){ state = { error: true }; }).then(render);
    }

    return { node: node, render: render, load: load };
  };
})(window.Edunex = window.Edunex || {});
