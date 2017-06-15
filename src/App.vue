<template>
  <pf-layout id="app" nomargin>
    <div slot="brand" class="navbar-brand">
      <span class="navbar-brand-name">Vert.x Console</span>
    </div>
    <template slot="vertical-menu">
      <router-link tag="li" class="list-group-item" active-class="active" to="/" :exact="true">
        <a>
          <span class="list-group-item-value">Overview</span>
        </a>
      </router-link>
      <router-link tag="li" class="list-group-item" active-class="active" to="/logging" :exact="true">
        <a>
          <span class="list-group-item-value">Logging</span>
        </a>
      </router-link>
      <router-link tag="li" class="list-group-item" active-class="active" to="/services" :exact="true">
        <a>
          <span class="list-group-item-value">Services</span>
        </a>
      </router-link>
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
import Services from './services.js';
import Loggers from './loggers.js';

export default {
  name: 'app',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}

Metrics.initialize('/metrics');
Services.initialize('/discovery');
Loggers.initialize('/loggers');
</script>

<style lang="scss">
#app {
  height: calc(100vh - 60px);
}

.row-no-padding {
  & > [class*="col-"] {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
}

.pf-layout-container {
  height: 100%;
  min-height: 100%;
}

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
