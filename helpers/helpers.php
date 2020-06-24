<?php

function generateAttr($attr, $value) {
  if (isset($value)) {
    return $attr.'="'.$value.'"';
  } else {
    return '';
  }
}