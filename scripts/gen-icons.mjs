// 따랜디 PWA 아이콘 생성기 — 레트로 룰렛/자전거 휠 엠블럼 SVG 를 만든다.
// sips 로 PNG 변환하므로 여기선 SVG 문자열만 출력한다.
import { mkdirSync, writeFileSync } from 'node:fs';

const C = { red: '#e5383b', redDark: '#b71d21', redDeep: '#8c1417', gold: '#ffb703', goldLight: '#ffd45e', cream: '#fbf0d9', teal: '#2a9d8f' };
const CX = 256, CY = 256, R = 150;

const ptsAt = (r, n, start = 0) =>
  Array.from({ length: n }, (_, i) => {
    const a = ((start + (360 / n) * i) * Math.PI) / 180;
    return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
  });

const f = (v) => v.toFixed(1);

const wheel = () => {
  const p = ptsAt(R, 8, 0); // 8 꼭짓점
  let s = '';
  // 림 배킹
  s += `<circle cx="${CX}" cy="${CY}" r="${R + 8}" fill="${C.cream}"/>`;
  // 8 웨지 (룰렛 느낌, teal/cream 교차)
  for (let i = 0; i < 8; i++) {
    const a = p[i], b = p[(i + 1) % 8];
    const fill = i % 2 === 0 ? C.teal : C.cream;
    s += `<path d="M${CX} ${CY} L${f(a[0])} ${f(a[1])} L${f(b[0])} ${f(b[1])} Z" fill="${fill}"/>`;
  }
  // 스포크 (자전거 휠)
  for (const [x, y] of p) {
    s += `<line x1="${CX}" y1="${CY}" x2="${f(x)}" y2="${f(y)}" stroke="${C.gold}" stroke-width="4" stroke-linecap="round"/>`;
  }
  // 금색 림
  s += `<circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="${C.gold}" stroke-width="13"/>`;
  // 허브
  s += `<circle cx="${CX}" cy="${CY}" r="30" fill="${C.red}" stroke="${C.gold}" stroke-width="6"/>`;
  s += `<circle cx="${CX}" cy="${CY}" r="9" fill="${C.goldLight}"/>`;
  // 상단 포인터 (룰렛 화살표)
  s += `<path d="M${CX} ${CY - R - 26} L${CX - 22} ${CY - R - 60} L${CX + 22} ${CY - R - 60} Z" fill="${C.gold}" stroke="${C.redDeep}" stroke-width="4" stroke-linejoin="round"/>`;
  return s;
};

const bulbs = () => {
  let s = '';
  for (const [x, y] of ptsAt(212, 20, 9)) {
    s += `<circle cx="${f(x)}" cy="${f(y)}" r="8" fill="${C.goldLight}" stroke="${C.gold}" stroke-width="1.5"/>`;
  }
  return s;
};

const svg = ({ rounded, contentScale }) => {
  const bg = rounded
    ? `<rect x="0" y="0" width="512" height="512" rx="104" fill="url(#g)"/>`
    : `<rect x="0" y="0" width="512" height="512" fill="url(#g)"/>`;
  const inner = `${bulbs()}${wheel()}`;
  const content =
    contentScale === 1
      ? inner
      : `<g transform="translate(${CX} ${CY}) scale(${contentScale}) translate(${-CX} ${-CY})">${inner}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
<defs><radialGradient id="g" cx="50%" cy="38%" r="75%">
<stop offset="0%" stop-color="${C.red}"/><stop offset="100%" stop-color="${C.redDark}"/>
</radialGradient></defs>
${bg}${content}</svg>`;
};

mkdirSync('/tmp/ttarandi-icons', { recursive: true });
writeFileSync('/tmp/ttarandi-icons/any.svg', svg({ rounded: true, contentScale: 1 }));
writeFileSync('/tmp/ttarandi-icons/maskable.svg', svg({ rounded: false, contentScale: 0.78 }));
writeFileSync('/tmp/ttarandi-icons/favicon.svg', svg({ rounded: true, contentScale: 1 }));
console.log('icons svg written to /tmp/ttarandi-icons');
