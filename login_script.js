process.env.ORIGINS = "https://ejejejje.github.io,https://ejejejje.github.io/ejfactory.github.io";

const REQUIRED_ORIGIN_PATTERN = 
  /^((\*|([\w_-]{2,}))\.)*(([\w_-]{2,})\.)+(\w{2,})(\,((\*|([\w_-]{2,}))\.)*(([\w_-]{2,})\.)+(\w{2,}))*$/;

if (!process.env.ORIGINS.match(REQUIRED_ORIGIN_PATTERN)) {
  throw new Error('process.env.ORIGINS MUST be comma separated list of origins that login can succeed on.');
}

const origins = process.env.ORIGINS.split(',');

module.exports = (oauthProvider, message, content) => `
<script>
(function() {
  function contains(arr, elem) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].indexOf('*') >= 0) {
        const regex = new RegExp(arr[i].replaceAll('.', '\\\\.').replaceAll('*', '[\\\\w_-]+'))
        if (elem.match(regex) !== null) return true;
      } else if (arr[i] === elem) return true;
    }
    return false;
  }
  function recieveMessage(e) {
    if (!contains(${JSON.stringify(origins)}, e.origin.replace('https://', '').replace('http://', ''))) {
      console.log('Invalid origin: %s', e.origin);
      return;
    }
    window.opener.postMessage(
      'authorization:${oauthProvider}:${message}:${JSON.stringify(content)}',
      e.origin
    );
  }
  window.addEventListener("message", recieveMessage, false);
  window.opener.postMessage("authorizing:${oauthProvider}", "*");
})()
</script>`;
