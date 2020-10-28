<template>
  <div id="app">
    <dataV></dataV>
  </div>
</template>

<script>

import dataV from "./components/dataV";
export default {
  name: 'App',
  components: {
    dataV
  }
}
</script>

<style>
  html{
    background: #06112c;
  }
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

</style>
