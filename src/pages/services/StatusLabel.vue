<template>
<span>{{ isPositive }}</span>
</template>

<script>
export default {
  props: {
      row: Object
  },
  options: {
      asPlainText() {
        return true;
      }
  },
  computed: {
      isPositive() {
          console.log(JSON.stringify(this.row));
          return '420';
      }
  }
}
</script>
