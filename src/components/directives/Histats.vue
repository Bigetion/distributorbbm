<template>
  <div>
    <div id="histats_counter"></div>
    <div id="inject"></div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.addScript('inject'," var _Hasync= _Hasync || [];_Hasync.push(['Histats.start', '1,3921365,4,3,170,30,00011111']);_Hasync.push(['Histats.fasi', '1']);_Hasync.push(['Histats.track_hits', '']);(function() {var hs = document.createElement('script'); hs.type = 'text/javascript'; hs.async = true;hs.src = ('//s10.histats.com/js15_as.js');(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(hs);})();")
  },
  methods: {
    addScript(inject,code){
        var _in = document.getElementById('inject');
        var scriptNode = document.createElement('script');
        scriptNode.innerHTML = code;
        _in.appendChild(scriptNode);
    }
  }
}
</script>