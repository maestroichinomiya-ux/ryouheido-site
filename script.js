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

// お問い合わせフォーム送信処理（Web3Forms）
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.textContent = '送信中...';
    btn.disabled = true;

    // フォームデータをJSONに変換
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (json.success) {
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
  const clone = awardsInner.innerHTML;
  awardsInner.innerHTML = clone + clone;
  awardsInner.style.display = 'flex';
  awardsInner.style.flexDirection = 'row';
  awardsInner.style.flexWrap = 'nowrap';
  awardsInner.style.width = 'max-content';

  // スマホは速く、PCはゆっくり
  const isMobile = window.innerWidth < 768;
  const speed = isMobile ? '14s' : '28s';
  awardsInner.style.animation = `awardsScroll ${speed} linear infinite`;

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

/* =============================================
   URLハッシュ対応 & ページ別SEO最適化
   ============================================= */

const BASE_URL = 'https://ryouheidou.jp/';

// ページごとのSEOメタ情報
const PAGE_SEO = {
  home: {
    title: '恵那栗工房 良平堂 | 岐阜・恵那の栗和菓子専門店',
    desc: '岐阜県恵那市の栗和菓子専門店。創業1946年。栗きんとん・栗福柿など、恵那・中津川産の和栗を使った職人手作りの栗和菓子をお届けします。日本ギフト大賞2019受賞。伊勢神宮奉納品。',
    url: BASE_URL,
    hash: ''
  },
  about: {
    title: '良平堂について | 恵那栗工房 良平堂',
    desc: '創業1946年、岐阜県恵那市の栗和菓子専門店「恵那栗工房 良平堂」。恵那・中津川産の和栗だけを使い、氷砂糖で炊く昔ながらの製法を守り続ける職人の技と想い。',
    url: BASE_URL + '#about',
    hash: '#about'
  },
  products: {
    title: '商品紹介 | 恵那栗工房 良平堂',
    desc: '栗きんとん・栗福柿・栗ころん・恵那栗ようかんなど、恵那・中津川産の国産和栗を使った職人手作りの栗和菓子一覧。ギフト・お中元・お歳暮にも。日本ギフト大賞2019受賞。',
    url: BASE_URL + '#products',
    hash: '#products'
  },
  cafe: {
    title: '栗カフェ | 恵那栗工房 良平堂',
    desc: '笠置山麓の絶景テラス席で搾りたてモンブランを。恵那の街並みと南アルプスを一望しながら、栗スイーツをお楽しみいただけます。岐阜・恵那市大井町。',
    url: BASE_URL + '#cafe',
    hash: '#cafe'
  },
  events: {
    title: '体験・イベント | 恵那栗工房 良平堂',
    desc: '栗きんとん絞り体験（通年・¥2,200）と栗拾い体験（秋季限定）。職人・女将の指導のもと本物の栗きんとんを作る体験。岐阜・恵那市良平堂。',
    url: BASE_URL + '#events',
    hash: '#events'
  },
  news: {
    title: 'お知らせ | 恵那栗工房 良平堂',
    desc: '恵那栗工房 良平堂からのお知らせ・季節商品情報・イベント開催情報をお届けします。',
    url: BASE_URL + '#news',
    hash: '#news'
  },
  shop: {
    title: '店舗案内 | 恵那栗工房 良平堂',
    desc: '恵那栗工房 良平堂の店舗案内。岐阜県恵那市の本店（栗カフェ併設）と東京・八重洲地下街ヤエチカ店の営業時間・アクセス情報。',
    url: BASE_URL + '#shop',
    hash: '#shop'
  },
  contact: {
    title: 'お問い合わせ | 恵那栗工房 良平堂',
    desc: '恵那栗工房 良平堂へのお問い合わせ。商品・ギフト・法人注文・栗きんとん絞り体験予約など、お気軽にご連絡ください。TEL 0573-26-0703。',
    url: BASE_URL + '#contact',
    hash: '#contact'
  }
};

// SEOメタを更新する関数
function updateSEO(pageId) {
  const seo = PAGE_SEO[pageId] || PAGE_SEO.home;

  // title
  document.getElementById('pageTitle').textContent = seo.title;
  // description
  document.getElementById('pageDesc').setAttribute('content', seo.desc);
  // canonical
  document.getElementById('canonical').setAttribute('href', seo.url);
  // OGP
  document.getElementById('ogTitle').setAttribute('content', seo.title);
  document.getElementById('ogDesc').setAttribute('content', seo.desc);
  document.getElementById('ogUrl').setAttribute('content', seo.url);
  // Twitter
  document.getElementById('twTitle').setAttribute('content', seo.title);
  document.getElementById('twDesc').setAttribute('content', seo.desc);
}

// URLハッシュを更新する関数
function updateHash(pageId) {
  const seo = PAGE_SEO[pageId] || PAGE_SEO.home;
  const newUrl = seo.hash ? seo.hash : (location.pathname + location.search);
  history.pushState({ page: pageId }, seo.title, newUrl || '/');
}

// showPage をSEO・ハッシュ対応に拡張
const _origShowPage = window.showPage;
window.showPage = function(pageId) {
  updateSEO(pageId);
  updateHash(pageId);
  _origShowPage(pageId);
};

// ブラウザの戻る・進むボタン対応
window.addEventListener('popstate', function(e) {
  const pageId = e.state?.page || hashToPage(location.hash);
  if (pageId) {
    updateSEO(pageId);
    _origShowPage(pageId);
  }
});

// ハッシュからページIDを解決
function hashToPage(hash) {
  const map = {
    '#about': 'about',
    '#products': 'products',
    '#cafe': 'cafe',
    '#events': 'events',
    '#news': 'news',
    '#shop': 'shop',
    '#contact': 'contact',
    '': 'home',
    '#': 'home'
  };
  return map[hash] || 'home';
}

// 初期ロード時にハッシュがあればそのページを表示
(function() {
  const hash = location.hash;
  const pageId = hashToPage(hash);
  if (pageId && pageId !== 'home') {
    // DOMが準備できてから実行
    document.addEventListener('DOMContentLoaded', function() {
      updateSEO(pageId);
      const target = document.getElementById('page-' + pageId);
      if (target) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        target.classList.add('active');
      }
    });
  } else {
    updateSEO('home');
  }
})();

