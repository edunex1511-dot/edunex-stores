(function(){
  var REPO = 'edunex1511-dot/edunex-stores';
  var ENV = document.body.getAttribute('data-env'); // 'dev' | 'prod' | null (landing page)

  var T = {
    en: {
      langBtn: 'العربية',
      pageTitle_prod: 'EDUNEX Production Builds',
      pageTitle_dev: 'EDUNEX Development Builds',
      pageTitle_home: 'EDUNEX Stores',
      h1_prod: 'Production builds',
      h1_dev: 'Development builds',
      h1_home: 'EDUNEX app store',
      lede_prod: 'Stable production APKs for the teacher and student apps, plus the teacher production web link. Bookmark this page — when an update is released, come back here and install the new APK over the old one.',
      lede_dev: 'Latest development APKs for the teacher and student apps, plus the teacher dev web link. For testing only — may change often.',
      lede_home: 'Please use the download link you were given.',
      s1t: 'Download', s1d: 'Tap the APK for your app below.',
      s2t: 'Allow installs', s2d: 'Android will ask to allow installs from this source once.',
      s3t: 'Install / update', s3d: 'If Chrome asks “Keep file?”, tap Keep. Then open the file. Installing over an existing app updates it and keeps your data.',
      secApk: 'Android apps',
      secWeb: 'Teacher web app',
      teacher: 'Teacher App', student: 'Student App',
      envDev: 'Dev', envProd: 'Prod',
      checking: 'Checking…',
      dlApk: 'Download APK',
      openWeb: 'Open web app',
      notYet: 'Not available yet',
      unavailable: 'Unavailable',
      noBuild: 'No build published yet. It appears here after the next release.',
      webNotSet: 'The teacher web link hasn’t been set yet.',
      webTitle: 'Teacher web app',
      webError: 'Couldn’t load the web link.',
      errRate: 'GitHub API rate limit hit — try again shortly.',
      errStatus: 'Couldn’t check GitHub (status {n}).',
      errNet: 'Network error reaching GitHub.',
      checkingGh: 'Checking GitHub…',
      lastChecked: 'Last checked {t}',
      rateLimited: 'Some checks were rate-limited — refresh in a minute.',
      refresh: 'Refresh',
      footer: 'iOS builds aren’t distributed this way yet. Admin panel stays web-only.',
      justNow: 'just now'
    },
    ar: {
      langBtn: 'English',
      pageTitle_prod: 'EDUNEX – النسخة الرسمية',
      pageTitle_dev: 'EDUNEX – نسخة التطوير',
      pageTitle_home: 'متجر EDUNEX',
      h1_prod: 'النسخة الرسمية',
      h1_dev: 'نسخة التطوير',
      h1_home: 'متجر تطبيقات EDUNEX',
      lede_prod: 'ملفات APK المستقرة لتطبيقي المعلم والطالب، مع رابط تطبيق المعلم على الويب. احفظ هذه الصفحة في المفضلة — عند صدور تحديث ارجع إليها ثم ثبّت ملف APK الجديد فوق القديم.',
      lede_dev: 'أحدث ملفات APK التجريبية لتطبيقي المعلم والطالب، مع رابط تطبيق المعلم التجريبي على الويب. للاختبار فقط — قد تتغير كثيرًا.',
      lede_home: 'من فضلك استخدم رابط التحميل الذي وصلك.',
      s1t: 'التحميل', s1d: 'اضغط على ملف APK الخاص بتطبيقك في الأسفل.',
      s2t: 'السماح بالتثبيت', s2d: 'سيطلب منك أندرويد السماح بالتثبيت من هذا المصدر مرة واحدة.',
      s3t: 'التثبيت / التحديث', s3d: 'إذا سألك Chrome «الاحتفاظ بالملف؟» اضغط «احتفظ». ثم افتح الملف. التثبيت فوق التطبيق الحالي يحدّثه ويحتفظ ببياناتك.',
      secApk: 'تطبيقات أندرويد',
      secWeb: 'تطبيق المعلم على الويب',
      teacher: 'تطبيق المعلم', student: 'تطبيق الطالب',
      envDev: 'تطوير', envProd: 'رسمي',
      checking: 'جارٍ التحقق…',
      dlApk: 'تحميل APK',
      openWeb: 'فتح تطبيق الويب',
      notYet: 'غير متاح حاليًا',
      unavailable: 'غير متاح',
      noBuild: 'لم يتم نشر نسخة بعد. ستظهر هنا بعد الإصدار القادم.',
      webNotSet: 'لم يتم تحديد رابط تطبيق المعلم على الويب بعد.',
      webTitle: 'تطبيق المعلم على الويب',
      webError: 'تعذّر تحميل رابط الويب.',
      errRate: 'تم تجاوز حد طلبات GitHub — حاول مرة أخرى بعد قليل.',
      errStatus: 'تعذّر الاتصال بـ GitHub (الحالة {n}).',
      errNet: 'خطأ في الشبكة أثناء الاتصال بـ GitHub.',
      checkingGh: 'جارٍ التحقق من GitHub…',
      lastChecked: 'آخر تحقق: {t}',
      rateLimited: 'تم تقييد بعض الطلبات — حدّث الصفحة بعد دقيقة.',
      refresh: 'تحديث',
      footer: 'نسخ iOS غير متاحة بهذه الطريقة حاليًا. لوحة الإدارة تعمل على الويب فقط.',
      justNow: 'الآن'
    }
  };

  var lang = 'en';
  try { lang = localStorage.getItem('edunex_lang') || ''; } catch(e){}
  if (lang !== 'en' && lang !== 'ar') lang = /^ar/i.test(navigator.language || '') ? 'ar' : 'en';

  function t(key, vars){
    var s = (T[lang][key] !== undefined ? T[lang][key] : T.en[key]) || key;
    if (vars) Object.keys(vars).forEach(function(k){ s = s.replace('{' + k + '}', vars[k]); });
    return s;
  }

  var iconDownload = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14"/></svg>';
  var iconLink = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>';
  var skeleton = '<div class="skeleton"><div class="skel-line w60"></div><div class="skel-line w40"></div></div>';

  function esc(s){
    return String(s).replace(/[&<>"']/g, function(c){
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
    });
  }
  function el(html){
    var tpl = document.createElement('template');
    tpl.innerHTML = html.trim();
    return tpl.content.firstElementChild;
  }
  function formatBytes(bytes){
    if (!bytes && bytes !== 0) return '';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
  function locale(){ return lang === 'ar' ? 'ar-u-nu-latn' : 'en'; }
  function formatRelative(iso){
    var mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    if (mins < 1) return t('justNow');
    var rtf = new Intl.RelativeTimeFormat(locale(), { numeric: 'always' });
    if (mins < 60) return rtf.format(-mins, 'minute');
    var hours = Math.round(mins / 60);
    if (hours < 24) return rtf.format(-hours, 'hour');
    var days = Math.round(hours / 24);
    if (days < 30) return rtf.format(-days, 'day');
    return new Date(iso).toLocaleDateString(locale(), { year: 'numeric', month: 'short', day: 'numeric' });
  }

  // ---- state (kept so a language switch re-renders without refetching) ----
  var APPS = ['teacher', 'student'];
  var results = {};      // tag -> { loading } | { empty } | { error } | release
  var webState = { loading: true };
  var lastCheck = { text: null };
  var cards = {};
  var webCard = null;

  function pillClass(){ return ENV === 'dev' ? 'pill-dev' : 'pill-prod'; }

  function buildSections(){
    var root = document.getElementById('app-sections');
    root.innerHTML = '';
    var apk = el('<div class="app-section"><div class="app-heading"><div class="app-badge">APK</div><h2 data-i18n="secApk"></h2></div><div class="card-grid"></div></div>');
    var grid = apk.querySelector('.card-grid');
    APPS.forEach(function(app){
      var tag = app + '-app-' + ENV;
      var card = el(
        '<div class="card">' +
          '<div class="card-top"><span class="pill ' + pillClass() + '" data-i18n="' + app + '"></span>' +
          '<span class="card-meta mono" dir="ltr">' + tag + '</span></div>' +
          '<div class="card-body"></div>' +
          '<a class="btn btn-disabled" href="#" tabindex="-1"></a>' +
        '</div>'
      );
      grid.appendChild(card);
      cards[tag] = card;
      results[tag] = { loading: true };
    });
    root.appendChild(apk);

    var web = el(
      '<div class="app-section"><div class="app-heading"><div class="app-badge web">WEB</div><h2 data-i18n="secWeb"></h2></div>' +
      '<div class="card-grid"><div class="card"><div class="card-top"><span class="pill ' + pillClass() + '" data-i18n="' + (ENV === 'dev' ? 'envDev' : 'envProd') + '"></span></div>' +
      '<div class="card-body"></div><a class="btn btn-disabled" href="#" tabindex="-1"></a></div></div></div>'
    );
    root.appendChild(web);
    webCard = web.querySelector('.card');
  }

  // sameTab: APK downloads stay in this tab so Chrome's "keep file?" prompt isn't lost
  // when a new tab closes itself right after the download starts.
  function setBtn(card, cls, icon, text, href, sameTab){
    var btn = card.querySelector('.btn');
    btn.className = 'btn ' + cls;
    btn.innerHTML = icon + ' ' + esc(text);
    if (href){
      btn.href = href; btn.removeAttribute('tabindex');
      if (sameTab){ btn.removeAttribute('target'); btn.removeAttribute('rel'); }
      else { btn.target = '_blank'; btn.rel = 'noopener'; }
    } else {
      btn.href = '#'; btn.removeAttribute('target'); btn.setAttribute('tabindex', '-1');
    }
  }

  function renderApkCard(tag){
    var card = cards[tag], r = results[tag], body = card.querySelector('.card-body');
    if (r.loading){
      body.innerHTML = skeleton;
      setBtn(card, 'btn-disabled', iconDownload, t('checking'));
    } else if (r.empty){
      body.innerHTML = '<p class="empty-state">' + esc(t('noBuild')) + '</p>';
      setBtn(card, 'btn-disabled', iconDownload, t('notYet'));
    } else if (r.error){
      body.innerHTML = '<p class="error-state">' + esc(t(r.error, r.vars)) + '</p>';
      setBtn(card, 'btn-disabled', iconDownload, t('unavailable'));
    } else {
      var assets = r.assets || [];
      var asset = assets.filter(function(a){ return /\.apk$/i.test(a.name); })[0] || assets[0];
      var notes = (r.body || '').match(/@([0-9a-f]{7,40})/);
      var sha = notes ? notes[1].slice(0, 7)
        : (r.target_commitish && r.target_commitish.length === 40 ? r.target_commitish.slice(0, 7) : null);
      var parts = [];
      if (asset) parts.push('<bdi>' + formatBytes(asset.size) + '</bdi>');
      parts.push(formatRelative(r.published_at));
      var sub = parts.filter(Boolean).join(' · ');
      if (sha) sub += ' · <a class="sha" dir="ltr" href="https://github.com/edunex1511-dot/edunex-flutter/commit/' + sha + '" target="_blank" rel="noopener">' + sha + '</a>';
      body.innerHTML = '<div class="build-version" dir="ltr">' + esc(r.name || r.tag_name) + '</div><div class="build-sub">' + sub + '</div>';
      if (asset) setBtn(card, 'btn-primary', iconDownload, t('dlApk'), asset.browser_download_url, true);
      else { body.innerHTML = '<p class="empty-state">' + esc(t('noBuild')) + '</p>'; setBtn(card, 'btn-disabled', iconDownload, t('notYet')); }
    }
  }

  function renderWeb(){
    var body = webCard.querySelector('.card-body');
    if (webState.loading){
      body.innerHTML = skeleton;
      setBtn(webCard, 'btn-disabled', iconLink, t('checking'));
    } else if (webState.error){
      body.innerHTML = '<p class="error-state">' + esc(t('webError')) + '</p>';
      setBtn(webCard, 'btn-disabled', iconLink, t('unavailable'));
    } else if (!webState.url){
      body.innerHTML = '<p class="empty-state">' + esc(t('webNotSet')) + '</p>';
      setBtn(webCard, 'btn-disabled', iconLink, t('notYet'));
    } else {
      body.innerHTML = '<div class="build-version">' + esc(t('webTitle')) + '</div><div class="web-url mono" dir="ltr">' + esc(webState.url) + '</div>';
      setBtn(webCard, 'btn-primary', iconLink, t('openWeb'), webState.url);
    }
  }

  function renderFooterStatus(){
    var node = document.getElementById('last-checked');
    if (!node) return;
    if (lastCheck.rate) node.textContent = t('rateLimited');
    else if (lastCheck.time) node.textContent = t('lastChecked', { t: lastCheck.time.toLocaleTimeString(locale()) });
    else node.textContent = t('checkingGh');
  }

  function applyLang(){
    var root = document.documentElement;
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    var pageKey = 'pageTitle_' + (ENV || 'home');
    document.title = t(pageKey);
    var h1 = document.getElementById('page-h1'); if (h1) h1.textContent = t('h1_' + (ENV || 'home'));
    var lede = document.getElementById('page-lede'); if (lede) lede.textContent = t('lede_' + (ENV || 'home'));
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n]'), function(n){
      n.textContent = t(n.getAttribute('data-i18n'));
    });
    var lb = document.getElementById('lang-btn'); if (lb) lb.textContent = t('langBtn');
    if (ENV){
      Object.keys(cards).forEach(renderApkCard);
      renderWeb();
      renderFooterStatus();
    }
  }

  function setLang(next){
    lang = next;
    try { localStorage.setItem('edunex_lang', lang); } catch(e){}
    applyLang();
  }

  function loadWebUrl(){
    fetch('../config.json', { cache: 'no-store' }).then(function(r){
      if (!r.ok) throw new Error(r.status);
      return r.json();
    }).then(function(cfg){
      var url = ((cfg[ENV] || {}).teacherWebUrl || '').trim();
      webState = /^https?:\/\//i.test(url) ? { url: url } : {};
    }).catch(function(){
      webState = { error: true };
    }).then(renderWeb);
  }

  function loadAll(manual){
    var refreshBtn = document.getElementById('refresh-btn');
    if (manual) refreshBtn.classList.add('spinning');
    var tags = Object.keys(cards);
    var pending = tags.length;
    var sawRate = false;
    tags.forEach(function(tag){
      fetch('https://api.github.com/repos/' + REPO + '/releases/tags/' + tag, {
        headers: { 'Accept': 'application/vnd.github+json' }
      }).then(function(res){
        if (res.status === 404) return { empty: true };
        if (res.status === 403) { sawRate = true; return { error: 'errRate' }; }
        if (!res.ok) return { error: 'errStatus', vars: { n: res.status } };
        return res.json();
      }).catch(function(){
        return { error: 'errNet' };
      }).then(function(result){
        results[tag] = result;
        renderApkCard(tag);
      }).finally(function(){
        pending -= 1;
        if (pending === 0){
          lastCheck = sawRate ? { rate: true } : { time: new Date() };
          renderFooterStatus();
          if (manual) refreshBtn.classList.remove('spinning');
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    var lb = document.getElementById('lang-btn');
    if (lb) lb.addEventListener('click', function(){ setLang(lang === 'ar' ? 'en' : 'ar'); });
    if (ENV){
      buildSections();
      applyLang();
      loadWebUrl();
      loadAll(false);
      document.getElementById('refresh-btn').addEventListener('click', function(){
        Object.keys(cards).forEach(function(tag){ results[tag] = { loading: true }; renderApkCard(tag); });
        loadAll(true);
      });
      setInterval(function(){ loadAll(false); }, 90000);
    } else {
      applyLang();
    }
  });
})();
