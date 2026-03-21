// カフェバナー背景画像をJSでセット
const cafeBanner = document.querySelector('.cafe-banner');
if (cafeBanner) {
  cafeBanner.style.backgroundImage = 'url("terrace.png")';
  cafeBanner.style.backgroundSize = 'cover';
  cafeBanner.style.backgroundPosition = 'center 40%';
}

// ページ切替
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + pageId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(updateHeader, 50);
  }
}

// モバイルメニュー
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
function closeMobile() {
  mobileMenu.classList.remove('open');
  window.scrollTo({ top: 0 });
}

// スクロール時ヘッダー（動画背景対応）
function updateHeader() {
  const header = document.getElementById('siteHeader');
  const isTop = window.scrollY < 60;
  const isHomePage = document.getElementById('page-home').classList.contains('active');
  header.classList.toggle('scrolled', !isTop);
  header.classList.toggle('header-transparent', isTop && isHomePage);
}
window.addEventListener('scroll', updateHeader);
updateHeader();

// 商品フィルター
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.product-item').forEach(item => {
      item.style.display = (filter === 'all' || item.dataset.category === filter) ? '' : 'none';
    });
  });
});

// ニュースタブ
document.querySelectorAll('.news-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.news-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// スクロールフェードイン
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll(
  '.product-card, .product-item, .news-item, .news-full-item, .value-card, .award-card, .cafe-menu-card, .shop-preview-card, .online-link-card'
).forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(18px)';
  el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  observer.observe(el);
});

// 店舗タブ切替
function switchShop(id, btn) {
  document.querySelectorAll('.shop-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.shop-tab').forEach(b => b.classList.remove('active'));
  document.getElementById('shop-' + id).classList.add('active');
  btn.classList.add('active');
}

// お問い合わせフォーム送信処理（Formspree）
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.textContent = '送信中...';
    btn.disabled = true;

    const data = new FormData(contactForm);
    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        contactForm.reset();
        btn.style.display = 'none';
        document.getElementById('formSuccess').style.display = 'block';
      } else {
        btn.textContent = '送信する';
        btn.disabled = false;
        alert('送信に失敗しました。お電話またはメールにてご連絡ください。');
      }
    } catch {
      btn.textContent = '送信する';
      btn.disabled = false;
      alert('送信に失敗しました。お電話またはメールにてご連絡ください。');
    }
  });
}

/* =============================================
   良平堂 アニメーション
   コンセプト：上品・ゆっくり・繊細
   ============================================= */

// ===== スクロールフェードイン（改良版）=====
const fadeTargets = document.querySelectorAll(
  '.product-card, .product-item, .news-item, .news-full-item, ' +
  '.value-card, .award-card, .cafe-menu-card, .shop-preview-card, ' +
  '.online-link-card, .top-exp-card, .ev-detail-card, ' +
  '.concept-inner, .about-intro-inner, .ev-article, ' +
  '.awards-bar, .ec-banner, .cafe-terrace, .kuri-hiroi, ' +
  '.section-header-center, .section-header-split'
);

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // 同じ行のカードは少しずらして順番に表示
      const siblings = [...fadeTargets].filter(el =>
        el.parentElement === entry.target.parentElement
      );
      const idx = siblings.indexOf(entry.target);
      const delay = idx * 120;

      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, delay);

      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

fadeTargets.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = 'opacity 0.9s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94)';
  fadeObserver.observe(el);
});

// ===== ページ切替フェード =====
const origShowPage = window.showPage;
window.showPage = function(pageId) {
  const allPages = document.querySelectorAll('.page');
  const target = document.getElementById('page-' + pageId);
  if (!target) return;

  // 現在のページをフェードアウト
  const current = document.querySelector('.page.active');
  if (current && current !== target) {
    current.style.transition = 'opacity 0.3s ease';
    current.style.opacity = '0';
    setTimeout(() => {
      current.classList.remove('active');
      current.style.opacity = '';
      current.style.transition = '';
      // 新ページをフェードイン
      target.classList.add('active');
      target.style.opacity = '0';
      target.style.transition = 'opacity 0.5s ease';
      window.scrollTo({ top: 0 });
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          target.style.opacity = '1';
          setTimeout(() => {
            target.style.opacity = '';
            target.style.transition = '';
            // ページ切替後にfadeTargetsを再初期化
            reinitFade();
          }, 500);
        });
      });
      if (typeof updateHeader === 'function') updateHeader();
    }, 300);
  } else {
    target.classList.add('active');
    window.scrollTo({ top: 0 });
    if (typeof updateHeader === 'function') updateHeader();
    reinitFade();
  }
};

function reinitFade() {
  const targets = document.querySelectorAll(
    '#page-' + (document.querySelector('.page.active')?.id?.replace('page-','')) +
    ' .product-card, .product-item, .news-item, .news-full-item, ' +
    '.value-card, .award-card, .cafe-menu-card, .top-exp-card, .ev-article'
  );
  targets.forEach(el => {
    if (el.style.opacity === '0') {
      fadeObserver.observe(el);
    }
  });
}

// ===== 受賞バー 横スクロールループ =====
const awardsInner = document.querySelector('.awards-bar-inner');
if (awardsInner) {
  // コンテンツを2倍に複製してループ
  const clone = awardsInner.innerHTML;
  awardsInner.innerHTML = clone + clone;
  awardsInner.style.display = 'flex';
  awardsInner.style.width = 'max-content';
  awardsInner.style.animation = 'awardsScroll 28s linear infinite';

  const awardsBar = document.querySelector('.awards-bar');
  if (awardsBar) {
    awardsBar.style.overflow = 'hidden';
    awardsBar.addEventListener('mouseenter', () => {
      awardsInner.style.animationPlayState = 'paused';
    });
    awardsBar.addEventListener('mouseleave', () => {
      awardsInner.style.animationPlayState = 'running';
    });
  }
}

// ===== セクション見出しの下線アニメーション =====
const sectionTitles = document.querySelectorAll('.section-title');
const titleObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('title-visible');
      titleObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
sectionTitles.forEach(t => titleObserver.observe(t));

// ===== 数字カウントアップ（創業年・受賞年）=====
function countUp(el, end, duration = 1800) {
  const start = parseInt(end) - 80;
  const range = end - start;
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // easeOutQuart
    const ease = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.floor(start + range * ease);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = end;
  }
  requestAnimationFrame(update);
}

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const text = entry.target.textContent.trim();
      const num = parseInt(text);
      if (!isNaN(num) && num > 1000) {
        countUp(entry.target, num);
      }
      countObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.award-year').forEach(el => {
  countObserver.observe(el);
});

// ===== ボタン シャイン効果 =====
document.querySelectorAll('.btn-primary, .ec-btn.primary, .ev-cta-btn').forEach(btn => {
  btn.classList.add('shine-btn');
});
