<?
echo 'trying\n';
$html = file_get_contents('https://www.boataround.com/boat/'.$_GET['slug']);
preg_match('src="https:\/\/imageresizer.yachtsbt.com\/boats\/(.*)\?',$html,$pics);
echo $pics;
?>