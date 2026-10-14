(function(ns){
  // ---- language ----
  var lang = 'en';
  try { lang = localStorage.getItem('edunex_lang') || ''; } catch(e){}
  if (lang !== 'en' && lang !== 'ar') lang = /^ar/i.test(navigator.language || '') ? 'ar' : 'en';

  ns.lang = function(){ return lang; };
  ns.locale = function(){ return lang === 'ar' ? 'ar-u-nu-latn' : 'en'; };
  ns.setLang = function(next){
    lang = next;
    try { localStorage.setItem('edunex_lang', lang); } catch(e){}
  };
  ns.t = function(key, vars){
    var s = ns.strings[lang][key];
    if (s === undefined) s = ns.strings.en[key];
    if (s === undefined) s = key;
    if (vars) Object.keys(vars).forEach(function(k){ s = s.replace('{' + k + '}', vars[k]); });
    return s;
  };

  // ---- dom helpers ----
  var svg = function(path){
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="' + path + '"/></svg>';
  };
  ns.iconDownload = svg('M12 4v11m0 0-4-4m4 4 4-4M5 19h14');
  ns.iconLink = svg('M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5');
  ns.iconRefresh = svg('M20 11a8 8 0 1 0-2.2 5.6M20 5v6h-6');
  ns.iconClose = svg('M6 6l12 12M18 6 6 18');
  ns.skeleton = '<div class="skeleton"><div class="skel-line w60"></div><div class="skel-line w40"></div></div>';

  ns.esc = function(s){
    return String(s).replace(/[&<>"']/g, function(c){
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
    });
  };
  ns.el = function(html){
    var tpl = document.createElement('template');
    tpl.innerHTML = html.trim();
    return tpl.content.firstElementChild;
  };

  // sameTab: APK downloads stay in this tab so Chrome's "keep file?" prompt isn't lost
  // when a new tab closes itself right after the download starts.
  ns.setBtn = function(card, cls, icon, text, href, sameTab){
    var btn = card.querySelector('.btn');
    btn.className = 'btn ' + cls;
    btn.innerHTML = icon + ' ' + ns.esc(text);
    if (!href){
      btn.href = '#'; btn.removeAttribute('target'); btn.setAttribute('tabindex', '-1');
      return;
    }
    btn.href = href; btn.removeAttribute('tabindex');
    if (sameTab){ btn.removeAttribute('target'); btn.removeAttribute('rel'); }
    else { btn.target = '_blank'; btn.rel = 'noopener'; }
  };

  ns.formatBytes = function(bytes){
    if (!bytes && bytes !== 0) return '';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  ns.formatRelative = function(iso){
    var mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    if (mins < 1) return ns.t('justNow');
    var rtf = new Intl.RelativeTimeFormat(ns.locale(), { numeric: 'always' });
    if (mins < 60) return rtf.format(-mins, 'minute');
    var hours = Math.round(mins / 60);
    if (hours < 24) return rtf.format(-hours, 'hour');
    var days = Math.round(hours / 24);
    if (days < 30) return rtf.format(-days, 'day');
    return new Date(iso).toLocaleDateString(ns.locale(), { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // ---- shared config (config.json at the site root; every page is one folder deep) ----
  var configPromise = null;
  ns.loadConfig = function(){
    if (!configPromise){
      configPromise = fetch('../config.json', { cache: 'no-store' }).then(function(res){
        if (!res.ok) throw new Error(res.status);
        return res.json();
      });
    }
    return configPromise;
  };
})(window.Edunex = window.Edunex || {});
