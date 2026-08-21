// Core assets
let coreAssets = [
	'/',
	'/index.html',
	'/about.html',
	'/resume.html',
	'/portfolio.html',
	'/contact.html',
	'/offline.html',
	'/manifest.webmanifest',
	'/js/carousel.js',
	'/favicon.ico',
	'/favicon144.png',
	'/favicon192.png',
	'/faviconbigger.png'
];

// On install, cache core assets
self.addEventListener('install', function (event)
{
	// Cache core assets, waiting for every one to finish
	event.waitUntil(caches.open('app').then(function (cache)
	{
		return Promise.all(coreAssets.map(function (asset)
		{
			return cache.add(new Request(asset)).catch(function (error)
			{
				console.warn('Failed to cache', asset, error);
			});
		}));
	}));
});

// Listen for request events
self.addEventListener('fetch', function (event)
{
	// Get the request
	let request = event.request;

	// Bug fix
	// https://stackoverflow.com/a/49719964
	if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin')
	{
		return;
	}

	let accept = request.headers.get('Accept') || '';

	// HTML files
	// Network-first
	if (accept.includes('text/html'))
	{
		event.respondWith(
			fetch(request).then(function (response)
			{

				// Create a copy of the response and save it to the cache
				let copy = response.clone();
				event.waitUntil(caches.open('app').then(function (cache)
				{
					return cache.put(request, copy);
				}));

				// Return the response
				return response;

			}).catch(function (error)
			{
				// If there's no item in cache, respond with a fallback
				return caches.match(request).then(function (response)
				{
					return response || caches.match('/offline.html');
				});

			})
		);
		return;
	}

	// CSS & JavaScript
	// Offline-first
	if (accept.includes('text/css') || accept.includes('text/javascript') || accept.includes('application/javascript'))
	{
		event.respondWith(
			caches.match(request).then(function (response)
			{
				return response || fetch(request).then(function (response)
				{
					return response;
				}).catch(function (error)
				{
					console.warn('Failed to fetch', request.url, error);
				});
			})
		);
		return;
	}

	// Images
	// Offline-first
	if (accept.includes('image'))
	{
		event.respondWith(
			caches.match(request).then(function (response)
			{
				return response || fetch(request).then(function (response)
				{
					// Save a copy of it in cache
					let copy = response.clone();
					event.waitUntil(caches.open('app').then(function (cache)
					{
						return cache.put(request, copy);
					}));

					return response;
				}).catch(function (error)
				{
					console.warn('Failed to fetch', request.url, error);
				});
			})
		);
		return;
	}
});