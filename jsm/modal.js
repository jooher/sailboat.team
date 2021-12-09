export const

	scrim = 'scrim'.ui('.value=:?'),
	
	dialog = (...d) => 
		'modal'.d('startmodal',scrim,'DIALOG'.d(...d))//,scrim
		.u("log `u; value .value; endmodal")
		//.ui("log `ui; endmodal")
		.e("POPSTATE", "endmodal"),

	FUNC	= {
	
		convert:{
			wait: ($,r) => 
				r && new Promise((resolve,reject)=>{$.$post={resolve,reject};})
		},
		
		operate:{
			
			value:(value,name,node)=>{
				const data = node.$.getDataContext();
				data[name||"value"]=value;
				if(data.$post)
					data.$post.resolve(value||false);
			},
			
			startmodal	
			:(value,alias,node)=>{
				node.style.display="none";
				window.setTimeout(()=>{
					node.$parent=node.parentNode;
					document.body.appendChild(node);
					node.style.display="";
				},0);
			},
			
			endmodal
			:(value,name,node)=>{
				(value||node).remove();
			}
		}

	}