(function(ns){
  var SHOTS_DIR = '../screenshots/';

  // Screenshot strip. `key` is both the folder under /screenshots and the list name in config.json.
  ns.createGallery = function(key, labelKey, appName){
    var node = ns.el('<div class="shots"><h3 class="shots-title" data-i18n="' + labelKey + '"></h3><div class="shots-body"></div></div>');
    var body = node.querySelector('.shots-body');
    var files = null;
    var layout = /web$/.test(key) ? 'wide' : 'tall';

    function render(){
      if (files === null) return;
      if (!files.length){
        body.innerHTML = '<p class="empty-state">' + ns.esc(ns.t('shotsSoon')) + '</p>';
        return;
      }
      body.innerHTML = '<div class="shots-strip ' + layout + '">' + files.map(function(file, index){
        var src = SHOTS_DIR + key + '/' + encodeURIComponent(file);
        var alt = ns.t('shotAlt', { name: ns.t(appName), n: index + 1 });
        return '<a class="shot" href="' + src + '" target="_blank" rel="noopener">' +
          '<img src="' + src + '" alt="' + ns.esc(alt) + '" loading="lazy"></a>';
      }).join('') + '</div>';
    }

    function load(){
      return ns.loadConfig().then(function(config){
        var list = (config.screenshots || {})[key];
        files = Array.isArray(list) ? list.filter(function(f){ return typeof f === 'string' && f; }) : [];
      }).catch(function(){ files = []; }).then(render);
    }

    return { node: node, render: render, load: load };
  };
})(window.Edunex = window.Edunex || {});
