/* Word & World Academy — language switcher.
   Every translatable element carries its Korean text inline as a data-ko
   attribute (data-ko-alt for image alt text). The page renders correctly in
   English before this script runs; this script only swaps text on load and
   on choice. No translation files, no build step. See 09_I18N.md. */
(function(){
  var KEY = 'wwa_lang';
  var FLAG = {en:'🇺🇸', ko:'🇰🇷'};
  var NAME = {en:'English', ko:'한국어'};

  function detect(){
    var saved = localStorage.getItem(KEY);
    if(saved === 'en' || saved === 'ko') return saved;
    return (navigator.language || '').toLowerCase().indexOf('ko') === 0 ? 'ko' : 'en';
  }

  function apply(lang){
    document.documentElement.setAttribute('lang', lang);

    document.querySelectorAll('[data-ko]').forEach(function(el){
      if(el.tagName === 'META'){
        if(el.dataset.enCache === undefined) el.dataset.enCache = el.getAttribute('content') || '';
        el.setAttribute('content', lang === 'ko' ? el.getAttribute('data-ko') : el.dataset.enCache);
        return;
      }
      if(el.tagName === 'TITLE'){
        if(el.dataset.enCache === undefined) el.dataset.enCache = el.textContent;
        el.textContent = lang === 'ko' ? el.getAttribute('data-ko') : el.dataset.enCache;
        return;
      }
      if(el.dataset.enCache === undefined) el.dataset.enCache = el.innerHTML;
      el.innerHTML = lang === 'ko' ? el.getAttribute('data-ko') : el.dataset.enCache;
    });

    document.querySelectorAll('[data-ko-alt]').forEach(function(el){
      if(el.dataset.enAltCache === undefined) el.dataset.enAltCache = el.getAttribute('alt') || '';
      el.setAttribute('alt', lang === 'ko' ? el.getAttribute('data-ko-alt') : el.dataset.enAltCache);
    });

    localStorage.setItem(KEY, lang);

    document.querySelectorAll('.lang-opt').forEach(function(b){
      b.classList.toggle('active', b.getAttribute('data-lang') === lang);
    });
    document.querySelectorAll('.lang-current').forEach(function(t){
      t.textContent = FLAG[lang] + ' ' + lang.toUpperCase();
    });
  }

  function buildSwitch(root, lang){
    root.innerHTML =
      '<div class="lang-switch">' +
        '<button type="button" class="lang-current" aria-haspopup="true" aria-expanded="false">' + FLAG[lang] + ' ' + lang.toUpperCase() + '</button>' +
        '<div class="lang-menu" role="menu">' +
          '<button type="button" class="lang-opt" data-lang="en" role="menuitem">' + FLAG.en + ' ' + NAME.en + '</button>' +
          '<button type="button" class="lang-opt" data-lang="ko" role="menuitem">' + FLAG.ko + ' ' + NAME.ko + '</button>' +
        '</div>' +
      '</div>';

    var wrap = root.querySelector('.lang-switch');
    var trigger = root.querySelector('.lang-current');

    trigger.addEventListener('click', function(e){
      e.stopPropagation();
      var open = wrap.classList.toggle('open');
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    root.querySelectorAll('.lang-opt').forEach(function(btn){
      btn.addEventListener('click', function(){
        apply(btn.getAttribute('data-lang'));
        wrap.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', function(){
      wrap.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    var lang = detect();
    document.querySelectorAll('#lang-switch').forEach(function(root){ buildSwitch(root, lang); });
    apply(lang);
  });
})();
