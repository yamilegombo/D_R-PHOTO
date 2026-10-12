/* ===== Pengaturan: ganti nomor WhatsApp (format internasional, tanpa + atau 0 di depan) ===== */
const WA_NUMBER = "6282190927970";

const waURL = (text) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

/* ===== Data foto (Unsplash, gambar contoh) ===== */
const u = (id, w = 900) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;
  
const photos = [
  {
    cat: "pernikahan",
    title: "Pemda jw",
    src: "images/p.jpeg"
  },
  {
    cat: "pernikahan",
    title: "ketua & wakil ikswal",
    src: "images/acara3.jpeg"
  },
  {
    cat: "wisuda",
    title: "Keindahan alam",
    src: "images/alam1.jpeg"
  },
  
  {
    cat: "wisuda",
    title: "foto bersama",
    src: "images/gereja.jpg"
  },
  {
    cat: "acara",
    title: "Saat Hotba",
    src: "images/za.jpeg"
  },
  {
    cat: "acara",
    title: "foto bersama",
    src: "images/acara4.jpeg"
  },
  {
    cat: "acara",
    title: "derama paskah",
    src: "images/acara1.jpeg"
  },
  {
    cat: "potret",
    title: "makan bersama",
    src: "images/m.png"
  },
  {
    cat: "potret",
    title: "menyari",
    src: "images/k.jpeg"
  },
  {
    cat: "potret",
    title: "beryanyi",
    src: "images/a.jpeg"
  },
  
  {
    cat: "pernikahan",
    title: "saat membahwa sambutan",
    src: "images/acara.jpg"
  },
  {
    cat: "alam",
    title: "Pemandangan alam",
    src: "images/alam3.jpeg"
   
  },
  {
    cat: "alam",
    title: "Pemandangan alam",
    src: "images/alam.jpg"
  },
  {
    cat: "alam",
    title: "Budayah",
    src: "images/g.jpg"
  },
];

/* ===== Render galeri ===== */
const gallery = document.getElementById("gallery");
photos.forEach((p, i) => {
  const btn = document.createElement("button");
  btn.className = "g-item";
  btn.type = "button";
  btn.dataset.cat = p.cat;
  btn.dataset.title = p.title;
  btn.setAttribute("aria-label", `Perbesar foto: ${p.title}`);
  btn.style.animationDelay = `${i * 40}ms`;
  const img = document.createElement("img");
img.src = p.src;
  img.alt = `${p.title} - kategori ${p.cat}`;
  img.loading = "lazy";
  // Cadangan jika gambar gagal dimuat
  btn.appendChild(img);
  btn.addEventListener("click", () => openLightbox(btn));
  gallery.appendChild(btn);
});
const items = [...gallery.children];

/* ===== Filter kategori ===== */
document.getElementById("filters").addEventListener("click", (e) => {
  const b = e.target.closest(".filter-btn");
  if (!b) return;
  document.querySelectorAll(".filter-btn").forEach((x) => x.classList.remove("active"));
  b.classList.add("active");
  const f = b.dataset.filter;
  let n = 0;
  items.forEach((it) => {
    const show = f === "all" || it.dataset.cat === f;
    it.classList.toggle("hide", !show);
    if (show) { // ulangi animasi masuk
      it.style.animation = "none"; it.offsetHeight;
      it.style.animation = ""; it.style.animationDelay = `${n++ * 50}ms`;
    }
  });
});

/* ===== Lightbox ===== */
const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbCap = document.getElementById("lbCap");
let current = 0;
const visible = () => items.filter((i) => !i.classList.contains("hide"));

function showAt(idx) {
  const list = visible();
  current = (idx + list.length) % list.length;
  const it = list[current];
  const src = it.querySelector("img").currentSrc || it.querySelector("img").src;
  lbImg.src = src.replace(/w=\d+/, "w=1600");
  lbImg.onerror = () => { lbImg.onerror = null; lbImg.src = src; };
  lbImg.alt = it.dataset.title;
  lbCap.textContent = it.dataset.title;
}
function openLightbox(item) {
  showAt(visible().indexOf(item));
  lb.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeLightbox() {
  lb.classList.remove("open");
  document.body.style.overflow = "";
}
lb.querySelector(".lb-close").onclick = closeLightbox;
lb.querySelector(".lb-prev").onclick = () => showAt(current - 1);
lb.querySelector(".lb-next").onclick = () => showAt(current + 1);
lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
document.addEventListener("keydown", (e) => {
  if (!lb.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") showAt(current - 1);
  if (e.key === "ArrowRight") showAt(current + 1);
});
// Geser di layar sentuh
let startX = 0;
lb.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX), { passive: true });
lb.addEventListener("touchend", (e) => {
  const dx = e.changedTouches[0].clientX - startX;
  if (Math.abs(dx) > 50) showAt(current + (dx < 0 ? 1 : -1));
});

/* ===== Tautan WhatsApp (booking) ===== */
document.querySelectorAll(".wa-link").forEach((a) => {
  const paket = a.dataset.paket;
  const text = paket
    ? `Halo D-R-, saya ingin booking paket ${paket}. Mohon info jadwal yang tersedia.`
    : "Halo D-R-, saya ingin bertanya tentang jasa fotografi.";
  a.href = waURL(text);
});

/* ===== Formulir kontak -> WhatsApp ===== */
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("cName");
  const ev = document.getElementById("cEvent");
  const msg = document.getElementById("cMsg").value.trim();
  let ok = true;
  [name, ev].forEach((f) => {
    const bad = !f.value.trim();
    f.classList.toggle("is-invalid", bad);
    if (bad) ok = false;
  });
  if (!ok) return;
  const text = `Halo D-R-, saya ${name.value.trim()}.\nAcara: ${ev.value.trim()}${msg ? `\nPesan: ${msg}` : ""}`;
  window.open(waURL(text), "_blank", "noopener");
});

/* ===== Navbar: efek scroll + menu aktif + tutup menu di HP ===== */
const nav = document.getElementById("nav");
const links = document.querySelectorAll(".nav-link");
const sections = [...links].map((l) => document.querySelector(l.getAttribute("href")));
function onScroll() {
  nav.classList.toggle("scrolled", window.scrollY > 40);
  const y = window.scrollY + 120;
  let idx = 0;
  sections.forEach((s, i) => { if (s && s.offsetTop <= y) idx = i; });
  links.forEach((l, i) => l.classList.toggle("active", i === idx));
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
links.forEach((l) => l.addEventListener("click", () => {
  const menu = document.getElementById("menu");
  if (menu.classList.contains("show")) bootstrap.Collapse.getOrCreateInstance(menu).hide();
}));

/* ===== Animasi muncul saat scroll + hitung angka ===== */
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    en.target.classList.add("show");
    en.target.querySelectorAll("[data-count]").forEach(countUp);
    io.unobserve(en.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

function countUp(el) {
  const target = +el.dataset.count, dur = 1400, t0 = performance.now();
  (function tick(t) {
    const p = Math.min((t - t0) / dur, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + (p === 1 ? "+" : "");
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
}

document.getElementById("year").textContent = new Date().getFullYear();
