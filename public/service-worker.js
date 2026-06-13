/* 따랜디 서비스워커 — 앱 셸 + 데이터 오프라인 캐시
 * 주의: CRA 해시 번들(static/js·css)은 빌드 시 이름을 알 수 없어 런타임 캐시로 채운다.
 * 따라서 완전 오프라인은 최초 1회 온라인 방문(번들 로드) 이후 보장된다. */
const CACHE = 'ttarandi-v2';
const CORE = ['./', './index.html', './manifest.json', './defend.xlsx'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  // 항목별로 캐시 → 하나 실패해도 나머지는 살린다 (addAll 원자성 회피)
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      Promise.all(CORE.map((url) => cache.add(url).catch(() => undefined))),
    ),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (
    request.method !== 'GET' ||
    new URL(request.url).origin !== self.location.origin
  ) {
    return;
  }

  // 페이지 내비게이션: 네트워크 우선, 실패 시 캐시된 셸로 폴백 (SPA 딥링크 대응)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(
        () => caches.match(request).then((r) => r || caches.match('./index.html')),
      ),
    );
    return;
  }

  // 정적/데이터: 캐시 우선, 네트워크 응답은 캐시에 갱신
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request)
          .then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
            return res;
          })
          .catch(() => cached),
    ),
  );
});
