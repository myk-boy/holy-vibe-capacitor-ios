/**
 * debug-overlay.js — тимчасовий інструмент діагностики.
 * Показує console.log/warn/error та всі непіймані помилки прямо
 * на екрані телефону, з кнопкою копіювання. ВИДАЛИТИ перед публікацією
 * в стори — це лише для налагодження.
 *
 * Підключати ПЕРШИМ у index.html, перед усіма іншими <script>.
 */
(function () {
  var logs = [];

  function addLog(type, args) {
    var msg = Array.prototype.map.call(args, function (a) {
      try {
        return typeof a === 'object' ? JSON.stringify(a) : String(a);
      } catch (e) {
        return String(a);
      }
    }).join(' ');
    logs.push('[' + type + '] ' + msg);
    render();
  }

  var origLog = console.log, origWarn = console.warn, origError = console.error;
  console.log = function () { addLog('log', arguments); origLog.apply(console, arguments); };
  console.warn = function () { addLog('warn', arguments); origWarn.apply(console, arguments); };
  console.error = function () { addLog('error', arguments); origError.apply(console, arguments); };

  window.addEventListener('error', function (e) {
    addLog('UNCAUGHT', [e.message + ' @ ' + e.filename + ':' + e.lineno]);
  });
  window.addEventListener('unhandledrejection', function (e) {
    addLog('PROMISE-REJECTED', [String(e.reason)]);
  });

  var box, btn;

  function copyText() {
    var text = logs.join('\n');
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      alert('Скопійовано! (' + logs.length + ' рядків)');
    } catch (e) {
      alert('Не вдалось скопіювати: ' + e);
    }
  }

  function render() {
    if (!box) return;
    box.textContent = logs.join('\n');
    box.scrollTop = box.scrollHeight;
  }

  document.addEventListener('DOMContentLoaded', function () {
    btn = document.createElement('div');
    btn.textContent = '🐞';
    btn.style.cssText = 'position:fixed;bottom:12px;right:12px;z-index:999999;' +
      'width:44px;height:44px;border-radius:50%;background:#c9a84c;' +
      'display:flex;align-items:center;justify-content:center;font-size:20px;' +
      'box-shadow:0 2px 8px rgba(0,0,0,.5);';
    document.body.appendChild(btn);

    box = document.createElement('div');
    box.style.cssText = 'position:fixed;inset:60px 8px 8px 8px;z-index:999998;' +
      'background:rgba(0,0,0,.92);color:#0f0;font-family:monospace;font-size:11px;' +
      'padding:8px;overflow:auto;white-space:pre-wrap;display:none;border-radius:8px;';
    document.body.appendChild(box);

    var copyBtn = document.createElement('div');
    copyBtn.textContent = '📋 Копіювати логи';
    copyBtn.style.cssText = 'position:fixed;top:8px;right:8px;z-index:999999;' +
      'background:#c9a84c;color:#000;padding:8px 12px;border-radius:8px;' +
      'font-family:sans-serif;font-size:13px;display:none;';
    document.body.appendChild(copyBtn);
    copyBtn.addEventListener('click', copyText);

    btn.addEventListener('click', function () {
      var showing = box.style.display === 'block';
      box.style.display = showing ? 'none' : 'block';
      copyBtn.style.display = showing ? 'none' : 'block';
    });

    render();
  });
})();