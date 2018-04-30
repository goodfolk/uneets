<?php
/**
 * Like get_template_part() put lets you pass args to the template file
 * Args are available in the tempalte as $params array
 * @param string filepart
 * @param mixed wp_args style argument list
 */
function get_uneet( $file, $params = array(), $cache_args = array() ) {;
    $currentPartialsLocation = 'uneets/dist/php-partials/';
    $file = $currentPartialsLocation . $file;
    $params = wp_parse_args( $params );
    $cache_args = wp_parse_args( $cache_args );
    if ( $cache_args ) {
        foreach ( $params as $key => $value ) {
            if ( is_scalar( $value ) || is_array( $value ) ) {
                $cache_args[$key] = $value;
            } else if ( is_object( $value ) && method_exists( $value, 'get_id' ) ) {
                $cache_args[$key] = call_user_method( 'get_id', $value );
            }
        }
        if ( ( $cache = wp_cache_get( $file, serialize( $cache_args ) ) ) !== false ) {
            if ( ! empty( $params['return'] ) )
                return $cache;
            echo $cache;
            return;
        }
    }
    $file_handle = $file;
    do_action( 'start_operation', 'hm_template_part::' . $file_handle );
    if ( file_exists( get_stylesheet_directory() . '/' . $file . '.php' ) )
        $file = get_stylesheet_directory() . '/' . $file . '.php';
    elseif ( file_exists( get_template_directory() . '/' . $file . '.php' ) )
        $file = get_template_directory() . '/' . $file . '.php';
    ob_start();
    $return = require( $file );
    $data = ob_get_clean();
    do_action( 'end_operation', 'hm_template_part::' . $file_handle );
    if ( $cache_args ) {
        wp_cache_set( $file, $data, serialize( $cache_args ), 3600 );
    }
    if ( ! empty( $params['return'] ) )
        if ( $return === false )
            return false;
        else
            return $data;
    echo $data;
}