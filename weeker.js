import "./0.5.js";//"https://dap.js.org/0.5.js";//
import scrollfocus from "./jsm/scrollfocus.js";	
import wraps from "./jsm/wraps.js";

import mwx from "./jsm/weeks.js";

import {dialog, FUNC as modal} from "./jsm/modal.js";

const mw = mwx("ru",Date.now());

/*
import Await from "/./stuff/await.js";
import Persist from "/./stuff/persist.js";
import Starbar from "/./stuff/bricks/starbar.js";
*/	

import boataround from "./grab/boataround.js";

import gmap from "./jsm/geomap.js";

const geomap = gmap({ zoom: 4, center: {lat:50,lng:17}, disableDefaultUI: true, gestureHandling:'greedy' }),//{},//
	dap = window["https://dap.js.org/"],
	grab	= src	=> [...(src.parentNode.removeChild(src)).children].reduce((a,n)=>{if(n.id)a[n.id]=src.removeChild(n); return a},{}),
	html	= grab(document.getElementById("data"));
	
const tsv	= txt => txt.split(/\n/g).filter(s=>s).map(str=>str.split(/\t/g)), // Tab-separated values

	options = txt => tsv(txt).map( ([id,value,title])=>({value,title}) ),
	
	
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
		
		bays
		: txt => tsv(txt).map(
			([pos,qty,title])=>({
				id:title,
				pos:pos.split(":"),
				label:qty,
				title:title//+"\n"+prices
			})),
			
		ships
		: txt => tsv(txt).map(
				([id,weeks,shipclass,price,name,make,options,note])=>
				({id,weeks,shipclass,price,name,make,options,note})
			),
			
		searchresults
		: resp => resp&&resp.data&&resp.data.reduce(
				(a,obj)=>{ const t=obj.type; (a[t]||(a[t]=[])).push(obj); return a; },
				{}
			)
	};
	
//export default

const state="$boat=. $bay=. $month:check=. $shipclass=. ";//(.month :date)?; 

