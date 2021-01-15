<template>
  <div>
    <video-player
      class="vjs-custom-skin"
      ref="videoPlayer"
      :options="playerOptions"
      @ready="onPlayerReadied"
      @timeupdate="onTimeupdate"
    >
    </video-player>
  </div>
</template>

<script>
export default {
  data() {
    return {
      initialized: false,
      currentTech: 'RTMP',
      streams: {
        rtmp: 'rtmp://172.51.215.157/live/livestream/test',
        hls: '',
      },
      playerOptions: {
        overNative: true,
        muted: true,
        autoplay: true,
        controls: true,
        techOrder: ['flash'],
        sourceOrder: true,
        flash: {
          hls: { withCredentials: false },
          swf: '/video-js.swf',
        },
        html5: { hls: { withCredentials: false } },
        sources: [
          {
            type: 'rtmp/mp4',
            src: 'rtmp://172.51.215.157/live/livestream/test', // 目前是写死的 后期娇阳通过接口返回给我
          },
          {
            withCredentials: false,
            type: 'application/x-mpegURL',
            src:
              'http://playertest.longtailvideo.com/adaptive/bipbop/gear4/prog_index.m3u8',
          },
        ],
        poster: '/static/logo.png',
        controlBar: {
          timeDivider: false, // 时间分割线
          durationDisplay: false, // 总时间
          progressControl: true, // 进度条
          customControlSpacer: true, // 未知
          fullscreenToggle: true, // 全屏
        },
      },
    };
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player;
    },
  },
  methods: {
    onPlayerReadied() {
      if (!this.initialized) {
        this.initialized = true;
        this.currentTech = this.player.techName_;
      }
    },
    // record current time
    onTimeupdate(e) {
      console.log('currentTime', e.cache_.currentTime);
    },
    enterStream() {
      this.playerOptions.sources[0].src = this.streams.rtmp;
      this.playerOptions.autoplay = true;
    },
    changeTech() {
      this.playerOptions.techOrder = ['flash'];
      this.playerOptions.autoplay = true;
    },
  },
};
</script>

<style lang="scss">
.video-js {
  height: 30vh !important;
}
</style>