/* =============================================
   強化アニメーション JS
   ============================================= */

// ===== IntersectionObserver で in-view クラスを付与 =====
const inViewTargets = [
  '.concept',
  '.products-preview',
  '.top-experience',
  '.cafe-banner',
  '.ec-banner',
  '.news-preview',
  '.about-intro-inner',
];

const inViewObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      inViewObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

inViewTargets.forEach(sel => {
  document.querySelectorAll(sel).forEach(el => inViewObserver.observe(el));
});

// ===== 商品カード・体験カード・ニュース 順番にアニメーション =====
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // 同じ親の中での順番を取得してディレイをずらす
      const parent = entry.target.parentElement;
      const siblings = [...parent.children].filter(c =>
        c.classList.contains('product-card') ||
        c.classList.contains('product-item') ||
        c.classList.contains('top-exp-card') ||
        c.classList.contains('news-item') ||
        c.classList.contains('news-full-item')
      );
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('animated');
      }, idx * 100);
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

[
  '.product-card',
  '.product-item',
  '.top-exp-card',
  '.news-item',
  '.news-full-item',
].forEach(sel => {
  document.querySelectorAll(sel).forEach(el => {
    // 既存のfadeObserverスタイルをリセット
    el.style.opacity = '';
    el.style.transform = '';
    el.style.transition = '';
    cardObserver.observe(el);
  });
});

// ===== パララックス（栗カフェバナー背景）=====
const cafeBg = document.querySelector('.cafe-banner');
if (cafeBg) {
  window.addEventListener('scroll', () => {
    const rect = cafeBg.getBoundingClientRect();
    const viewH = window.innerHeight;
    if (rect.top < viewH && rect.bottom > 0) {
      const progress = (viewH - rect.top) / (viewH + rect.height);
      const offset = (progress - 0.5) * 60;
      cafeBg.style.backgroundPositionY = `calc(40% + ${offset}px)`;
    }
  }, { passive: true });
}
