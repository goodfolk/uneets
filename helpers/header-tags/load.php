<!-- load helper -->
<?php /*
  The load helper turns document.ready into a promise.
  Can be modified to turn other necessary script loads into promises, such as Google Maps.
  Runs UBody when it finishes, modify if necessary.
*/ ?>

<!-- original code -->
<script>
// this function will start the Uneets code.
  if (!(!!window.MSInputMethodContext && !!document.documentMode)) {
    document.startUBody = () => {
      const body = document.querySelector('body.u_body')
      if (body !== null) {
        document.ready.then(() => {
          const bodyUneet = new UBody(body)
        })
      }
    }

    // turn document ready into a promise
    document.ready = new Promise(((resolve) => {
      if (document.readyState === 'complete') {
        resolve()
      } else {
        const onReady = function () { // eslint-disable-line func-names
          resolve()
          document.removeEventListener('DOMContentLoaded', onReady, true)
          window.removeEventListener('load', onReady, true)
        }
        document.addEventListener('DOMContentLoaded', onReady, true)
        window.addEventListener('load', onReady, true)
      }
    }))

    // Start uneets when the map and the document are ready
    Promise.all([document.ready]).then(() => {
      document.startUBody()
    }).catch((reason) => {
      console.error(reason)
    })
  }
</script>
<!-- transpiled version here, thanks https://babeljs.io/repl/ -->
<script>
  'use strict';
  if (!!window.MSInputMethodContext && !!document.documentMode) {
    // this function will start the Uneets code.
    document.startUBody = function () {
      var body = document.querySelector('body.u_body');
      if (body !== null) {
        document.ready.then(function () {
          var bodyUneet = new UBody(body);
        });
      }
    }

    // turn document ready into a promise
    document.ready = new Promise(function (resolve) {
      if (document.readyState === 'complete') {
        resolve();
      } else {
        var onReady = function onReady() {
          // eslint-disable-line func-names
          resolve();
          document.removeEventListener('DOMContentLoaded', onReady, true);
          window.removeEventListener('load', onReady, true);
        };
        document.addEventListener('DOMContentLoaded', onReady, true);
        window.addEventListener('load', onReady, true);
      }
    });

    // Start uneets when the map and the document are ready
    Promise.all([document.ready]).then(function () {
      document.startUBody();
    }).catch(function (reason) {
      console.error(reason);
    });
  }
</script>
<!-- // load helper -->
