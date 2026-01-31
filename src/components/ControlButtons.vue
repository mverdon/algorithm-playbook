<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  isPlaying: boolean
  isComplete: boolean
  canPlay: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isPlaying: false,
  isComplete: false,
  canPlay: true
})

const emit = defineEmits<{
  play: []
  pause: []
  reset: []
  shuffle: []
}>()

const playPauseIcon = computed(() => props.isPlaying ? '⏸' : '▶')
const playPauseLabel = computed(() => props.isPlaying ? 'Pause' : 'Play')
</script>

<template>
  <div class="flex gap-2">
    <button
      :disabled="!canPlay || isComplete"
      @click="isPlaying ? emit('pause') : emit('play')"
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700"
      :aria-label="playPauseLabel"
    >
      {{ playPauseIcon }} {{ playPauseLabel }}
    </button>
    
    <button
      @click="emit('reset')"
      class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700"
      aria-label="Reset"
    >
      ⟲ Reset
    </button>
    
    <button
      :disabled="isPlaying"
      @click="emit('shuffle')"
      class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-600 dark:hover:bg-green-700"
      aria-label="Shuffle"
    >
      🔀 Shuffle
    </button>
  </div>
</template>
