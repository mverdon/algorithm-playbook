<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <header class="bg-white dark:bg-gray-800 shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            Algorithm Visualizer Playground
          </h1>
          <ThemeToggle />
        </div>
      </div>
    </header>
    
    <nav class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex space-x-8">
          <button
            @click="activeTab = 'sorting'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === 'sorting'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            ]"
          >
            Sorting Algorithms
          </button>
          <button
            @click="activeTab = 'pathfinding'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === 'pathfinding'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            ]"
          >
            Pathfinding Algorithms
          </button>
        </div>
      </div>
    </nav>
    
    <main>
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <ErrorBoundary>
            <SortingPlayground v-if="activeTab === 'sorting'" />
            <PathfindingPlayground v-else-if="activeTab === 'pathfinding'" />
          </ErrorBoundary>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SortingPlayground from './components/SortingPlayground.vue';
import PathfindingPlayground from './components/PathfindingPlayground.vue';
import ThemeToggle from './components/ThemeToggle.vue';
import ErrorBoundary from './components/ErrorBoundary.vue';

type Tab = 'sorting' | 'pathfinding';
const activeTab = ref<Tab>('sorting');
</script>

<style scoped>
/* Component-specific styles */
</style>
