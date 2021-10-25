import "./0.5.js";//"https://dap.js.org/0.5.js";
import boataround from "./grab/boataround.js";
import scrollfocus from "./jsm/scrollfocus.js";	

import mwx from "./jsm/weeks.js";
const mw = mwx("ru",Date.now());

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

'APP'.d("$shipclass= $week=`3 $bay= $book= $month=:date"

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
			
			,'SECTION.ships'.d("? $bay; Ships( ( `//api.boataround.com/v1/search? $bay:ba.slug@destinations `& $shipclass@)uri:query,ba.boats@ships )")//db@ `ships? $bay $week
		)		
		
	).a("focus $book:!")
	
	,'PAGE.book'.d("*@ $book" //
	
		,'ATTIC.brief'.d("! (.boat.make@title .boat.name@subtitle (.week.start:hum `— .week.end:hum)spaced )divs")
		
		,'ETAGE'.d(""
		
			,'A.xboatdetails target=boataround'.d("!! (`https://www.boataround.com/boat/ $book.boat.slug)concat@href")
						
			//www.boataround.com/enter-your-details/bavaria-44-fanourios?checkIn=2021-11-20&checkOut=2021-11-27
			
			,'cta'.d("! html.bookat")

			,'FORM target=boataround action=/submit _action=//www.boataround.com/final-details method=post'
				.d("! ($book._id@boat_id .week.start:iso@checkInDate .week.end:iso@checkOutDate)hiddens (`name `surname @email`email @tel`phone-number @submit)inputs")
				
			,'SECTION.info'.d("! html.book")
			
		)
		
	).a("focus $book")
	
)

.DICT({
	
	db: "//orders.saxmute.one/weeker/gate.php?",
	
	html: dict,
	
	shipclasses: options(dict.shipclasses.textContent.replace(/\+/g,"&")),
	
	Flag
	:'IMG.flag'.d("!! (`chrome/flags/ .flag@ `.png)uri@src"),

	Ships	
	:'ships'.d("*@ .ships"//
		,'offer'.d("$?="
			,'brief'.d("? .busy .busy=( .weeks $week )near; ! Flag (.make@title .name@subtitle .note .price )divs"
				,'specs'.d("! .specs:spans ")
/* 				,'weeks'.d("*@ .busy" 
					,'week'.d("!? .busy")
				)
 */			).ui("$?=$?:!")
 
			,'details'.d("? $?; focus $?@offer"
			
				,'gallery'.d("? .pics .pics=(db@ .slug)uri:query,ba.pics; * .pics@src"
					,'IMG'.d("!! .src")
				)
				
				,'dates'.d("$month=.."
				
					,'SELECT'.d("*@mo .mo=:mw.months"
						,'OPTION'.d("!! .mo:date@value .mo:mw.mmyy@")//!? (.value $month)eq@selected
					).ui("$month=#:value; ?")

					,'weeks'.d("$boat=$; *@ $month:saturdays" //? $book; 
						,'week'.d(""
							,'dates'.d("!! .start@title .start:hum@")
							,'price'.d("! (`//api.boataround.com/v1/price/ ..slug@ `? .start:iso@checkIn .end:iso@checkOut)uri:query,ba.price")
						).ui("$book=( $boat $@week )")
					)
				)
/*				
				,'more'.d(""
					,'checklists'.d()
					,'feedback'.d()
				)
				
				,'BUTTON.order `See charter details'.ui("$book=$")
*/
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
	
	convert:{ 	tsv, options, divs, spans, mw,
			ba:boataround.convert,
			saturdays:mw.weeks(6),
			
			date	: date => date&&date.toDateString(),
			hum	: date => date&&date.toDateString().split(" ").slice(0,3).join(" "),
			iso	: (pad => date => date&&[date.getFullYear(),pad(date.getMonth()+1),pad(date.getDate())].join("-"))(i=>i<10?"0"+i:i)
		}
	
})

.FUNC({convert:mapping})

.RENDER();