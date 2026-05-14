const CACHE_NAME = 'transport-app-v1';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// 1. تثبيت وحفظ الملفات في ذاكرة الهاتف
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

// 2. تفعيل وتنظيف الملفات القديمة
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

// 3. جلب البيانات (العمل بدون إنترنت)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // إرجاع الملف من الذاكرة إن وجد، وإلا جلبه من الإنترنت
            return cachedResponse || fetch(event.request);
        }).catch(() => {
            // في حالة فشل الإنترنت ولم يكن الملف في الذاكرة
            if (event.request.url.includes('index.html')) {
                return caches.match('./index.html');
            }
        })
    );
});
