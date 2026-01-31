<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import Tooltip from './Tooltip.vue';

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

const inputValue = ref<string>(props.size.toString());
const validationError = ref<string>('');

// Watch for external size changes and sync input value
watch(() => props.size, (newSize) => {
  inputValue.value = newSize.toString();
  validationError.value = '';
});

const handleSliderInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = parseInt(target.value, 10);
  if (!isNaN(value) && value >= props.min && value <= props.max) {
    emit('update:size', value);
    inputValue.value = value.toString();
    validationError.value = '';
  }
};

const handleNumberInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  inputValue.value = target.value;
};

const handleNumberBlur = () => {
  const value = parseInt(inputValue.value, 10);
  
  if (inputValue.value === '' || isNaN(value)) {
    validationError.value = 'Please enter a valid number';
    inputValue.value = props.size.toString();
    return;
  }
  
  if (value < props.min) {
    validationError.value = `Array size must be at least ${props.min}`;
    inputValue.value = props.size.toString();
    return;
  }
  
  if (value > props.max) {
    validationError.value = `Array size must not exceed ${props.max}`;
    inputValue.value = props.size.toString();
    return;
  }
  
  validationError.value = '';
  emit('update:size', value);
};

const handleNumberKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleNumberBlur();
  }
};

const isValid = computed(() => validationError.value === '');
</script>

<template>
  <div class="flex flex-col gap-2">
    <label for="array-size" class="text-sm font-medium text-gray-700 dark:text-gray-300">
      Array Size
    </label>
    <div class="flex items-center gap-3">
      <span class="text-xs text-gray-500 dark:text-gray-400">{{ min }}</span>
      <Tooltip text="Drag to change the array size">
        <input
          id="array-size"
          type="range"
          :value="size"
          :min="min"
          :max="max"
          @input="handleSliderInput"
          class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Array size slider"
        />
      </Tooltip>
      <span class="text-xs text-gray-500 dark:text-gray-400">{{ max }}</span>
      <Tooltip text="Type exact size value">
        <input
          id="array-size-number"
          type="number"
          :value="inputValue"
          :min="min"
          :max="max"
          @input="handleNumberInput"
          @blur="handleNumberBlur"
          @keydown="handleNumberKeydown"
          :class="[
            'w-16 px-2 py-1 text-center text-sm rounded border transition-colors',
            isValid
              ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              : 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100 focus:ring-2 focus:ring-red-500 focus:border-red-500'
          ]"
          aria-label="Array size number input"
          :aria-invalid="!isValid"
          :aria-describedby="validationError ? 'array-size-error' : undefined"
        />
      </Tooltip>
    </div>
    <transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-150 ease-in"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <p
        v-if="validationError"
        id="array-size-error"
        class="text-xs text-red-600 dark:text-red-400 flex items-center gap-1"
        role="alert"
      >
        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        {{ validationError }}
      </p>
    </transition>
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
