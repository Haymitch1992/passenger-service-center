<template>
  <div id="data-view">
    <dv-full-screen-container>
      <router-view></router-view>
    </dv-full-screen-container>
  </div>
</template>

<script>
export default {
  name: "dataV",
};
</script>

<style lang="scss">
#data-view {
  width: 100%;
  height: 100%;
  background-color: #030409;
  color: #fff;

  #dv-full-screen-container {
    background: linear-gradient(#122c77, #061029);
    display: flex;
    flex-direction: column;
  }
}
</style>
