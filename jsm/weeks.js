const
	now = new Date(),
	sevens = [0,7,14,21],
	monthsloc = {
		ru	: "январь февраль март апрель май июнь июль август сентябрь октябрь ноябрь декабрь",
		ru_	: "янв фев мар апр май июн июл авг сен окт ноя дек",
		en	: "January February March April May June July August September October November December",
		en_	: "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec"
	};

export default lang => {
	
	const monthnames = monthsloc[lang].split(" "),
		months = (year,month)=>monthnames.map( (x,i) => new Date(year,month+i,1) ),
		monthsnow = months(now.getFullYear(),now.getMonth());
		
	return {
					
		months: mo => mo ? months(mo) : monthsnow,
		
		mmyy	: d => monthnames[d.getMonth()]+' '+d.getFullYear(),
		ddmm	: d => d.getDate(),
		
		weeks	: d => str =>{
				const date	= str ? new Date(str) : new Date(),
					year	= date.getFullYear(),
					month	= date.getMonth(),
					shift	= d+1 - new Date(year,month,1).getDay();//6-2=4
				return sevens.map( ofs => ({
						start: new Date(year,month,shift+ofs),
						end: new Date(year,month,shift+ofs+7)
					}));
			}				
	}
}