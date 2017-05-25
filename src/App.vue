<template>
  <pf-layout id="app">
    <div slot="brand" class="navbar-brand">
      <span class="navbar-brand-name">Vert.x Metrics</span>
    </div>
    <router-view></router-view>  
  </pf-layout>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style lang="scss">
  $line-color: #d1d1d1;

  .page header {
    border-bottom: 1px solid $line-color;
    margin-bottom: 25px;
    padding-bottom: 10px;
  }
</style>
