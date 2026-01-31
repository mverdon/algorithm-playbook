<script setup lang="ts">
/**
 * Props for the ArraySizeInput component
 */
interface Props {
  /** The current size of the array */
  size: number;
  /** The minimum allowed array size (default: 5) */
  min?: number;
  /** The maximum allowed array size (default: 100) */
  max?: number;
}

const props = withDefaults(defineProps<Props>(), {
  min: 5,
  max: 100,
});

/**
 * Events emitted by the ArraySizeInput component
 */
const emit = defineEmits<{
  /** Emitted when the user changes the array size */
  'update:size': [size: number];
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = parseInt(target.value, 10);
  if (!isNaN(value) && value >= props.min && value <= props.max) {
    emit('update:size', value);
  }
};
</script>

<template>
  <div class="flex flex-col gap-2">
    <label for="array-size" class="text-sm font-medium text-gray-700 dark:text-gray-300">
      Array Size: {{ size }}
    </label>
    <div class="flex items-center gap-3">
      <span class="text-xs text-gray-500 dark:text-gray-400">{{ min }}</span>
      <input
        id="array-size"
        type="range"
        :value="size"
        :min="min"
        :max="max"
        @input="handleInput"
        class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Array size slider"
      />
      <span class="text-xs text-gray-500 dark:text-gray-400">{{ max }}</span>
    </div>
  </div>
</template>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 1rem;
  height: 1rem;
  background: #3b82f6;
  cursor: pointer;
  border-radius: 50%;
}

input[type="range"]::-webkit-slider-thumb:hover {
  background: #2563eb;
}

input[type="range"]::-moz-range-thumb {
  width: 1rem;
  height: 1rem;
  background: #3b82f6;
  cursor: pointer;
  border-radius: 50%;
  border: none;
}

input[type="range"]::-moz-range-thumb:hover {
  background: #2563eb;
}
</style>
