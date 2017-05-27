<template>
  <pf-layout id="app">
    <div slot="brand" class="navbar-brand">
      <span class="navbar-brand-name">Vert.x Metrics</span>
    </div>
    <template slot="vertical-menu">
      <router-link tag="li" class="list-group-item" active-class="active" to="/" :exact="true">
        <a>
          <span class="list-group-item-value">Overview</span>
        </a>
      </router-link>
    </template>
  
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
.navbar-brand-name {
  line-height: 35px; // Full height
}
</style>
