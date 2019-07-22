const path = require('path'),
  fs = require('fs');

script_urls = [
  'https://cdn.rawgit.com/ricmoo/aes-js/master/index.js',
  'https://cdn.rawgit.com/Caligatio/jsSHA/master/src/sha.js'
];

urls = ['msl_client.js'];

window.onload = function(e) {
  let mainScript = document.createElement('script');
  mainScript.type = 'application/javascript';
  mainScript.text = 'var use6Channels = ' + false; // TODO: Expose Config Option For 5.1 Audio
  document.documentElement.appendChild(mainScript);

  for (var i = 0; i < script_urls.length; i++) {
    let script = document.createElement('script');
    script.src = script_urls[i];
    document.documentElement.appendChild(script);
  }

  for (var i = 0; i < urls.length; i++) {
    let scriptBody = fs.readFileSync(path.resolve(__dirname, urls[i]), 'utf8');
    // console.log(scriptBody);

    let script = document.createElement('script');
    script.type = 'application/javascript';
    script.text = scriptBody;
    document.documentElement.appendChild(script);
  }

  alert('Injected Scripts Into Page');
};
