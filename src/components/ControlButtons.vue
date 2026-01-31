<script setup lang="ts">
import { computed } from 'vue'

/**
 * Props for the ControlButtons component
 */
interface Props {
  /** Whether the animation is currently playing */
  isPlaying: boolean
  /** Whether the animation has completed */
  isComplete: boolean
  /** Whether the play button should be enabled */
  canPlay: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isPlaying: false,
  isComplete: false,
  canPlay: true
})

/**
 * Events emitted by the ControlButtons component
 */
const emit = defineEmits<{
  /** Emitted when the user clicks the play button */
  play: []
  /** Emitted when the user clicks the pause button */
  pause: []
  /** Emitted when the user clicks the reset button */
  reset: []
  /** Emitted when the user clicks the shuffle button */
  shuffle: []
}>()

const playPauseIcon = computed(() => props.isPlaying ? '⏸' : '▶')
const playPauseLabel = computed(() => props.isPlaying ? 'Pause' : 'Play')
const playPauseAriaLabel = computed(() => 
  props.isPlaying 
    ? 'Pause algorithm animation' 
    : 'Play algorithm animation'
)
const playPauseDisabledReason = computed(() => {
  if (props.isComplete) return 'Animation is complete'
  if (!props.canPlay) return 'Cannot play animation'
  return ''
})
</script>

<template>
  <div 
    class="flex gap-2"
    role="group"
    aria-label="Algorithm visualization controls"
  >
    <button
      :disabled="!canPlay || isComplete"
      @click="isPlaying ? emit('pause') : emit('play')"
      class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700"
      type="button"
      :aria-label="playPauseAriaLabel"
      :aria-pressed="isPlaying"
      :aria-disabled="!canPlay || isComplete"
      :aria-describedby="(!canPlay || isComplete) ? 'play-pause-disabled-reason' : undefined"
    >
      {{ playPauseIcon }} {{ playPauseLabel }}
    </button>
    <span 
      v-if="!canPlay || isComplete"
      id="play-pause-disabled-reason" 
      class="sr-only"
    >
      {{ playPauseDisabledReason }}
    </span>
    
    <button
      @click="emit('reset')"
      class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700"
      type="button"
      aria-label="Reset algorithm visualization to initial state"
    >
      ⟲ Reset
    </button>
    
    <button
      :disabled="isPlaying"
      @click="emit('shuffle')"
      class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-600 dark:hover:bg-green-700"
      type="button"
      aria-label="Shuffle array to generate new random values"
      :aria-disabled="isPlaying"
      :aria-describedby="isPlaying ? 'shuffle-disabled-reason' : undefined"
    >
      🔀 Shuffle
    </button>
    <span 
      v-if="isPlaying"
      id="shuffle-disabled-reason" 
      class="sr-only"
    >
      Cannot shuffle while animation is playing
    </span>
  </div>
</template>
