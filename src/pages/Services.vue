<template>
  <div></div>
</template>

<script>
import Services from '../services.js';

export default {
  mounted() {
      Services.addCallback(services => console.log(JSON.stringify(services)));
  }
}
</script>
