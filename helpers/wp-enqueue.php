<?php 

// Enqueue scripts
function uneets_add_scripts()
{
  wp_register_script('uneets-dist', get_template_directory_uri() . '/uneets/dist/js/main.js', '1.1', true);
  wp_enqueue_script('uneets-dist');
}

add_action('wp_enqueue_scripts', 'uneets_add_scripts');  