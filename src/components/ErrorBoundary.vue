<template>
  <div v-if="error" class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div class="flex items-center mb-4">
        <svg class="w-8 h-8 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          Something went wrong
        </h2>
      </div>
      
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        An error occurred while running the algorithm. This might be due to an unexpected input or a bug in the visualization.
      </p>
      
      <details class="mb-4">
        <summary class="cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
          Show error details
        </summary>
        <pre class="mt-2 p-3 bg-gray-100 dark:bg-gray-900 rounded text-xs overflow-auto max-h-40 text-red-600 dark:text-red-400">{{ errorMessage }}</pre>
      </details>
      
      <div class="flex space-x-3">
        <button
          @click="retry"
          class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium"
        >
          Try Again
        </button>
        <button
          @click="reset"
          class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-md transition-colors font-medium"
        >
          Reset
        </button>
      </div>
    </div>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
/**
 * ErrorBoundary Component
 * 
 * Catches and handles errors from child components, displaying a user-friendly
 * error message with options to retry or reset. Prevents the entire application
 * from crashing when a child component throws an error.
 */
import { ref, onErrorCaptured } from 'vue';

const error = ref(false);
const errorMessage = ref('');

onErrorCaptured((err) => {
  error.value = true;
  errorMessage.value = err instanceof Error ? err.stack || err.message : String(err);
  
  // Log to console for debugging
  console.error('ErrorBoundary caught:', err);
  
  // Prevent error from propagating
  return false;
});

function retry() {
  error.value = false;
  errorMessage.value = '';
}

function reset() {
  error.value = false;
  errorMessage.value = '';
  // Reload the page to fully reset state
  window.location.reload();
}
</script>
