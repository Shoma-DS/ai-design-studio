# enatural.co.jp アニメーション解析

解析元: https://www.enatural.co.jp/（2026-07-07時点のソースを直接確認）。技法のみ抽出し汎用CSS/JSに書き直したもの。元サイトのコピー・ロゴ・配色は含まない。

実装ライブラリはjQuery + ScrollReveal.js + Slick.js + 自作スクリプトの組み合わせ（2015〜2018年頃の主流構成）。以下は同じ見え方を素のCSS/JSで再現する版。

## 1. スクロール連動フェードイン（ScrollReveal風）

要素ごとに `origin`（出現方向）・`distance`・`duration`・`delay` を変えて、順番に浮かび上がらせる。カード3枚を並べる場合は `delay` を100〜200msずつずらすと綺麗に順番が出る。

```css
.reveal {
  opacity: 0;
  transform: translateY(50px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

```js
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = `${i * 100}ms`;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
```

見出しだけ `scale(1.5) → scale(1)` を足すと、ズームしながら定位置に収まる強調演出になる（元サイトは`h1`にのみ使用、多用しない）。

## 2. カーテンワイプ型ヒーロースライドショー

JSタイマー不要でCSSの`@keyframes`だけで作る、複数枚を切り替えるヒーロー演出。帯（オーバーレイ）が画面を横切って前のスライドを隠し、通過後にテキストがフェードインする。スライド番号ごとにキーフレームの%開始位置をずらすことで時間差再生にしている。

```css
.hero-slide {
  position: relative;
  overflow: hidden;
}
.hero-slide::after {
  content: "";
  position: absolute;
  inset: 0;
  background: #fff; /* 帯の色 */
  transform: translateX(-101%);
  animation: curtain-wipe 8s linear infinite;
}
.hero-slide .hero-slide-text {
  opacity: 0;
  animation: curtain-text-in 8s linear infinite;
}

@keyframes curtain-wipe {
  0%   { transform: translateX(-101%); }
  10%  { transform: translateX(0); }
  15%  { transform: translateX(0); }
  25%  { transform: translateX(101%); }
  100% { transform: translateX(101%); }
}
@keyframes curtain-text-in {
  0%  { opacity: 0; }
  10% { opacity: 0; }
  15% { opacity: 1; }
}
```

複数枚にする場合は2枚目以降のキーフレーム%を後ろにずらした別クラス（`.hero-slide--2`等）を用意し、`animation-delay`ではなく%そのものをずらすのが元サイトの手法（ループ全体の周期を揃えたまま、各スライドの表示区間だけをずらせる）。

## 3. スクロール誘導アイコン（マウス型）

マウス型の枠の中で、点が上下にループするアイコン。

```css
.scroll-mouse {
  width: 23px;
  height: 42px;
  border: solid 3px currentColor;
  border-radius: 30px;
  position: relative;
}
.scroll-mouse::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 10px;
  width: 1px;
  height: 10px;
  margin-left: -0.5px;
  background: currentColor;
  animation: scroll-wheel 1.5s ease infinite;
}
@keyframes scroll-wheel {
  0%   { top: -10px; }
  30%  { top: 0; opacity: 0; }
  60%  { top: 0; opacity: 1; }
  70%  { top: 0; }
  100% { top: 10px; opacity: 0.5; }
}
```

## 4. ヘッダー縮小（スクロール連動）

スクロール量に応じてヘッダーの高さ・背景・ロゴ色を切り替える。`class`の付け外しはJSで行い、見た目の変化は全てCSS `transition` に任せる。

```css
header {
  transition: background 0.3s, height 0.7s;
}
header.is-scrolled {
  background: rgba(255, 255, 255, 0.9);
}
header.is-scrolled .logo { height: 30px; transition: 0.7s; }
```

```js
let lastY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  document.querySelector('header').classList.toggle('is-scrolled', y > lastY && y > 50);
});
```

## 5. 下線が伸びるナビホバー

```css
nav a {
  position: relative;
}
nav a::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 8px;
  width: 0;
  height: 1px;
  background: currentColor;
  transition: 0.3s;
}
nav a:hover::after,
nav a.active::after {
  left: 30%;
  width: 40%;
}
```

## 6. 画像ホバーオーバーレイ

カード・サムネイル画像にカーソルを乗せると、画像が薄くなり半透明の帯が中央からスライドして重なる。

```css
.thumb { position: relative; overflow: hidden; }
.thumb img { transition: opacity 0.3s; }
.thumb::after {
  content: "";
  position: absolute;
  inset: 0;
  left: 100%;
  background: rgba(255,255,255,0.5);
  opacity: 0;
  transition: opacity 0.3s, left 0.3s;
}
.thumb:hover img { opacity: 0.3; }
.thumb:hover::after { opacity: 1; left: 50%; }
```

## 7. 無限ループスライダー（marquee風）

ロゴ・バナーなどを途切れず横流しする。要素を複製して並べた上で、複製分の合計幅ぶん`translate3d`するキーフレームを動的生成し、`linear infinite`で回し続ける。

```css
.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee-scroll var(--marquee-duration, 20s) linear infinite;
}
@keyframes marquee-scroll {
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(var(--marquee-distance, -50%), 0, 0); }
}
```

HTML側で`.marquee-track`の中身を2回複製して並べ、`--marquee-distance`を複製前の合計幅（= 通常50%）に設定するとシームレスにループする。速度はコンテンツ幅に応じて`--marquee-duration`を計算する。

## 8. gotopボタン + イージングスムーズスクロール

- 200px以上スクロールでボタンをフェードイン、下回ったらフェードアウト
- クリックで `easeInOutQuart` 相当のイージングで最上部までスクロール

```css
.gotop {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
}
.gotop.is-visible {
  opacity: 1;
  pointer-events: auto;
}
```

```js
window.addEventListener('scroll', () => {
  document.querySelector('.gotop').classList.toggle('is-visible', window.scrollY > 200);
});
document.querySelector('.gotop').addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' }); // ネイティブでeaseInOutQuart相当
});
```

## 全体所感

GSAP/Framer Motionのような最近のライブラリは使われておらず、`transition` + `@keyframes` + `IntersectionObserver`（元はScrollReveal.js）の組み合わせで十分再現できる構成。動きの数値感（duration 800ms前後、delay 100ms刻み、easingは概ね`ease`）はコーポレートサイトの上品な演出として汎用的に使える基準値。
