<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

export interface NotificationProps {
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
  show?: boolean;
}

const props = withDefaults(defineProps<NotificationProps>(), {
  type: 'info',
  duration: 3000,
  show: false,
});

const emit = defineEmits<{
  close: [];
}>();

const visible = ref(props.show);
let timeoutId: ReturnType<typeof setTimeout> | null = null;

const typeClasses = {
  success: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700',
  info: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700',
  warning: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700',
  error: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700',
};

const typeIcons = {
  success: '✓',
  info: 'ℹ',
  warning: '⚠',
  error: '✕',
};

const close = () => {
  visible.value = false;
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
  emit('close');
};

const startTimer = () => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  if (props.duration > 0) {
    timeoutId = setTimeout(() => {
      close();
    }, props.duration);
  }
};

watch(() => props.show, (newVal) => {
  visible.value = newVal;
  if (newVal) {
    startTimer();
  }
});

onMounted(() => {
  if (visible.value) {
    startTimer();
  }
});
</script>

<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-2"
  >
    <div
      v-if="visible"
      :class="[
        'fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border-2 shadow-lg max-w-md',
        typeClasses[type],
      ]"
      role="alert"
      :aria-live="type === 'error' ? 'assertive' : 'polite'"
    >
      <span class="text-xl font-bold" aria-hidden="true">{{ typeIcons[type] }}</span>
      <span class="flex-1">{{ message }}</span>
      <button
        type="button"
        @click="close"
        class="text-current opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  </Transition>
</template>
