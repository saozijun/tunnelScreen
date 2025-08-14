<template>
  <div class="bg-main" :class="['relative rounded border', props.class]">
    <div
      :style="{
        '--perspective': `${props.perspective}px`,
        '--grid-color': props.gridColor,
        '--beam-size': `${props.beamSize}%`,
      }"
      class="grid-container"
    >
      <div class="grid-side top">
        <Beam
          v-for="(beam, index) in topBeams"
          :key="`top-${index}`"
          :width="`${props.beamSize}%`"
          :x="`${beam.x * props.beamSize}%`"
          :delay="beam.delay"
          :duration="beamDuration"
        />
      </div>
      <div class="grid-side bottom">
        <Beam
          v-for="(beam, index) in bottomBeams"
          :key="`bottom-${index}`"
          :width="`${props.beamSize}%`"
          :x="`${beam.x * props.beamSize}%`"
          :delay="beam.delay"
          :duration="beamDuration"
        />
      </div>
      <div class="grid-side left">
        <Beam
          v-for="(beam, index) in leftBeams"
          :key="`left-${index}`"
          :width="`${props.beamSize}%`"
          :x="`${beam.x * props.beamSize}%`"
          :delay="beam.delay"
          :duration="beamDuration"
        />
      </div>
      <div class="grid-side right">
        <Beam
          v-for="(beam, index) in rightBeams"
          :key="`right-${index}`"
          :width="`${props.beamSize}%`"
          :x="`${beam.x * props.beamSize}%`"
          :delay="beam.delay"
          :duration="beamDuration"
        />
      </div>
    </div>

    <div class="relative">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Beam from "./Beam.vue";
import { computed } from "vue";

interface Props {
  perspective?: number;
  beamsPerSide?: number;
  beamSize?: number;
  beamDelayMax?: number;
  beamDelayMin?: number;
  beamDuration?: number;
  gridColor?: string;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  perspective: 80,
  beamsPerSide: 10,
  beamSize: 1,
  beamDelayMax: 3,
  beamDelayMin: 0,
  beamDuration: 4,
  gridColor: "hsl(var(--border))",
});

const beamDuration = computed(() => props.beamDuration);
const beamDelayMax = computed(() => props.beamDelayMax);
const beamDelayMin = computed(() => props.beamDelayMin);

function generateBeams() {
  const beams = [];
  const cellsPerSide = Math.floor(100 / props.beamSize);
  const step = cellsPerSide / props.beamsPerSide;

  for (let i = 0; i < props.beamsPerSide; i++) {
    const x = Math.floor(i * step);
    const delay = Math.random() * (beamDelayMax.value - beamDelayMin.value) + beamDelayMin.value;
    beams.push({ x, delay });
  }
  return beams;
}

const topBeams = generateBeams();
const bottomBeams = generateBeams();
const leftBeams = generateBeams();
const rightBeams = generateBeams();
</script>

<style lang="scss" scoped>
.bg-main {
    width: 100%;
    height: 100%;
}
.relative {
  position: relative;
}

.rounded {
  border-radius: vw(5);
}

.border {
  border: vw(1) solid currentColor;
}

.grid-container {
  pointer-events: none;
  position: absolute;
  left: -18%;
  top: -25%;
  width: 180%;
  height: 130%;
  overflow: hidden;
  clip-path: inset(0);
  container-type: size;
  perspective: var(--perspective);
  transform-style: preserve-3d;
}

/* 通用 grid side 样式 */
.grid-side {
  position: absolute;
  background-size: var(--beam-size) var(--beam-size);
  background-image:
    linear-gradient(var(--grid-color) 0 vw(1), transparent vw(1) var(--beam-size)),
    linear-gradient(90deg, var(--grid-color) 0 vw(1), transparent vw(1) var(--beam-size));
  container-type: inline-size;
  height: vw(10);
  transform-style: preserve-3d;
}

/* TOP */
.grid-side.top {
  top: 0;
  left: 0;
  width: 100cqi;
  transform-origin: 50% 0%;
  transform: rotateX(-90deg);
}

/* BOTTOM */
.grid-side.bottom {
  top: 100%;
  left: 0;
  width: 100cqi;
  transform-origin: 50% 0%;
  transform: rotateX(-90deg);
}

/* LEFT */
.grid-side.left {
  top: 0;
  left: 0;
  width: 100cqh;
  transform-origin: 0% 0%;
  transform: rotate(90deg) rotateX(-90deg );
}

/* RIGHT */
.grid-side.right {
  top: 0;
  right: 0;
  width: 100cqh;
  transform-origin: 100% 0%;
  transform: rotate(-90deg) rotateX(-90deg);
}
</style>
