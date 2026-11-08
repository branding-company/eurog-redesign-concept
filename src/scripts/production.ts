const scroller = document.getElementById('storyScroll')!;
const imgs = [...document.querySelectorAll<HTMLImageElement>('#psImgs img')];
const texts = [...document.querySelectorAll<HTMLElement>('.ps-t')];
const steps = [...document.querySelectorAll<HTMLElement>('#psSteps li')];
const num = document.getElementById('psN')!;
const scan = document.getElementById('psScan')!;
const N = imgs.length;
let last = -1;
function update() {
  const r = scroller.getBoundingClientRect();
  const p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
  const f = Math.min(N - 0.0001, p * N);
  const i = Math.floor(f);
  if (i !== last) {
    last = i;
    imgs.forEach((im, k) => im.classList.toggle('on', k === i));
    texts.forEach((t, k) => { t.classList.toggle('on', k === i); t.setAttribute('aria-hidden', String(k !== i)); });
    num.textContent = String(i + 1).padStart(2, '0');
  }
  steps.forEach((s, k) => s.querySelector('i')!.style.setProperty('--f', String(k < i ? 1 : k === i ? f - i : 0)));
  scan.style.top = `${((f - i) * 100).toFixed(1)}%`;
}
addEventListener('scroll', update, { passive: true });
addEventListener('resize', update);
update();
