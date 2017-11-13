<!-- User Agent Helper -->
<?php /*
  Uneets uses this to enable mixins that target browsers specifically, mostly IE9, 10 and 11.
*/ ?>
<!-- https://gist.github.com/yoshuawuyts/8320300 -->
<script>
  var b = document.documentElement;
  b.setAttribute('data-useragent',  navigator.userAgent);
  b.setAttribute('data-platform', navigator.platform );
  b.className += ((!!('ontouchstart' in window) || !!('onmsgesturechange' in window))?' touch':'');
</script>
<!-- /User Agent Helper -->
