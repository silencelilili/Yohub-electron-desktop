<template>
  <svg
    aria-hidden="true"
    class="svg-icon"
    :width="props.size"
    :height="props.size"
  >
    <use :xlink:href="symbolId" rel="external nofollow" />
  </svg>
</template>

<script setup lang="ts">
import { computed, defineProps } from "vue";
const props = defineProps({
  prefix: {
    type: String,
    default: "icon",
  },
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: "#B3C0E7",
  },
  size: {
    type: String,
    default: "1em",
  },
});
const symbolId = computed(() => `#${props.prefix}-${props.name}`);
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  /* vertical-align: -0.15em; */
  vertical-align: middle;
  fill: currentColor;
  overflow: hidden;
  outline: none;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
