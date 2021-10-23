const
	weeks = day => monthstr =>{
			const shift = new Date(monthstr).getDay();
			return [0,7,14,28].map( ofs=>new Date(year,month,day+ofs-shift) );
		},
	saturdays = weeks(6);

	monthsahead = month => new Array(12).map(x,i=>i>month ? {month:i-month, year}:{month:i+12-month, year:year+1})
	monthsoptions = monthnames => months => months.map( m => 
		({value:m.year+"-"+m.month, title: monthnames[month]+" "+year})
	),
	
	w = str => str.split(" ")
	
months:{
	ru	: w("январь февраль март апрель май июнь июль август сентябрь октябрь ноябрь декабрь"),
	ru_	: w("янв фев мар апр май июн июл авг сен окт ноя дек"),
	en	: w("January February March April May June July August September October November December"),
	en_	: w("Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec")
}

export default {
	(lang,from) => monthsoptions(months[lang])(monthsahead((from||Date.now()).getMonth()));

import weeks from "weeks.js";

const

rumonths = 

	

'SELECT.month'.d("*@ monthsahead"
	'OPTION'.d()
)

'weeks'

.DICT({
	
	months: weeks.
})

.FUNC({
	
})
