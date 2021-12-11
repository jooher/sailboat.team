const
	now = new Date(),
	sevens = [0,7,14,21],
	monthsloc = {
		ru	: "январь февраль март апрель май июнь июль август сентябрь октябрь ноябрь декабрь",
		ru_	: "янв фев мар апр май июн июл авг сен окт ноя дек",
		en	: "January February March April May June July August September October November December",
		en_	: "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec"
	},
	
	weeks = (year,month,day) => {
		const shift	= day+1 - new Date(year,month,1).getDay();
		return sevens.map( ofs => ({
			start: new Date(year,month,shift+ofs),
			end: new Date(year,month,shift+ofs+7)
		}));
	};

const
	weekOfDate = date => {
		const j1 = new Date(date.getFullYear(),0,1);
		return Math.ceil((((date - j1) / 86400000) + j1.getDay()+1)/7);
	},

	dateOfWeek = (year,week,day) => {
		return new Date(year, 0, week*7 + new Date(year,0,1).getDay() + day);
	};

export default lang => {
	
	const monthnames = monthsloc[lang].split(" "),
		months = (year,month)=>monthnames.map( (x,i) => new Date(year,month+i,1) ),//.toDateString()
		monthsnow = months(now.getFullYear(),now.getMonth());
		
	return {
					
		months: mo => mo ? months(mo) : monthsnow,
		
		mmyy	: d => monthnames[d.getMonth()]+' '+d.getFullYear(),
		ddmm	: d => d.getDate(),
		
		weeks	: d => str => {
				const date	= str ? new Date(str) : now,
					year	= date.getFullYear(),
					month	= date.getMonth();
				return weeks(year,month,d);
			}				
	}
}
/**/

