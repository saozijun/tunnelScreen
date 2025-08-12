<template>
  <Motion
    :style="{
      '--x': `${props.x}`,
      '--width': `${props.width}`,
      '--aspect-ratio': `${ar}`,
      '--background': `linear-gradient(#02a7f2, transparent)`,
    }"
    class="motion-box"
    :initial="{
      x: '-50%',
      y: '100cqmax',
    }"
    :animate="{
      x: '-50%',
      y: '-100%',
    }"
    :transition="{
      duration: props.duration,
      delay: props.delay,
      repeat: Infinity,
      ease: 'linear',
    }"
  ></Motion>
</template>

<script lang="ts" setup>
import { Motion } from "motion-v";
import { computed } from "vue";

interface Props {
  width: string | number;
  x: string | number;
  delay: number;
  duration: number;
}
const props = defineProps<Props>();

const hue = computed(() => Math.floor(Math.random() * 360));
const ar = computed(() => Math.floor(Math.random() * 10) + 1);
</script>

<style lang="scss" scoped>
.motion-box {
  position: absolute;
  left: var(--x);
  top: 0;
  width: var(--width);
  aspect-ratio: 1 / var(--aspect-ratio);
  background: var(--background);
  border-radius: 50%;
  filter: drop-shadow(0 0 0.5rem rgba(32, 121, 255, 0.95));
}
</style>
