(function(ns){
  var REPO = 'edunex1511-dot/edunex-stores';
  var COMMIT_URL = 'https://github.com/edunex1511-dot/edunex-flutter/commit/';

  function fetchRelease(tag){
    return fetch('https://api.github.com/repos/' + REPO + '/releases/tags/' + tag, {
      headers: { 'Accept': 'application/vnd.github+json' }
    }).then(function(res){
      if (res.status === 404) return { empty: true };
      if (res.status === 403) return { error: 'errRate' };
      if (!res.ok) return { error: 'errStatus', vars: { n: res.status } };
      return res.json();
    }).catch(function(){ return { error: 'errNet' }; });
  }

  function commitSha(release){
    var notes = (release.body || '').match(/@([0-9a-f]{7,40})/);
    if (notes) return notes[1].slice(0, 7);
    var target = release.target_commitish;
    return target && target.length === 40 ? target.slice(0, 7) : null;
  }

  function releaseSummary(release){
    var assets = release.assets || [];
    var asset = assets.filter(function(a){ return /\.apk$/i.test(a.name); })[0] || assets[0];
    if (!asset) return null;
    var sha = commitSha(release);
    var parts = ['<bdi>' + ns.formatBytes(asset.size) + '</bdi>', ns.formatRelative(release.published_at)];
    var sub = parts.filter(Boolean).join(' · ');
    if (sha) sub += ' · <a class="sha" dir="ltr" href="' + COMMIT_URL + sha + '" target="_blank" rel="noopener">' + sha + '</a>';
    return { asset: asset, html: '<div class="build-version" dir="ltr">' + ns.esc(release.name || release.tag_name) + '</div><div class="build-sub">' + sub + '</div>' };
  }

  // One download card for `<app>-app-<env>` GitHub release.
  ns.createApkCard = function(app, env){
    var tag = app + '-app-' + env;
    var pill = env === 'dev' ? 'pill-dev' : 'pill-prod';
    var node = ns.el(
      '<div class="card"><div class="card-top"><span class="pill ' + pill + '" data-i18n="' + app + '"></span>' +
      '<span class="card-meta mono" dir="ltr">' + tag + '</span></div>' +
      '<div class="card-body"></div><a class="btn btn-disabled" href="#" tabindex="-1"></a></div>');
    var body = node.querySelector('.card-body');
    var state = { loading: true };

    function showMessage(cls, message, buttonKey){
      body.innerHTML = '<p class="' + cls + '">' + ns.esc(message) + '</p>';
      ns.setBtn(node, 'btn-disabled', ns.iconDownload, ns.t(buttonKey));
    }

    function render(){
      if (state.loading){
        body.innerHTML = ns.skeleton;
        return ns.setBtn(node, 'btn-disabled', ns.iconDownload, ns.t('checking'));
      }
      if (state.empty) return showMessage('empty-state', ns.t('noBuild'), 'notYet');
      if (state.error) return showMessage('error-state', ns.t(state.error, state.vars), 'unavailable');
      var summary = releaseSummary(state);
      if (!summary) return showMessage('empty-state', ns.t('noBuild'), 'notYet');
      body.innerHTML = summary.html;
      ns.setBtn(node, 'btn-primary', ns.iconDownload, ns.t('dlApk'), summary.asset.browser_download_url, true);
    }

    function load(){
      return fetchRelease(tag).then(function(result){ state = result; render(); return result; });
    }

    return { node: node, render: render, load: load, reset: function(){ state = { loading: true }; render(); } };
  };
})(window.Edunex = window.Edunex || {});
