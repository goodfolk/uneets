<?php

function svg_map($def, $customViewBox = "", $echo = FALSE) {
	$getPath = null;
	if (function_exists('get_template_directory_uri')) {
		$getPath = get_template_directory_uri();
	}
	if (function_exists('path_to_theme')) {
		$getPath = $GLOBALS['base_url']."/".drupal_get_path('theme',$GLOBALS['theme']);
	}
	$svgMapLocation = $getPath."/uneets/dist/assets/imgs/svg-map.svg#";
	$output = '';
	$output = $output."<svg ".$customViewBox.">\n";
	$output = $output."\t<use xlink:href=\"".$svgMapLocation.$def."\"></use>\n";
	$output = $output."</svg>";
	if ($echo) {
		echo $output;
	} else {
		return $output;
	}
}
