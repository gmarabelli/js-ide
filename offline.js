const CACHE_NAME = "js-ide";

self.addEventListener("install", async (event) => {
	event.waitUntil((async () => {
		const cache = await caches.open(CACHE_NAME);
		await cache.addAll([
			"./",
			"index.html",
			"style.css",
			"script.js",
			"install.css",
			"install.js",
			"manifest.json",
			"icon.png",
			//"screenshot.png",
		]);
	})());
});

self.addEventListener("fetch", async (event) => {
	event.respondWith((async () => {
		const cache = await caches.open(CACHE_NAME);
		return cache.match(event.request);
	})());
});