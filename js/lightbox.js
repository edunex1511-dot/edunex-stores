(function(ns){
  var SWIPE_MIN_PX = 50;
  var dialog, image, counter, items = [], index = 0, swipeStartX = null;

  function chevron(path){
    return '<svg class="lb-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="' + path + '"/></svg>';
  }

  function build(){
    dialog = ns.el(
      '<dialog class="lightbox">' +
        '<button class="lb-btn lb-close" type="button" data-act="close">' + ns.iconClose + '</button>' +
        '<div class="lb-stage">' +
          '<button class="lb-btn lb-prev" type="button" data-act="prev">' + chevron('M15 5l-7 7 7 7') + '</button>' +
          '<img class="lb-img" alt="">' +
          '<button class="lb-btn lb-next" type="button" data-act="next">' + chevron('M9 5l7 7-7 7') + '</button>' +
        '</div><p class="lb-counter" dir="ltr"></p></dialog>');
    image = dialog.querySelector('.lb-img');
    counter = dialog.querySelector('.lb-counter');
    document.body.appendChild(dialog);
    dialog.addEventListener('click', onClick);
    dialog.addEventListener('keydown', onKey);
    dialog.addEventListener('pointerdown', function(e){ swipeStartX = e.clientX; });
    dialog.addEventListener('pointerup', onSwipeEnd);
    dialog.addEventListener('close', function(){ document.body.style.overflow = ''; });
  }

  function isRtl(){ return document.documentElement.dir === 'rtl'; }

  function show(next){
    index = (next + items.length) % items.length;
    image.src = items[index].src;
    image.alt = items[index].alt;
    counter.textContent = (index + 1) + ' / ' + items.length;
    // Warm the neighbours so a swipe never shows an empty frame.
    [index - 1, index + 1].forEach(function(i){
      new Image().src = items[(i + items.length) % items.length].src;
    });
  }

  function onClick(e){
    var button = e.target.closest('[data-act]');
    var act = button ? button.getAttribute('data-act') : (e.target === image ? null : 'close');
    if (act === 'close') dialog.close();
    else if (act === 'prev') show(index - 1);
    else if (act === 'next') show(index + 1);
  }

  // "Next" follows reading direction: right arrow in LTR, left arrow in RTL.
  function onKey(e){
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    var forward = (e.key === 'ArrowRight') !== isRtl();
    show(index + (forward ? 1 : -1));
  }

  function onSwipeEnd(e){
    if (swipeStartX === null) return;
    var distance = e.clientX - swipeStartX;
    swipeStartX = null;
    if (Math.abs(distance) < SWIPE_MIN_PX) return;
    var forward = (distance < 0) !== isRtl();
    show(index + (forward ? 1 : -1));
  }

  // items: [{ src, alt }]
  ns.openLightbox = function(list, startIndex){
    if (!list.length) return;
    if (!dialog) build();
    items = list;
    dialog.setAttribute('data-single', String(list.length === 1));
    dialog.querySelector('.lb-close').setAttribute('aria-label', ns.t('lbClose'));
    dialog.querySelector('.lb-prev').setAttribute('aria-label', ns.t('lbPrev'));
    dialog.querySelector('.lb-next').setAttribute('aria-label', ns.t('lbNext'));
    show(startIndex);
    document.body.style.overflow = 'hidden';
    dialog.showModal();
  };
})(window.Edunex = window.Edunex || {});
