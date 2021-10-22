//import "https://maps.googleapis.com/maps/api/js?key=AIzaSyBALH6vLZir1LYeGlRryY66aKjo3Kji90o&callback=initMap&v=weekly";

const gm = google.maps,
	gd = gm.Data,
	
	Marker = point => {
		const m = new gm.Marker(point);
		m.setPosition(new gm.LatLng(...point.pos));
		//m.setOptimized(true);
		return m;
	};


export default options => (container,points) => {
	
	const map = new gm.Map(container, options );
	
	map.addListener('mouseup', e=> console.log(map.center.lat()+" : "+map.center.lng()+" @ "+map.zoom));
	
	points.map(Marker).forEach(m => {
		m.setMap(map);
		m.addListener("click", e=>{
			map.panTo(m.getPosition());
			container.value = m.id;
			container.dispatchEvent( new CustomEvent('marker', { detail:m }));
		});
		
		map.addListener('click', e=>{
			map.panTo(e.latLng);
		});
		
	});
			
}
