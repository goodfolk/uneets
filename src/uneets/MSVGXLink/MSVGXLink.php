<?php //MSVGXLink 
$viewboxAttr = '';//generateAttr('viewbox', $viewBox);
$altAttr = generateAttr('alt', $alt);;
?>
<svg class="m_svgxlink" <?php echo $viewboxAttr; ?>  <?php echo $altAttr; ?> >
  <use xlink:href="/content/themes/cfc-theme/uneets/dist/assets/stack/svg/sprite.stack.svg#<?php echo $name ?>" />
</svg>