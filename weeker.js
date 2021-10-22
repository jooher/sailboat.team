import "./0.5.js";//"https://dap.js.org/0.5.js";
import boataround from "./grab/boataround.js";

/*
import Await from "/./stuff/await.js";
import Persist from "/./stuff/persist.js";
import scrollfocus from "/./stuff/scrollfocus.js";	
import Starbar from "/./stuff/bricks/starbar.js";
*/

import geomap from "./jsm/geomap.js";

const dap = window["https://dap.js.org/"],
	grab	= src	=> [...(src.parentNode.removeChild(src)).children].reduce((a,n)=>{if(n.id)a[n.id]=src.removeChild(n); return a},{}),
	dict	= grab(document.getElementById("data"));

const tsv	= txt => txt.split(/\n/g).filter(s=>s.length).map(str=>str.split(/\t/g)), // Tab-separated values

	options = txt => tsv(txt).map( ([id,value,title])=>({value,title}) ),
	
	wrap = (value,cls,tag) => {
		const el = document.createElement(tag);
		el.classList.add(cls);
		el.textContent = value;
		return el;
	},
	
	wraps = tag => obj => {
		const els = [];		
		for(const c in obj)
			els.push(wrap(obj[c],c,tag));
		return els;
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
	
	mappings = {
		
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

'APP'.d("$shipclass= $week=`3 $bay= $ship= $book="

	,'PAGE.area'.d("? $ship:!"
	
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
		
	)
	
	,'PAGE.book'.d("? $book; ! `book"
	
		
	)
)

.DICT({
	
	db: "//orders.saxmute.one/weeker/gate.php?",
	
	
	shipclasses: options(dict.shipclasses.textContent.replace(/\+/g,"&")),
	
	Flag
	:'IMG.flag'.d("!! (`chrome/flags/ .flag@ `.png)uri@src"),

	Ships	
	:'ships'.d("*@ .ships"//
		,'offer'.d("$?="
			,'brief'.d("? .busy .busy=( .weeks $week )near; ! Flag (.make@title .name@subtitle .note .price ):divs "
				,'specs'.d("! .specs:spans ")
				,'weeks'.d("*@ .busy" 
					,'week'.d("!? .busy")
				)
			).ui("$?=$?:!")
			,'details'.d("? $?"
				,'gallery'.d("? .pics .pics=(db@ .slug)uri:query,pics; * .pics@src"
					,'IMG'.d("!! .src")
				)
				
				
				,'more'.d(""
					,'checklists'.d()
					,'feedback'.d()
				)
				
				,'BUTTON.order `See charter details'.d()
				
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
		
		geomap : (value,alias,node) => setTimeout( ()=> geomap(node,value), 10 ) // : ()=>{}
	},
	
	flatten:{
		near	: values=>near(values.pop(),values.pop(),2)
	},
	
	convert:{ tsv, options, 
		divs: wraps("div"),
		spans: wraps("span") 
	}
	
})

.FUNC({convert:mappings})

.FUNC({convert:boataround.convert})

.RENDER();