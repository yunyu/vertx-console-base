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
</style>
