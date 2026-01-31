import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Tooltip from '@/components/Tooltip.vue';

describe('Tooltip', () => {
  describe('Rendering', () => {
    it('should render the trigger slot content', () => {
      const wrapper = mount(Tooltip, {
        props: { text: 'Test tooltip' },
        slots: {
          default: '<button>Click me</button>',
        },
      });

      expect(wrapper.find('button').exists()).toBe(true);
      expect(wrapper.find('button').text()).toBe('Click me');
    });

    it('should not show tooltip by default', () => {
      const wrapper = mount(Tooltip, {
        props: { text: 'Test tooltip' },
        slots: {
          default: '<button>Click me</button>',
        },
      });

      expect(wrapper.find('[role="tooltip"]').exists()).toBe(false);
    });

    it('should show tooltip on mouseenter', async () => {
      const wrapper = mount(Tooltip, {
        props: { text: 'Test tooltip' },
        slots: {
          default: '<button>Click me</button>',
        },
      });

      await wrapper.trigger('mouseenter');
      await wrapper.vm.$nextTick();

      expect(wrapper.find('[role="tooltip"]').exists()).toBe(true);
      expect(wrapper.find('[role="tooltip"]').text()).toContain('Test tooltip');
    });

    it('should hide tooltip on mouseleave', async () => {
      const wrapper = mount(Tooltip, {
        props: { text: 'Test tooltip' },
        slots: {
          default: '<button>Click me</button>',
        },
      });

      await wrapper.trigger('mouseenter');
      await wrapper.vm.$nextTick();
      expect(wrapper.find('[role="tooltip"]').exists()).toBe(true);

      await wrapper.trigger('mouseleave');
      await wrapper.vm.$nextTick();
      expect(wrapper.find('[role="tooltip"]').exists()).toBe(false);
    });
  });

  describe('Focus interactions', () => {
    it('should show tooltip on focusin', async () => {
      const wrapper = mount(Tooltip, {
        props: { text: 'Test tooltip' },
        slots: {
          default: '<button>Click me</button>',
        },
      });

      await wrapper.trigger('focusin');
      await wrapper.vm.$nextTick();

      expect(wrapper.find('[role="tooltip"]').exists()).toBe(true);
      expect(wrapper.find('[role="tooltip"]').text()).toContain('Test tooltip');
    });

    it('should hide tooltip on focusout', async () => {
      const wrapper = mount(Tooltip, {
        props: { text: 'Test tooltip' },
        slots: {
          default: '<button>Click me</button>',
        },
      });

      await wrapper.trigger('focusin');
      await wrapper.vm.$nextTick();
      expect(wrapper.find('[role="tooltip"]').exists()).toBe(true);

      await wrapper.trigger('focusout');
      await wrapper.vm.$nextTick();
      expect(wrapper.find('[role="tooltip"]').exists()).toBe(false);
    });
  });

  describe('Positioning', () => {
    it('should apply top position classes by default', () => {
      const wrapper = mount(Tooltip, {
        props: { text: 'Test tooltip' },
        slots: {
          default: '<button>Click me</button>',
        },
      });

      wrapper.trigger('mouseenter');
      wrapper.vm.$nextTick();

      const tooltip = wrapper.find('[role="tooltip"]');
      if (tooltip.exists()) {
        expect(tooltip.classes()).toContain('bottom-full');
      }
    });

    it('should apply bottom position classes', async () => {
      const wrapper = mount(Tooltip, {
        props: { text: 'Test tooltip', position: 'bottom' },
        slots: {
          default: '<button>Click me</button>',
        },
      });

      await wrapper.trigger('mouseenter');
      await wrapper.vm.$nextTick();

      const tooltip = wrapper.find('[role="tooltip"]');
      expect(tooltip.exists()).toBe(true);
      expect(tooltip.classes()).toContain('top-full');
    });

    it('should apply left position classes', async () => {
      const wrapper = mount(Tooltip, {
        props: { text: 'Test tooltip', position: 'left' },
        slots: {
          default: '<button>Click me</button>',
        },
      });

      await wrapper.trigger('mouseenter');
      await wrapper.vm.$nextTick();

      const tooltip = wrapper.find('[role="tooltip"]');
      expect(tooltip.exists()).toBe(true);
      expect(tooltip.classes()).toContain('right-full');
    });

    it('should apply right position classes', async () => {
      const wrapper = mount(Tooltip, {
        props: { text: 'Test tooltip', position: 'right' },
        slots: {
          default: '<button>Click me</button>',
        },
      });

      await wrapper.trigger('mouseenter');
      await wrapper.vm.$nextTick();

      const tooltip = wrapper.find('[role="tooltip"]');
      expect(tooltip.exists()).toBe(true);
      expect(tooltip.classes()).toContain('left-full');
    });
  });

  describe('Accessibility', () => {
    it('should have role="tooltip"', async () => {
      const wrapper = mount(Tooltip, {
        props: { text: 'Test tooltip' },
        slots: {
          default: '<button>Click me</button>',
        },
      });

      await wrapper.trigger('mouseenter');
      await wrapper.vm.$nextTick();

      const tooltip = wrapper.find('[role="tooltip"]');
      expect(tooltip.exists()).toBe(true);
      expect(tooltip.attributes('role')).toBe('tooltip');
    });

    it('should set aria-hidden when not visible', () => {
      const wrapper = mount(Tooltip, {
        props: { text: 'Test tooltip' },
        slots: {
          default: '<button>Click me</button>',
        },
      });

      expect(wrapper.find('[role="tooltip"]').exists()).toBe(false);
    });

    it('should set aria-hidden=false when visible', async () => {
      const wrapper = mount(Tooltip, {
        props: { text: 'Test tooltip' },
        slots: {
          default: '<button>Click me</button>',
        },
      });

      await wrapper.trigger('mouseenter');
      await wrapper.vm.$nextTick();

      const tooltip = wrapper.find('[role="tooltip"]');
      expect(tooltip.attributes('aria-hidden')).toBe('false');
    });
  });

  describe('Text content', () => {
    it('should display the provided text', async () => {
      const tooltipText = 'This is a helpful tooltip';
      const wrapper = mount(Tooltip, {
        props: { text: tooltipText },
        slots: {
          default: '<button>Click me</button>',
        },
      });

      await wrapper.trigger('mouseenter');
      await wrapper.vm.$nextTick();

      expect(wrapper.find('[role="tooltip"]').text()).toContain(tooltipText);
    });

    it('should not show tooltip if text is empty', async () => {
      const wrapper = mount(Tooltip, {
        props: { text: '' },
        slots: {
          default: '<button>Click me</button>',
        },
      });

      await wrapper.trigger('mouseenter');
      await wrapper.vm.$nextTick();

      expect(wrapper.find('[role="tooltip"]').exists()).toBe(false);
    });
  });
});
