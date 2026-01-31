import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import NotificationToast from '@/components/NotificationToast.vue';

describe('NotificationToast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('rendering', () => {
    it('should render notification when show is true', () => {
      const wrapper = mount(NotificationToast, {
        props: {
          show: true,
          message: 'Test notification',
        },
      });

      expect(wrapper.text()).toContain('Test notification');
    });

    it('should not render notification when show is false', () => {
      const wrapper = mount(NotificationToast, {
        props: {
          show: false,
          message: 'Test notification',
        },
      });

      expect(wrapper.find('[role="alert"]').exists()).toBe(false);
    });

    it('should display success icon for success type', () => {
      const wrapper = mount(NotificationToast, {
        props: {
          show: true,
          message: 'Success!',
          type: 'success',
        },
      });

      expect(wrapper.text()).toContain('✓');
    });

    it('should display info icon for info type', () => {
      const wrapper = mount(NotificationToast, {
        props: {
          show: true,
          message: 'Info message',
          type: 'info',
        },
      });

      expect(wrapper.text()).toContain('ℹ');
    });

    it('should display warning icon for warning type', () => {
      const wrapper = mount(NotificationToast, {
        props: {
          show: true,
          message: 'Warning!',
          type: 'warning',
        },
      });

      expect(wrapper.text()).toContain('⚠');
    });

    it('should display error icon for error type', () => {
      const wrapper = mount(NotificationToast, {
        props: {
          show: true,
          message: 'Error!',
          type: 'error',
        },
      });

      expect(wrapper.text()).toContain('✕');
    });
  });

  describe('styling', () => {
    it('should apply success styling', () => {
      const wrapper = mount(NotificationToast, {
        props: {
          show: true,
          message: 'Success!',
          type: 'success',
        },
      });

      const alert = wrapper.find('[role="alert"]');
      expect(alert.classes()).toContain('bg-green-100');
      expect(alert.classes()).toContain('text-green-800');
    });

    it('should apply info styling', () => {
      const wrapper = mount(NotificationToast, {
        props: {
          show: true,
          message: 'Info!',
          type: 'info',
        },
      });

      const alert = wrapper.find('[role="alert"]');
      expect(alert.classes()).toContain('bg-blue-100');
      expect(alert.classes()).toContain('text-blue-800');
    });

    it('should apply warning styling', () => {
      const wrapper = mount(NotificationToast, {
        props: {
          show: true,
          message: 'Warning!',
          type: 'warning',
        },
      });

      const alert = wrapper.find('[role="alert"]');
      expect(alert.classes()).toContain('bg-yellow-100');
      expect(alert.classes()).toContain('text-yellow-800');
    });

    it('should apply error styling', () => {
      const wrapper = mount(NotificationToast, {
        props: {
          show: true,
          message: 'Error!',
          type: 'error',
        },
      });

      const alert = wrapper.find('[role="alert"]');
      expect(alert.classes()).toContain('bg-red-100');
      expect(alert.classes()).toContain('text-red-800');
    });
  });

  describe('accessibility', () => {
    it('should have role="alert" attribute', () => {
      const wrapper = mount(NotificationToast, {
        props: {
          show: true,
          message: 'Test message',
        },
      });

      expect(wrapper.find('[role="alert"]').exists()).toBe(true);
    });

    it('should have aria-live="polite" for non-error messages', () => {
      const wrapper = mount(NotificationToast, {
        props: {
          show: true,
          message: 'Info message',
          type: 'info',
        },
      });

      const alert = wrapper.find('[role="alert"]');
      expect(alert.attributes('aria-live')).toBe('polite');
    });

    it('should have aria-live="assertive" for error messages', () => {
      const wrapper = mount(NotificationToast, {
        props: {
          show: true,
          message: 'Error message',
          type: 'error',
        },
      });

      const alert = wrapper.find('[role="alert"]');
      expect(alert.attributes('aria-live')).toBe('assertive');
    });

    it('should have aria-label on close button', () => {
      const wrapper = mount(NotificationToast, {
        props: {
          show: true,
          message: 'Test message',
        },
      });

      const closeButton = wrapper.find('button');
      expect(closeButton.attributes('aria-label')).toBe('Close notification');
    });
  });

  describe('close functionality', () => {
    it('should emit close event when close button is clicked', async () => {
      const wrapper = mount(NotificationToast, {
        props: {
          show: true,
          message: 'Test message',
        },
      });

      const closeButton = wrapper.find('button');
      await closeButton.trigger('click');

      expect(wrapper.emitted('close')).toBeTruthy();
      expect(wrapper.emitted('close')).toHaveLength(1);
    });

    it('should hide notification when close button is clicked', async () => {
      const wrapper = mount(NotificationToast, {
        props: {
          show: true,
          message: 'Test message',
        },
      });

      const closeButton = wrapper.find('button');
      await closeButton.trigger('click');

      // Wait for transition
      await wrapper.vm.$nextTick();
      
      // Component should emit close event
      expect(wrapper.emitted('close')).toBeTruthy();
    });
  });

  describe('auto-dismiss', () => {
    it('should auto-dismiss after default duration', async () => {
      const wrapper = mount(NotificationToast, {
        props: {
          show: true,
          message: 'Test message',
        },
      });

      // Fast-forward time by default duration (3000ms)
      vi.advanceTimersByTime(3000);
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('close')).toBeTruthy();
    });

    it('should auto-dismiss after custom duration', async () => {
      const wrapper = mount(NotificationToast, {
        props: {
          show: true,
          message: 'Test message',
          duration: 5000,
        },
      });

      // Fast-forward time by custom duration
      vi.advanceTimersByTime(5000);
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('close')).toBeTruthy();
    });

    it('should not auto-dismiss when duration is 0', async () => {
      const wrapper = mount(NotificationToast, {
        props: {
          show: true,
          message: 'Test message',
          duration: 0,
        },
      });

      // Fast-forward time significantly
      vi.advanceTimersByTime(10000);
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('close')).toBeFalsy();
    });

    it('should restart timer when show changes from false to true', async () => {
      const wrapper = mount(NotificationToast, {
        props: {
          show: false,
          message: 'Test message',
          duration: 3000,
        },
      });

      // Show notification
      await wrapper.setProps({ show: true });
      await wrapper.vm.$nextTick();

      // Fast-forward time
      vi.advanceTimersByTime(3000);
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('close')).toBeTruthy();
    });
  });

  describe('transition', () => {
    it('should have transition classes for enter', () => {
      const wrapper = mount(NotificationToast, {
        props: {
          show: true,
          message: 'Test message',
        },
      });

      // Check that transition wrapper exists
      expect(wrapper.html()).toContain('transition');
    });
  });

  describe('edge cases', () => {
    it('should handle empty message', () => {
      const wrapper = mount(NotificationToast, {
        props: {
          show: true,
          message: '',
        },
      });

      expect(wrapper.find('[role="alert"]').exists()).toBe(true);
    });

    it('should handle very long message', () => {
      const longMessage = 'A'.repeat(500);
      const wrapper = mount(NotificationToast, {
        props: {
          show: true,
          message: longMessage,
        },
      });

      expect(wrapper.text()).toContain(longMessage);
      expect(wrapper.find('[role="alert"]').classes()).toContain('max-w-md');
    });
  });
});
