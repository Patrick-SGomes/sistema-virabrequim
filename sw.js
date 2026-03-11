const CACHE='crankcat-sheets-v1';
const CORE=['./', './index.html', './manifest.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(u.hostname.includes('script.google')||u.hostname.includes('googleapis'))return;
  e.respondWith(caches.match(e.request).then(c=>{
    if(c)return c;
    return fetch(e.request).then(r=>{
      if(r&&r.status===200&&u.origin===location.origin)
        caches.open(CACHE).then(ca=>ca.put(e.request,r.clone()));
      return r;
    }).catch(()=>e.request.mode==='navigate'?caches.match('./index.html'):undefined);
  }));
});
