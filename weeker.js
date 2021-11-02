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

const geomap = gmap({ zoom: 4, center: {lat:50,lng:24}, disableDefaultUI: true, gestureHandling:'greedy' }),//{},//
	dap = window["https://dap.js.org/"],
	grab	= src	=> [...(src.parentNode.removeChild(src)).children].reduce((a,n)=>{if(n.id)a[n.id]=src.removeChild(n); return a},{}),
	html	= grab(document.getElementById("data"));
	
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

'APP'.d("$shipclass= $week=`3 $bay= $book= $month=:date" //`Crimea

	,'PAGE.area'.d(""//"a!"//
	
		,'ETAGE'.d(""
		
			,'SECTION.map#up'
				.d("geomap (`tsv/destinations.tsv)uri:query,bays")
				.e('marker',"$bay=#.value")
				
			,'ATTIC'.d(""
				,'H2'.d("! $bay").ui("focus `up")
				,'filter'.d(""
					,'SELECT.shipclass'.d("*@ shipclasses; ! Option").ui("$shipclass=#:value")
					,'SELECT'.d("*@mo .mo=:mw.months"
						,'OPTION'.d("!! .mo:date@value .mo:mw.mmyy@")
					).ui("$month=#:value; ?")
				)
			)
			
			,'SECTION'.d("? $bay; $shipclass $page=`1"
			
				,'bay'.d("a!")
				.a("? $page; .ships=( `//api.boataround.com/v1/search? $bay:ba.slug@destinations $page `& $shipclass@)uri:query,ba.boats; Ships( .ships )")
				
				,'more'.d('? $page').ui("$page=( (.ships.length `18)eq $page:++ :? )?!")
			)
			
			,'SECTION'.d("? $bay:!"
				//,'SELECT.destination'.d("*@ populardest; ! Option").ui("$bay=#:value")
				,'intro'.d("! html.intro html.book")
			)
		
		)		
		
	)//.a("focus $book:!")
	
/*	,'PAGE.book'.d("" //
	
		,'ETAGE'.d("? $book:!; ! html.book") //html.info
	
		//,'ATTIC.brief'.d("? $book; ! html.bookat")
		
		,'ETAGE'.d("*@ $book"
		
			,'brief.focused'.d("! (.boat.make@title .boat.name@subtitle (.week.start:hum `— .week.end:hum)spaced )divs")
		
			,'A.xboatdetails target=boataround'.d("!! (`https://www.boataround.com/ru/boat/ .boat.slug)concat@href")
						
			//www.boataround.com/enter-your-details/bavaria-44-fanourios?checkIn=2021-11-20&checkOut=2021-11-27

			,'FORM target=boataround _action=/submit action=https://www.boataround.com/final-details method=post'
				.d("! ($book._id@boat_id .week.start:iso@checkInDate .week.end:iso@checkOutDate)hiddens (`name `surname @email`email @tel`phone-number @submit)inputs")
				
			,'SECTION.info'.d("! html.book")
		)
		
	).a("focus $book")
*/
	
)

.DICT({ html,
	
	db: "//orders.saxmute.one/weeker/gate.php?",
	
	shipclasses: options(html.shipclasses.textContent.replace(/;/g,"&")),
	populardest: html.populardest.textContent.split("\n")
				.map(str=>str.split(", "))
				.map(a=>({value:a[0],title:a.join(", ")})),
	
	Option
	:'OPTION'.d("!! .title@ .value"),
	
	Flag
	:'IMG.flag'.d("!! (`chrome/flags/ .flag@ `.png)uri@src"),

	Ships	
	:'ships'.d("*@ .ships"//
		,'offer'.d("$?="
			,'brief'.d("? .busy .busy=( .weeks $week )near; ! (.make@title .name@subtitle .note .price )divs" // Flag
				,'specs'.d("! .specs:spans ")
/* 				,'weeks'.d("*@ .busy" 
					,'week'.d("!? .busy")
				)
 */			).ui("$?=$?:!")
 
			,'details'.d("? $?; focus $?@offer; ? .data .data=(db@ .slug)uri:query; *@ .data"
			
				,'gallery'.d("* .pics@src"
					,'IMG'.d("!! .src:ba.pic")
				)
				
				,'extras'.d("? .extras:??; *@ .extras"
					,'extra'.d("! (.title .week .day)spans")
				)
				
				,'weeks'.d("$boat=$; *@ $month:saturdays" //? $book; 
					,'week'.d(""
						,'dates'.d("!! .start:hum@")
						,'price'.d("! (`//api.boataround.com/v1/price/ ...slug@ `? .start:iso@checkIn .end:iso@checkOut)uri:query,ba.price")
						.ui("$book=( $boat $@week )")
					)
				)
/*				
				,'more'.d(""
					,'checklists'.d()
					,'feedback'.d()
				)focused
				
				,'BUTTON.order `See charter details'.ui("$book=$")
*/
				,'A.order target=_blank'.d("!! (`https://www.boataround.com/boat/ ..slug)concat@href")
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
				if(alias)
					value&&scrollfocus(node,alias);
				else{
					const a=document.getElementById(value);
					a&&a.scrollIntoView();
				}
			},
		
		geomap : (value,alias,node) => setTimeout( ()=> geomap(node,value), 10 ) // : ()=>{}
	},
	
	flatten:{
		divs, spans,
		inputs: (values,tags) => values.map( (name,i) => label({ name, type:tags[i]||'text', required:true }) ).reverse(),
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