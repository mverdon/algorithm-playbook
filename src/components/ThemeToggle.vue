<script setup lang="ts">
/**
 * ThemeToggle Component
 * 
 * Provides a button to toggle between light and dark themes.
 * Persists the user's theme preference in localStorage and respects
 * the system's prefers-color-scheme setting when no preference is saved.
 */
import { ref, onMounted, watch } from 'vue';

const isDark = ref(false);

const toggleTheme = () => {
  isDark.value = !isDark.value;
};

watch(isDark, (newValue) => {
  if (newValue) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
});

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark);
});
</script>

<template>
  <button
    @click="toggleTheme"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    class="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
  >
    <span v-if="isDark" class="text-xl inline-block transition-all duration-500 ease-in-out transform hover:rotate-180">☀️</span>
    <span v-else class="text-xl inline-block transition-all duration-500 ease-in-out transform hover:rotate-180">🌙</span>
  </button>
</template>
