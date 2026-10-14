(function(ns){
  var key = document.body.getAttribute('data-page') || 'home';
  var layout = ns.PAGES[key];
  var components = { apk: [], web: [], gallery: [] };
  var lastCheck = {};

  function stepsMarkup(){
    return '<div class="steps">' + ['s1', 's2', 's3'].map(function(step, i){
      return '<div class="step"><span class="step-no">0' + (i + 1) + '</span><div><p><strong data-i18n="' + step + 't"></strong>' +
        '<span data-i18n="' + step + 'd"></span></p></div></div>';
    }).join('') + '</div>';
  }

  function linkCard(item){
    return { node: ns.el('<a class="card" href="' + item.link + '"><div><h2 data-i18n="' + item.title + '"></h2>' +
      '<p data-i18n="' + item.desc + '"></p></div><span class="btn btn-primary" data-i18n="openPage"></span></a>'),
      render: function(){}, load: function(){ return Promise.resolve(); } };
  }

  function createItem(item){
    if (item.link) return linkCard(item);
    if (item.apk){ var apk = ns.createApkCard(item.apk, layout.env); components.apk.push(apk); return apk; }
    var web = ns.createWebCard(item.web, layout.env);
    components.web.push(web);
    return web;
  }

  function buildGroup(group){
    var section = ns.el('<div class="app-section"></div>');
    if (group.title){
      section.appendChild(ns.el('<div class="app-heading"><div class="app-badge">' + group.badge + '</div><h2 data-i18n="' + group.title + '"></h2></div>'));
    }
    if (group.items){
      var grid = ns.el('<div class="card-grid' + (layout.chooser ? ' three' : '') + '"></div>');
      group.items.forEach(function(item){ grid.appendChild(createItem(item).node); });
      section.appendChild(grid);
    }
    (group.galleries || []).forEach(function(spec){
      var gallery = ns.createGallery(spec.key, spec.label, spec.app);
      components.gallery.push(gallery);
      section.appendChild(gallery.node);
    });
    return section;
  }

  function buildFooter(){
    var footer = document.getElementById('page-footer');
    var refresh = components.apk.length
      ? '<p id="last-checked"></p><button class="refresh-btn" id="refresh-btn" type="button">' + ns.iconRefresh + ' <span data-i18n="refresh"></span></button>'
      : '';
    footer.hidden = !refresh && !layout.footer;
    footer.innerHTML = (refresh ? '<div class="footer-row">' + refresh + '</div>' : '') + (layout.footer ? '<p data-i18n="' + layout.footer + '"></p>' : '');
  }

  function renderFooterStatus(){
    var node = document.getElementById('last-checked');
    if (!node) return;
    if (lastCheck.rate) node.textContent = ns.t('rateLimited');
    else if (lastCheck.time) node.textContent = ns.t('lastChecked', { t: lastCheck.time.toLocaleTimeString(ns.locale()) });
    else node.textContent = ns.t('checkingGh');
  }

  function applyLang(){
    var root = document.documentElement;
    root.lang = ns.lang();
    root.dir = ns.lang() === 'ar' ? 'rtl' : 'ltr';
    document.title = ns.t('title_' + key);
    document.getElementById('page-h1').textContent = ns.t('h1_' + key);
    document.getElementById('page-lede').textContent = ns.t('lede_' + key);
    document.getElementById('lang-btn').textContent = ns.t('langBtn');
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n]'), function(n){
      n.textContent = ns.t(n.getAttribute('data-i18n'));
    });
    ['apk', 'web', 'gallery'].forEach(function(kind){ components[kind].forEach(function(c){ c.render(); }); });
    renderFooterStatus();
  }

  function loadApks(manual){
    var refreshBtn = document.getElementById('refresh-btn');
    if (manual && refreshBtn) refreshBtn.classList.add('spinning');
    return Promise.all(components.apk.map(function(card){ return card.load(); })).then(function(results){
      var rateLimited = results.some(function(r){ return r.error === 'errRate'; });
      lastCheck = rateLimited ? { rate: true } : { time: new Date() };
      renderFooterStatus();
    }).then(function(){ if (refreshBtn) refreshBtn.classList.remove('spinning'); });
  }

  function init(){
    var root = document.getElementById('app-sections');
    if (layout.steps) root.appendChild(ns.el(stepsMarkup()));
    layout.groups.forEach(function(group){ root.appendChild(buildGroup(group)); });
    buildFooter();
    document.getElementById('lang-btn').addEventListener('click', function(){
      ns.setLang(ns.lang() === 'ar' ? 'en' : 'ar');
      applyLang();
    });
    applyLang();
    components.web.concat(components.gallery).forEach(function(c){ c.load(); });
    if (!components.apk.length) return;
    loadApks(false);
    document.getElementById('refresh-btn').addEventListener('click', function(){
      components.apk.forEach(function(card){ card.reset(); });
      loadApks(true);
    });
    setInterval(function(){ loadApks(false); }, 90000);
  }

  document.addEventListener('DOMContentLoaded', init);
})(window.Edunex = window.Edunex || {});
