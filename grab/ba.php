<?
$sp=preg_split('/&/',$_SERVER['QUERY_STRING'],2)[0];

switch($sp){
	case 'pics'	: pics(); break;
	case 'weeks': weeks(); break;
}

function pics(){
	$html = file_get_contents('https://www.boataround.com/boat/'.$_GET['slug']);
	preg_match('src="https:\/\/imageresizer.yachtsbt.com\/boats\/(.*)\?',$html,$pics);
	echo $pics;
}
?>