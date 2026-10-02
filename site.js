(function () {
  // Copy buttons: <button class="copy" data-copy="text"> or data-copy-target="#id"
  document.querySelectorAll('[data-copy], [data-copy-target]').forEach(function (btn) {
    var label = btn.textContent;
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var target = btn.getAttribute('data-copy-target');
      var node = target ? document.querySelector(target) : null;
      if (!text && node) text = node.innerText.trim();
      if (!text) return;
      var done = function () {
        btn.textContent = 'Copied';
        setTimeout(function () { btn.textContent = label; }, 1600);
      };
      var fallback = function () {
        if (!node) return;
        var range = document.createRange();
        range.selectNodeContents(node);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        btn.textContent = 'Selected, press Ctrl+C';
        setTimeout(function () { btn.textContent = label; }, 2400);
      };
      try {
        navigator.clipboard.writeText(text).then(done, fallback);
      } catch (e) { fallback(); }
    });
  });

  // Chart tooltips for any element with data-tip
  var tip = document.createElement('div');
  tip.className = 'tip';
  tip.hidden = true;
  tip.setAttribute('role', 'tooltip');
  document.body.appendChild(tip);

  function place(x, y) {
    var pad = 12;
    var w = tip.offsetWidth, h = tip.offsetHeight;
    var left = Math.min(x + pad, window.innerWidth - w - 8);
    var top = y - h - pad < 8 ? y + pad : y - h - pad;
    tip.style.left = Math.max(8, left) + 'px';
    tip.style.top = top + 'px';
  }
  function show(el, x, y) {
    tip.textContent = el.getAttribute('data-tip');
    tip.hidden = false;
    place(x, y);
  }
  document.querySelectorAll('[data-tip]').forEach(function (el) {
    el.addEventListener('pointermove', function (e) { show(el, e.clientX, e.clientY); });
    el.addEventListener('pointerleave', function () { tip.hidden = true; });
    el.addEventListener('focus', function () {
      var r = el.getBoundingClientRect();
      show(el, r.left + r.width / 2, r.top);
    });
    el.addEventListener('blur', function () { tip.hidden = true; });
  });
})();
