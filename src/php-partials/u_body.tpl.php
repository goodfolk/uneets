<?php // u_body ?>
<body class="u_body">
  <div class="header-container">
    <?php get_uneet('UMainHeader', variable_get('header_data')); ?>
  </div>
  <div class="body-content-area">
    <main>
      <?php foreach($yield_to as $index => $uneet) {
        get_uneet($uneet, $yield_params[$index]);
      }?>
    </main>
    <?php get_uneet('UMainFooter', variable_get('footer_data')); ?>
  </div>
  <?php if ( !(isset($yield_params[0]['hide_overlay']) && $yield_params[0]['hide_overlay']) ): 
    // The structure of u_body changes on some system's templates like login ?>
    <div class="overlay-container">
      <?php get_uneet('UOverlay', null ); ?>
    </div>
  <?php endif; ?>
</body>
