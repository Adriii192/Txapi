/* Txapi: funciona sin conexion. Primero intenta la red (asi las actualizaciones llegan solas) y si no hay, usa lo guardado. */
var CACHE="txapi-v2";
var FILES=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FILES)}).then(function(){return self.skipWaiting()}))});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET")return;
  var u=new URL(e.request.url);
  if(/\.mp3$/.test(u.pathname))return;
  e.respondWith(fetch(e.request).then(function(r){
    if(r&&r.ok&&r.status===200&&u.origin===location.origin){var c=r.clone();caches.open(CACHE).then(function(ch){ch.put(e.request,c)})}
    return r;
  }).catch(function(){return caches.match(e.request).then(function(m){return m||caches.match("./")})}));
});
