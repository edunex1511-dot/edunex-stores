(function(ns){
  var SHOTS_DIR = '../screenshots/';

  // Screenshot strip. `key` is both the folder under /screenshots and the list name in config.json.
  ns.createGallery = function(key, labelKey, appName){
    var node = ns.el('<div class="shots"><h3 class="shots-title" data-i18n="' + labelKey + '"></h3><div class="shots-body"></div></div>');
    var body = node.querySelector('.shots-body');
    var files = null, items = [];
    var layout = /web$/.test(key) ? 'wide' : 'tall';

    function render(){
      if (files === null) return;
      if (!files.length){
        body.innerHTML = '<p class="empty-state">' + ns.esc(ns.t('shotsSoon')) + '</p>';
        return;
      }
      items = files.map(function(file, index){
        return { src: SHOTS_DIR + key + '/' + encodeURIComponent(file), alt: ns.t('shotAlt', { name: ns.t(appName), n: index + 1 }) };
      });
      body.innerHTML = '<div class="shots-strip ' + layout + '">' + items.map(function(item, index){
        return '<button class="shot" type="button" data-index="' + index + '"><img src="' + item.src + '" alt="' + ns.esc(item.alt) + '" loading="lazy"></button>';
      }).join('') + '</div>';
    }

    body.addEventListener('click', function(e){
      var shot = e.target.closest('.shot');
      if (shot) ns.openLightbox(items, Number(shot.getAttribute('data-index')));
    });

    function load(){
      return ns.loadConfig().then(function(config){
        var list = (config.screenshots || {})[key];
        files = Array.isArray(list) ? list.filter(function(f){ return typeof f === 'string' && f; }) : [];
      }).catch(function(){ files = []; }).then(render);
    }

    return { node: node, render: render, load: load };
  };
})(window.Edunex = window.Edunex || {});
