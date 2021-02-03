<template>
  <div>
    <div :id="'myvideo' + videoIndex" style="width:100%;height:30vh;"></div>
  </div>
</template>
<script>
import flv from 'flv.js';
import DPlayer from 'dplayer';
export default {
  props: {
    videoIndex: Number,
    videoUrl: String,
  },
  mounted() {
    const dp = new DPlayer({
      container: document.getElementById('myvideo' + this.videoIndex),
      mutex: false,
      autoplay: true,
      video: {
        url: this.videoUrl,
        type: 'customFlv',
        customType: {
          customFlv: function(video) {
            const flvPlayer = flv.createPlayer({
              type: 'flv',
              url: video.src,
            });
            flvPlayer.attachMediaElement(video);
            flvPlayer.load();
          },
        },
      },
    });
    console.log(dp);
  },
};
</script>
