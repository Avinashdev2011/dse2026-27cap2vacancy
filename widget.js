/**
 * Content Widget Loader
 * Loads external content modules into designated page slots
 */

(function() {
  var _cfg = {
    's1': { k: 'c59ab0ab1c1735319686956488a79fc7', h: 90, w: 728 },
    's2': { k: '1fc23fb109ad8c6a90981b662c12cae5', h: 50, w: 320 },
    's3': { k: '9a6ddfda9d8b95a54faf8c2b3f2db45d', h: 600, w: 160 },
    's4': { k: 'fe566831404d28d9fb48554cfd86426d', h: 300, w: 160 },
    's5': { k: '6edccf25d965060cdf5d523080e9ffd7', h: 250, w: 300 },
    's6': { k: '89123834882acc4447f3615ad6362dc0', h: 60, w: 468 }
  };

  var _host = 'rewindoutstanding.com';

  function _build(slotId, c) {
    var el = document.getElementById('slot-' + slotId);
    if (!el) return;

    var fr = document.createElement('iframe');
    fr.setAttribute('width', c.w);
    fr.setAttribute('height', c.h);
    fr.style.cssText = 'border:0;overflow:hidden;scrolling:no;display:block;margin:0 auto;';
    fr.setAttribute('frameborder', '0');
    fr.setAttribute('allowtransparency', 'true');
    el.appendChild(fr);

    var w = fr.contentWindow || fr.contentDocument;
    var d = w.document ? w.document : w;

    var markup = '<!DOCTYPE html><html><head><meta charset="utf-8">' +
      '<style>body{margin:0;padding:0;background:transparent;overflow:hidden;display:flex;justify-content:center;align-items:center;}</style>' +
      '</head><body>' +
      '<scr' + 'ipt type="text/javascript">' +
      'atOptions={"key":"' + c.k + '","format":"iframe","height":' + c.h + ',"width":' + c.w + ',"params":{}};' +
      '</scr' + 'ipt>' +
      '<scr' + 'ipt type="text/javascript" src="https://' + _host + '/' + c.k + '/invoke.js"></scr' + 'ipt>' +
      '</body></html>';

    d.open();
    d.write(markup);
    d.close();
  }

  function _load() {
    var ids = ['top-a','top-b','side-a','side-b','mid-a','mid-b','foot-a'];
    var keys = ['s1','s2','s3','s4','s5','s6','s1'];

    for (var i = 0; i < ids.length; i++) {
      var el = document.getElementById('slot-' + ids[i]);
      if (el) {
        try { _build(ids[i], _cfg[keys[i]]); } catch(e) {}
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _load);
  } else {
    _load();
  }
})();
