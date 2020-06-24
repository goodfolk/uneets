<?php //UBody ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="<?php bloginfo('charset'); ?>" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title><?php echo get_bloginfo('name'); ?></title>
  <?php wp_head(); ?>
  <?php if (defined('IS_LIVE') && IS_LIVE) : ?>
    <?php // any live env tags go here ?>
  <?php endif; ?>
</head>
<body class="u_body">
  <?php get_header(); ?>
  <main class="main-content">
    <?php 
    if ($yieldTo) {
      get_uneet($yieldTo, $yieldParams);
    };
    ?>
  </main>
  <?php get_footer(); ?>
  <?php wp_footer(); ?>
</body>
</html>