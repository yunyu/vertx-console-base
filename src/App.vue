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
  
      <div class="list-group-item">
        <a>
          <span class="list-group-item-value">Logging</span>
        </a>
      </div>
      <div class="list-group-item">
        <a>
          <span class="list-group-item-value">Services</span>
        </a>
      </div>
      <div class="list-group-item">
        <a>
          <span class="list-group-item-value">Circuit Breakers</span>
        </a>
      </div>
      <div class="list-group-item">
        <a>
          <span class="list-group-item-value">Settings</span>
        </a>
      </div>  
    </template>
  
    <router-view></router-view>
  </pf-layout>
</template>

<script>
import Metrics from './metrics.js';

export default {
  name: 'app',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}

Metrics.initialize('http://twitterwall.yunyul.in/metrics');
</script>

<style lang="scss">
.navbar-brand-name {
  line-height: 35px; // Full height
}

.c3 svg {
  font-family: "Open Sans", Helvetica, Arial, sans-serif;
}

.row-eq-height {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}
</style>
