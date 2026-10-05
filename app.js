(function(){
  var REPO = 'edunex1511-dot/edunex-stores';
  var ENV = document.body.getAttribute('data-env'); // 'dev' | 'prod'
  var ENV_DEF = {
    dev:  { label: 'Dev',  pillClass: 'pill-dev' },
    prod: { label: 'Prod', pillClass: 'pill-prod' }
  }[ENV];
  var APPS = [
    { key: 'teacher', label: 'Teacher App', letter: 'T' },
    { key: 'student', label: 'Student App', letter: 'S' }
  ];

  var iconDownload = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14"/></svg>';
  var iconLink = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>';

  function el(html){
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }
  function esc(s){
    return String(s).replace(/[&<>"']/g, function(c){
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
    });
  }
  function formatBytes(bytes){
    if (!bytes && bytes !== 0) return '';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
  function formatRelative(iso){
    var mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return mins + ' min ago';
    var hours = Math.round(mins / 60);
    if (hours < 24) return hours + (hours === 1 ? ' hour ago' : ' hours ago');
    var days = Math.round(hours / 24);
    if (days < 30) return days + (days === 1 ? ' day ago' : ' days ago');
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }
  var skeleton = '<div class="skeleton"><div class="skel-line w60"></div><div class="skel-line w40"></div></div>';

  function buildSections(){
    var root = document.getElementById('app-sections');
    root.innerHTML = '';
    var cardRefs = {};

    var section = el(
      '<div class="app-section">' +
        '<div class="app-heading"><div class="app-badge">APK</div><h2>Android apps</h2></div>' +
        '<div class="card-grid"></div>' +
      '</div>'
    );
    var grid = section.querySelector('.card-grid');
    APPS.forEach(function(app){
      var tag = app.key + '-app-' + ENV;
      var card = el(
        '<div class="card">' +
          '<div class="card-top"><span class="pill ' + ENV_DEF.pillClass + '">' + app.label + '</span>' +
          '<span class="card-meta mono">' + tag + '</span></div>' +
          '<div class="card-body">' + skeleton + '</div>' +
          '<a class="btn btn-disabled" href="#" tabindex="-1">' + iconDownload + ' Checking…</a>' +
        '</div>'
      );
      grid.appendChild(card);
      cardRefs[tag] = card;
    });
    root.appendChild(section);

    var web = el(
      '<div class="app-section">' +
        '<div class="app-heading"><div class="app-badge web">WEB</div><h2>Teacher web app</h2></div>' +
        '<div class="card-grid"><div class="card" id="web-card"><div class="card-top"><span class="pill ' +
        ENV_DEF.pillClass + '">' + ENV_DEF.label + '</span></div>' +
        '<div class="card-body">' + skeleton + '</div>' +
        '<a class="btn btn-disabled" href="#" tabindex="-1">' + iconLink + ' Checking…</a></div></div>' +
      '</div>'
    );
    root.appendChild(web);
    return cardRefs;
  }

  function loadWebUrl(){
    var card = document.getElementById('web-card');
    var body = card.querySelector('.card-body');
    var btn = card.querySelector('.btn');
    fetch('../config.json', { cache: 'no-store' }).then(function(r){
      if (!r.ok) throw new Error(r.status);
      return r.json();
    }).then(function(cfg){
      var url = ((cfg[ENV] || {}).teacherWebUrl || '').trim();
      if (!/^https?:\/\//i.test(url)){
        body.innerHTML = '<p class="empty-state">The ' + ENV_DEF.label.toLowerCase() + ' teacher web link hasn’t been set yet.</p>';
        btn.className = 'btn btn-disabled';
        btn.innerHTML = iconLink + ' Not available yet';
        return;
      }
      body.innerHTML = '<div class="build-version">Teacher web (' + ENV_DEF.label + ')</div><div class="web-url mono">' + esc(url) + '</div>';
      btn.className = 'btn btn-primary';
      btn.href = url;
      btn.target = '_blank';
      btn.rel = 'noopener';
      btn.removeAttribute('tabindex');
      btn.innerHTML = iconLink + ' Open web app';
    }).catch(function(){
      body.innerHTML = '<p class="error-state">Couldn’t load the web link.</p>';
      btn.className = 'btn btn-disabled';
      btn.innerHTML = iconLink + ' Unavailable';
    });
  }

  function renderEmpty(card){
    card.querySelector('.card-body').innerHTML =
      '<p class="empty-state">No build published yet. It appears here after the next push to <span class="mono">' + (ENV === 'dev' ? 'dev' : 'main') + '</span>.</p>';
    var btn = card.querySelector('.btn');
    btn.className = 'btn btn-disabled';
    btn.innerHTML = iconDownload + ' Not available yet';
  }
  function renderError(card, message){
    card.querySelector('.card-body').innerHTML = '<p class="error-state">' + message + '</p>';
    var btn = card.querySelector('.btn');
    btn.className = 'btn btn-disabled';
    btn.innerHTML = iconDownload + ' Unavailable';
  }
  function renderRelease(card, release){
    var asset = (release.assets || []).filter(function(a){ return /\.apk$/i.test(a.name); })[0] || (release.assets || [])[0];
    var buildLabel = esc(release.name || release.tag_name);
    var notesMatch = (release.body || '').match(/@([0-9a-f]{7,40})/);
    var shortSha = notesMatch ? notesMatch[1].slice(0, 7)
      : (release.target_commitish && release.target_commitish.length === 40 ? release.target_commitish.slice(0, 7) : null);

    var parts = [];
    if (asset) parts.push(formatBytes(asset.size));
    parts.push(formatRelative(release.published_at));
    var subHtml = parts.filter(Boolean).join(' · ');
    if (shortSha){
      subHtml += ' · <a class="sha" href="https://github.com/edunex1511-dot/edunex-flutter/commit/' + shortSha +
        '" target="_blank" rel="noopener">' + shortSha + '</a>';
    }
    card.querySelector('.card-body').innerHTML =
      '<div class="build-version">' + buildLabel + '</div><div class="build-sub">' + subHtml + '</div>';

    var btn = card.querySelector('.btn');
    if (asset){
      btn.className = 'btn btn-primary';
      btn.href = asset.browser_download_url;
      btn.removeAttribute('tabindex');
      btn.target = '_blank';
      btn.rel = 'noopener';
      btn.innerHTML = iconDownload + ' Download APK';
    } else {
      renderEmpty(card);
    }
  }

  function loadAll(cardRefs, isManualRefresh){
    var refreshBtn = document.getElementById('refresh-btn');
    var lastChecked = document.getElementById('last-checked');
    if (isManualRefresh) refreshBtn.classList.add('spinning');
    var tags = Object.keys(cardRefs);
    var pending = tags.length;
    var sawRateLimit = false;

    tags.forEach(function(tag){
      fetch('https://api.github.com/repos/' + REPO + '/releases/tags/' + tag, {
        headers: { 'Accept': 'application/vnd.github+json' }
      }).then(function(res){
        if (res.status === 404) return { empty: true };
        if (res.status === 403) { sawRateLimit = true; return { error: 'GitHub API rate limit hit — try again shortly.' }; }
        if (!res.ok) return { error: 'Couldn’t check GitHub (status ' + res.status + ').' };
        return res.json();
      }).catch(function(){
        return { error: 'Network error reaching GitHub.' };
      }).then(function(result){
        var card = cardRefs[tag];
        if (result.empty) renderEmpty(card);
        else if (result.error) renderError(card, result.error);
        else renderRelease(card, result);
      }).finally(function(){
        pending -= 1;
        if (pending === 0){
          lastChecked.textContent = sawRateLimit
            ? 'Some checks were rate-limited — refresh in a minute.'
            : 'Last checked ' + new Date().toLocaleTimeString();
          if (isManualRefresh) refreshBtn.classList.remove('spinning');
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    var cardRefs = buildSections();
    loadWebUrl();
    loadAll(cardRefs, false);
    document.getElementById('refresh-btn').addEventListener('click', function(){
      Object.keys(cardRefs).forEach(function(tag){
        cardRefs[tag].querySelector('.card-body').innerHTML = skeleton;
      });
      loadAll(cardRefs, true);
    });
    setInterval(function(){ loadAll(cardRefs, false); }, 90000);
  });
})();
