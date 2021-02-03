<template>
  <div>
    <video
      :id="'myvideo' + videoIndex"
      @click="click"
      style="width:100%;height:30vh;"
    ></video>
  </div>
</template>

<script>
import flv from 'flv.js';
export default {
  props: {
    videoIndex: Number,
    videoUrl: String,
  },
  data() {
    return {
      player: null,
      playing: false,
    };
  },
  created() {
    if (flv.isSupported()) {
      this.player = flv.createPlayer({
        type: 'flv',
        url: this.videoUrl,
      });
    }
  },
  mounted() {
    var video = document.querySelector('#myvideo' + this.videoIndex);
    this.player.attachMediaElement(video);
    this.player.load();
  },
  methods: {
    click() {
      if (this.playing) {
        this.player.pause();
        this.playing = false;
      } else {
        this.player.play();
        this.playing = true;
      }
    },
  },
};
</script>

<style lang="scss"></style>
