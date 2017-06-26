<template>
  <pf-layout id="app" nomargin>
    <div slot="brand" class="navbar-brand">
      <span class="navbar-brand-name">Vert.x Console</span>
    </div>
    <template slot="vertical-menu">
      <router-link tag="li" class="list-group-item" active-class="active" v-for="route in routes" :key="route.path" :to="route.path" exact>
        <a>
          <span class="list-group-item-value">{{ route.name }}</span>
        </a>
      </router-link>
    </template>
    <router-view></router-view>
  </pf-layout>
</template>

<script>
export default {
  beforeCreate() {
    this.routes = this.$router.options.routes.map(el => (
      { path: el.path, name: el.component.name }
    ));
  }
}
</script>

<style lang="scss">
#app {
  height: calc(100vh - 60px);
}

.row-no-padding {
  &>[class*="col-"] {
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
</style>
