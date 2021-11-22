const

VERSION = 'v0.1p',

urlsToCache = [
/*	'./manifest.json',
	'./index.html',
	'./order-tracker.js',
	'./scanner.js',
	'./styles.css',
	'./scanner.css',
*/	'https://dap.js.org/0.5.js'
],


cached = ( _=>{
	
	let cache;

	const

	strategies = {
		// n: fetch,
		co: req => cache.match(req),
		nc: req => fetchncache(req).then( resp => resp || cache.match(req) ),
		cn: req => cache.match(req).then( resp => resp || fetchncache(req) ),
		swr:  async req => cache.add(req) && await cache.match(req)
	},	

	fetchncache = req => fetch(req).then( resp => resp && resp.ok && cache.put(req, resp.clone()) && resp );

	return (CACHE_NAME, decide) => event => {
		
		const
			req = event.request,
			strategy = strategies[decide(req)],
			promise = strategy && new Promise( async (resolve,reject) => {
				if(!cache)cache = await caches.open(CACHE_NAME);
				resolve( await strategy(req).catch(reject) );
			})
		
		event.respondWith(promise||fetch(req));
	}	
	
})();



events={

	install: event => {
			event.waitUntil( caches.open(VERSION).then( cache => cache.addAll(urlsToCache) ) );
			console.log("installed "+VERSION);
		},

	activate: event => {
			console.log('activated '+VERSION);
		},

	fetch: cached( VERSION, req =>
			req.method.toUpperCase()!='GET' ? 'n':
			req.url.includes("service-worker") ? 'n':
			req.url.includes("manifest.json") ? 'n':
			req.url.includes(".php") ? 'nc':
			"cn"
		),

	push:	event=>{  
		  var title = 'Yay a message.';  
		  var body = 'We have received a push message.';  
		  var icon = '/images/smiley.svg';  
		  var tag = 'simple-push-example-tag';
		  event.waitUntil(  
			self.registration.showNotification(title, {  
			  body: body,  
			  icon: icon,  
			  tag: tag  
			})  
		  );  
		}
		
	//message:

	//sync:

};

for(const i in events)
	self.addEventListener(i,events[i]);