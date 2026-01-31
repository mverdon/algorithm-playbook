<script setup lang="ts">
import { computed } from 'vue';
import { AnimationSpeed } from '@/types/algorithms';
import Tooltip from './Tooltip.vue';

/**
 * Props for the SpeedControl component
 */
interface Props {
  /** The current animation speed setting */
  speed: AnimationSpeed;
}

/**
 * Events emitted by the SpeedControl component
 */
interface Emits {
  /** Emitted when the user changes the animation speed */
  (e: 'update:speed', speed: AnimationSpeed): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const speeds = computed(() => [
  { value: AnimationSpeed.Slow, label: 'Slow', description: '1000ms' },
  { value: AnimationSpeed.Normal, label: 'Normal', description: '500ms' },
  { value: AnimationSpeed.Fast, label: 'Fast', description: '100ms' },
]);

const handleSpeedChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const newSpeed = Number(target.value) as AnimationSpeed;
  emit('update:speed', newSpeed);
};
</script>

<template>
  <div class="flex flex-col gap-2">
    <label
      for="speed-control"
      class="text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      Animation Speed
    </label>
    <Tooltip text="Control how fast the animation plays" position="right">
      <select
        id="speed-control"
        :value="speed"
        @change="handleSpeedChange"
        class="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-gray-100 transition-colors"
        role="combobox"
        aria-label="Animation speed control"
        aria-required="false"
        :aria-describedby="'speed-description-' + speed"
      >
        <option
          v-for="speedOption in speeds"
          :key="speedOption.value"
          :value="speedOption.value"
          :aria-label="`${speedOption.label} speed: ${speedOption.description} delay`"
        >
          {{ speedOption.label }} ({{ speedOption.description }})
        </option>
      </select>
    </Tooltip>
    <span
      :id="'speed-description-' + speed"
      class="sr-only"
    >
      Current animation speed: {{ speeds.find(s => s.value === speed)?.label }}
    </span>
  </div>
</template>
