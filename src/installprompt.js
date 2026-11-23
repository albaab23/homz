let deferredPrompt = null

function showBanner(text, onInstall) {
  if (document.getElementById('install-banner')) return
  const bar = document.createElement('div')
  bar.id = 'install-banner'
  bar.dir = 'rtl'
  bar.style.cssText =
    'position:fixed;bottom:16px;left:16px;right:16px;z-index:9999;background:#111;color:#fff;' +
    'padding:14px 16px;border-radius:14px;display:flex;align-items:center;gap:10px;' +
    'font-family:inherit;box-shadow:0 6px 24px rgba(0,0,0,.35)'
  bar.innerHTML = `<span style="flex:1;font-size:14px">${text}</span>`

  if (onInstall) {
    const btn = document.createElement('button')
    btn.textContent = 'تثبيت'
    btn.style.cssText = 'background:#fff;color:#111;border:0;padding:8px 16px;border-radius:10px;font-weight:700'
    btn.onclick = async () => {
      bar.remove()
      deferredPrompt.prompt()
      await deferredPrompt.userChoice
      deferredPrompt = null
    }
    bar.appendChild(btn)
  }

  const close = document.createElement('button')
  close.textContent = '✕'
  close.style.cssText = 'background:none;border:0;color:#fff;font-size:18px'
  close.onclick = () => {
    bar.remove()
    try { localStorage.setItem('installDismissed', Date.now()) } catch {}
  }
  bar.appendChild(close)
  document.body.appendChild(bar)
}

function recentlyDismissed() {
  try {
    const t = Number(localStorage.getItem('installDismissed'))
    return t && Date.now() - t < 7 * 24 * 60 * 60 * 1000 // أسبوع
  } catch { return false }
}

const isStandalone =
  window.matchMedia('(display-mode: standalone)').matches || navigator.standalone

if (!isStandalone && !recentlyDismissed()) {
  // أندرويد / كروم
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
    showBanner('ثبّت تطبيق هومز على هاتفك للوصول الأسرع', true)
  })

  // آيفون (ما في تثبيت تلقائي)
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
  if (isIOS) {
    showBanner('لتثبيت التطبيق: اضغط زر المشاركة ثم "إضافة إلى الشاشة الرئيسية"', null)
  }
}