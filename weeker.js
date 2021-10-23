import "./0.5.js";//"https://dap.js.org/0.5.js";
import boataround from "./grab/boataround.js";
import scrollfocus from "./jsm/scrollfocus.js";	

/*
import Await from "/./stuff/await.js";
import Persist from "/./stuff/persist.js";
import Starbar from "/./stuff/bricks/starbar.js";
*/

import gmap from "./jsm/geomap.js";

const geomap = gmap({ zoom: 4, center: {lat:50,lng:24}, disableDefaultUI: true, gestureHandling:'greedy' }),
	dap = window["https://dap.js.org/"],
	grab	= src	=> [...(src.parentNode.removeChild(src)).children].reduce((a,n)=>{if(n.id)a[n.id]=src.removeChild(n); return a},{}),
	dict	= grab(document.getElementById("data"));
	
const tsv	= txt => txt.split(/\n/g).filter(s=>s).map(str=>str.split(/\t/g)), // Tab-separated values

	options = txt => tsv(txt).map( ([id,value,title])=>({value,title}) ),
	
	wrap = (tag,cls,value) => {
		const el = document.createElement(tag);
		if(cls)el.classList.add(cls);
		if(value!==null)el.textContent = value;
		return el;
	},
	
	wraps = tag => (obj,tags) => {
		if(Array.isArray(obj))
			return obj.map( (value,i) => wrap(tag,tags[i],value) ).reverse();
		const els = [];
		for(const c in obj)els.push(wrap(tag,c,obj[c]));
		return els;
	},
	
	divs = wraps("div"),
	spans = wraps("span"),
	
	input = attrs => Object.assign(document.createElement("input"),attrs),
	
	label	= attrs => {
		const label = wrap("label",attrs.name);
		label.appendChild( input(attrs) );
		return label;
	},
	
	near = (weeks,week,margin) => {
		const bits=[],
			biw = BigInt(weeks);
			
		let	mask=1n<<BigInt(week-3),
			i = margin*2;
			
		while(i--)
			bits.push( biw&(mask+=mask) ? week+i : null )
		
		return bits;
	},
	
	mapping = {
		
		bays	: txt => tsv(txt).map(
			([pos,qty,title])=>({
				id:title,
				pos:pos.split(":"),
				label:qty,
				title:title//+"\n"+prices
			})),
			
		ships : txt => tsv(txt).map(
				([id,weeks,shipclass,price,name,make,options,note])=>({id,weeks,shipclass,price,name,make,options,note})
			)
	};
	
//export default

'APP'.d("$shipclass= $week=`3 $bay= $book="

	,'PAGE.area'.d("a!"//
	
		,'ETAGE'.d(""
		
			,'SECTION.map'
				.d("geomap (`tsv/destinations.tsv)uri:query,bays")
				.e('marker',"$bay=#.value")
				
			,'ATTIC'.d("? $bay"
				,'H2'.d("! $bay")
				,'SELECT.shipclass'.d("*@ shipclasses"
					,'OPTION'.d("!! .title@ .value")
				).ui("$shipclass=#:value")
			)
			
			,'SECTION.ships'.d("? $bay; Ships( ( `//api.boataround.com/v1/search? $bay:slug@destinations `& $shipclass@)uri:query,boats@ships )")//db@ `ships? $bay $week
		)		
		
	).a("focus $book:!")
	
	,'PAGE.book'.d(""
		,'ATTIC.brief'.d("! ($book.make@title $book.name@subtitle)divs")
	/*
		,'weeks'.d("* (db@ `price $boat.slug $month:weeks)uri@query:tsv"
			'week'.d("! (.price .week:week2date)divs").ui("$week=.")
		)
	*/
		,"FORM action=/submit _action=https://www.boataround.com/final-details method=post target=boataround"
			.d("! ($book._id@boat_id)hiddens (`name @email`email @tel`phone-number @week`week @submit)inputs")
	).a("focus $book")
	
)

.DICT({
	
	db: "//orders.saxmute.one/weeker/gate.php?",
	
	
	shipclasses: options(dict.shipclasses.textContent.replace(/\+/g,"&")),
	
	Flag
	:'IMG.flag'.d("!! (`chrome/flags/ .flag@ `.png)uri@src"),

	Ships	
	:'ships'.d("*@ .ships"//
		,'offer'.d("$?="
			,'brief'.d("? .busy .busy=( .weeks $week )near; ! Flag (.make@title .name@subtitle .note .price )divs "
				,'specs'.d("! .specs:spans ")
				,'weeks'.d("*@ .busy" 
					,'week'.d("!? .busy")
				)
			).ui("$?=$?:!")
			,'details'.d("? $?; focus $?@offer"
				,'gallery'.d("? .pics .pics=(db@ .slug)uri:query,pics; * .pics@src"
					,'IMG'.d("!! .src")
				)
				
				,'more'.d(""
					,'checklists'.d()
					,'feedback'.d()
				)
				
				,'BUTTON.order `See charter details'.ui("$book=$")
			)
		).a("!? $?@focused")
	),
		
	Weeks
	:'weeks'.d("*@ ( .weeks $week )near@week"
		,'week'.d("? .week; !! .week@title").ui("$book=(.week ..$)")
		,'week.busy'.d("? .week:!")
	)
		
})

.FUNC({
	
	operate:{
		"!!!" : (value,alias,node)=>{
			const el=document.createElement('div');
			el.classList.add(alias);
			el.textContent=value;
			dap.Env.Print(node,el);
		},
		
		focus	:(value,alias,node)=>{
				if(value)scrollfocus(node,alias);
			},
		
		geomap : (value,alias,node) => setTimeout( ()=> geomap(node,value), 10 ) // : ()=>{}
	},
	
	flatten:{
		divs, spans,
		inputs: (values,tags) => values.map( (name,i) => label({ name, type:tags[i]||'text' }) ).reverse(),
		hiddens: (values,tags) => values.map( (value,i) => input({ name:tags[i], value, type:'hidden'}) ),
		near	: values=>near(values.pop(),values.pop(),2)
	},
	
	convert:{ tsv, options, divs, spans	}
	
})

.FUNC({convert:mapping})

.FUNC({convert:boataround.convert})

.RENDER();