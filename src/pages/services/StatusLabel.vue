<template>
<span :class="{ 'status-label': true, 'up': isPositive, 'down': !isPositive }">{{ row.status }}</span>
</template>

<style lang="scss">
.status-label {
    font-weight: bold;
    &.up {
        color: #3f9c35;
    }
    &.down {
        color: #c00;
    }
}
</style>

<script>
export default {
  props: {
      row: Object
  },
  options: {
      asPlainText(row) {
        return row.status;
      }
  },
  computed: {
      isPositive() {
          return this.row.status === 'UP';
      }
  }
}
</script>
