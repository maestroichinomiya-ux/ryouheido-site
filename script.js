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