'APP'.d(state+"$book="

	,'PAGE.area'.d(""//"a!"//
	
		,'ETAGE'.d(""
		
			,'SECTION.map#up'
				.d("geomap (`tsv/destinations.tsv)uri:query,bays")
				.e('marker',"$bay=#.value $boat=")
				
			,'ATTIC'.d("$?="
				,'title'.d("! $bay").ui("focus `up")
				,'filter'.d(""
					,'SELECT.shipclass'.d("*@ shipclasses; ! Option").ui("$shipclass=#:value")
					,'SELECT'.d("*@mo .mo=:mw.months"
						,'OPTION'.d("!! .mo:date@value .mo:mw.mmyy@ (($month .mo:date)eq@selected")//
					).ui("$month=#:value")
				)
				,'icons'.d(""
					,'ICON.search'.ui("? .search=Search():wait")
					,'ICON.share'.ui('((`#! $shipclass $bay $month:mw.mmyy)uri@url ($bay $month)spaced@title ):share; ?')//
				)
			).u("?")

			,'SECTION'.d("? $boat; * (db@ $boat@slug)uri:query; ! Ship"
				,'more'.ui("$boat=")
			)
			
			,'SECTION'.d("? $boat:!; ? $bay; $shipclass $page=`1"
			
				,'bay'.d("a!")
				.a("? $page; *@ .ships=( `//api.boataround.com/v1/search? $bay:ba.slug@destinations $page `& $shipclass@)uri:query,ba.boats; ! Ship")
				
				,'more'.d('? $page')
				.ui("$page=( (.ships.length `18)eq $page:++ :? )?!")
			)
			
			,'SECTION'.d("? $bay:!"
				,'intro'.d("! html.intro html.book")
			)
		
		)		
		
	)
	
/*
	,'FORM target=boataround _action=/submit action=https://www.boataround.com/final-details method=post'
	.d("! ($book._id@boat_id .week.start:iso@checkInDate .week.end:iso@checkOutDate)hiddens (`name `surname @email`email @tel`phone-number @submit)inputs")
*/
	
)
.a("($boat $bay $month)uri:state")
.e('HASHCHANGE', "log `hash!; & @boat :state; "+state)

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
	:'ships'.d("*@ .ships; ! Ship"),
	
	Ship
	:'ARTICLE.offer'.d("$?=(.slug ..boat)eq; a!" //? .busy .busy=( .weeks $week )near; 
	
		,'ICON.share'.ui('((`#! .slug@boat $shipclass $bay $month)uri@url (.make .name)spaced@title ):share; ?')//
				
		,'brief'.d("! (.make@title .name@subtitle .note .price )divs" // Flag
			,'specs'.d("! .specs:spans ")
		).ui("$?=$?:!")

		,'details'.d("? $?; focus $?@offer; ? .data .data=(db@ .slug)uri:query; &@ .data"
		
			,'gallery'.d("* .pics@src"
				,'IMG'.d("!! .src:ba.pic")
			)
			
			,'extras'.d("? .extras:??; *@ .extras"
				,'extra'.d("! (.title .week .day .rental .person)spans")
			)
			
			,'weeks'.d("$boat=$; *@ $month:saturdays"
				,'week'.d(""
					,'dates'.d("!! .start:hum@")
					,'price'.d("! (`//api.boataround.com/v1/price/ ..slug@ `? .start:iso@checkIn .end:iso@checkOut)uri:query,ba.price")
					//.ui("$book=( $boat $@week )")
				)
			)
/*				
			,'more'.d(""
				,'checklists'.d()
				,'feedback'.d()
			)focused
			
			,'BUTTON.order `See charter details'.ui("$book=$")
*/
			,'VAULT'.d(""
				,'A.crew-boat target=_blank'.d("!! (`//jooher.github.io/crewit/# ..slug)uri@href")
				,'A.button.book-boat target=_blank'.d("!! (`//www.boataround.com/boat/ ..slug)concat@href")
			)
		)
	).a("!? $?@focused"),
		
	Weeks
	:'weeks'.d("*@ ( .weeks $week )near@week"
		,'week'.d("? .week; !! .week@title").ui("$book=(.week ..$)")
		,'week.busy'.d("? .week:!")
	),
	
	Search
	:dialog("$query="
	
		,"LABEL.search".d(""
			,'INPUT autofocus'.e("keyup",'? ("3 #.value.length)asc; $query=#:value; ?')
		)
		
		,'match'.d('? $query; $res=("//api.boataround.com/v1/autocomplete? $query)uri:query,searchresults'
		
			,'UL.ships'.d('*@ $res.boat'
				,'A'.d("!! .name@ (`#! .id@boat)uri@href ")//.ui("$boat=.id")
			)
/*
			,'UL.makes'.d('*@ $res.manufacturer'
				,'LI'.d("! .name").ui("$boat=.id")
			)
			,'UL.charters'.d('*@ $res.charter'
				,'A'.d("!! .name@ (`#! .id@bay)uri@href ")//.ui("$boat=.id")
			)
*/
			,'UL.marinas'.d('*@ $res.marina'
				,'A'.d("!! .name@ (`#! .name@bay)uri@href")//.ui("$boat=.id")
			)
			,'UL.regions'.d('*@ $res.region'
				,'A'.d("!! .name@ (`#! .name@bay)uri@href")//.d("! .name")
			)
		)
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
		near	: values=>near(values.pop(),values.pop(),2)
	},	
	
	convert:{ 	tsv, options, mw,
			ba:boataround.convert,
			saturdays:mw.weeks(6),
			
			date	: date => date&&date.toDateString(),
			hum	: date => date&&date.toDateString().split(" ").slice(0,3).join(" "),
			iso	: (pad => date => date&&[date.getFullYear(),pad(date.getMonth()+1),pad(date.getDate())].join("-"))(i=>i<10?"0"+i:i),
			
			share : data => navigator.share && navigator.share(data) && true,
			
			state	: (value,r) => {
					const present = r && location.href.split("#!")[1];
					
					if(value==null)
						return present && Object.fromEntries(new URLSearchParams(present));
					
					if(value!=present)
						return history.pushState(null,null,"#!"+value)
				}

		}
	
})

.FUNC({convert:mapping})
.FUNC(wraps,modal)

.RENDER();