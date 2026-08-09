/**
 * Ad Banner Loader for DSE CAP Round II Vacancy Portal
 * Manages dynamic rendering of user provided ad scripts
 */

window.AD_CONFIGS = {
  'banner_300x250': {
    key: '6edccf25d965060cdf5d523080e9ffd7',
    format: 'iframe',
    height: 250,
    width: 300,
    src: 'https://rewindoutstanding.com/6edccf25d965060cdf5d523080e9ffd7/invoke.js'
  },
  'banner_320x50': {
    key: '1fc23fb109ad8c6a90981b662c12cae5',
    format: 'iframe',
    height: 50,
    width: 320,
    src: 'https://rewindoutstanding.com/1fc23fb109ad8c6a90981b662c12cae5/invoke.js'
  },
  'banner_160x600': {
    key: '9a6ddfda9d8b95a54faf8c2b3f2db45d',
    format: 'iframe',
    height: 600,
    width: 160,
    src: 'https://rewindoutstanding.com/9a6ddfda9d8b95a54faf8c2b3f2db45d/invoke.js'
  },
  'banner_728x90': {
    key: 'c59ab0ab1c1735319686956488a79fc7',
    format: 'iframe',
    height: 90,
    width: 728,
    src: 'https://rewindoutstanding.com/c59ab0ab1c1735319686956488a79fc7/invoke.js'
  },
  'banner_468x60': {
    key: '89123834882acc4447f3615ad6362dc0',
    format: 'iframe',
    height: 60,
    width: 468,
    src: 'https://rewindoutstanding.com/89123834882acc4447f3615ad6362dc0/invoke.js'
  },
  'banner_160x300': {
    key: 'fe566831404d28d9fb48554cfd86426d',
    format: 'iframe',
    height: 300,
    width: 160,
    src: 'https://rewindoutstanding.com/fe566831404d28d9fb48554cfd86426d/invoke.js'
  }
};

function renderAdSlot(containerId, adConfigKey) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const config = window.AD_CONFIGS[adConfigKey];
  if (!config) return;

  // Create isolated iframe to safely execute ad script without blocking parent document
  const iframe = document.createElement('iframe');
  iframe.width = config.width;
  iframe.height = config.height;
  iframe.style.border = 'none';
  iframe.style.overflow = 'hidden';
  iframe.style.scrolling = 'no';
  iframe.style.display = 'block';

  container.innerHTML = '';
  container.appendChild(iframe);

  const iframeDoc = iframe.contentWindow || iframe.contentDocument;
  const doc = iframeDoc.document ? iframeDoc.document : iframeDoc;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>body { margin: 0; padding: 0; background: transparent; overflow: hidden; display: flex; justify-content: center; align-items: center; }</style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = {
            'key' : '${config.key}',
            'format' : '${config.format}',
            'height' : ${config.height},
            'width' : ${config.width},
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="${config.src}"></script>
      </body>
    </html>
  `;

  doc.open();
  doc.write(htmlContent);
  doc.close();
}

document.addEventListener('DOMContentLoaded', () => {
  // Render ad banners in their respective containers
  renderAdSlot('ad-top-banner', 'banner_728x90');
  renderAdSlot('ad-top-mobile', 'banner_320x50');
  renderAdSlot('ad-sidebar-160x600', 'banner_160x600');
  renderAdSlot('ad-sidebar-160x300', 'banner_160x300');
  renderAdSlot('ad-inline-300x250', 'banner_300x250');
  renderAdSlot('ad-banner-468x60', 'banner_468x60');
  renderAdSlot('ad-footer-banner', 'banner_728x90');
});
