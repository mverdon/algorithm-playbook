import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SpeedControl from '@/components/SpeedControl.vue';
import { AnimationSpeed } from '@/types/algorithms';

describe('SpeedControl', () => {
  describe('rendering', () => {
    it('renders with label and select element', () => {
      const wrapper = mount(SpeedControl, {
        props: {
          speed: AnimationSpeed.Normal,
        },
      });

      expect(wrapper.find('label').exists()).toBe(true);
      expect(wrapper.find('label').text()).toBe('Animation Speed');
      expect(wrapper.find('select').exists()).toBe(true);
    });

    it('displays all speed options', () => {
      const wrapper = mount(SpeedControl, {
        props: {
          speed: AnimationSpeed.Normal,
        },
      });

      const options = wrapper.findAll('option');
      expect(options).toHaveLength(3);
      expect(options[0].text()).toContain('Slow');
      expect(options[0].text()).toContain('1000ms');
      expect(options[1].text()).toContain('Normal');
      expect(options[1].text()).toContain('500ms');
      expect(options[2].text()).toContain('Fast');
      expect(options[2].text()).toContain('100ms');
    });

    it('sets correct option values', () => {
      const wrapper = mount(SpeedControl, {
        props: {
          speed: AnimationSpeed.Normal,
        },
      });

      const options = wrapper.findAll('option');
      expect(options[0].attributes('value')).toBe(
        AnimationSpeed.Slow.toString()
      );
      expect(options[1].attributes('value')).toBe(
        AnimationSpeed.Normal.toString()
      );
      expect(options[2].attributes('value')).toBe(
        AnimationSpeed.Fast.toString()
      );
    });
  });

  describe('value selection', () => {
    it('displays the selected speed value', () => {
      const wrapper = mount(SpeedControl, {
        props: {
          speed: AnimationSpeed.Slow,
        },
      });

      const select = wrapper.find('select');
      expect(select.element.value).toBe(AnimationSpeed.Slow.toString());
    });

    it('updates when speed prop changes to Normal', async () => {
      const wrapper = mount(SpeedControl, {
        props: {
          speed: AnimationSpeed.Slow,
        },
      });

      await wrapper.setProps({ speed: AnimationSpeed.Normal });
      const select = wrapper.find('select');
      expect(select.element.value).toBe(AnimationSpeed.Normal.toString());
    });

    it('updates when speed prop changes to Fast', async () => {
      const wrapper = mount(SpeedControl, {
        props: {
          speed: AnimationSpeed.Normal,
        },
      });

      await wrapper.setProps({ speed: AnimationSpeed.Fast });
      const select = wrapper.find('select');
      expect(select.element.value).toBe(AnimationSpeed.Fast.toString());
    });
  });

  describe('events', () => {
    it('emits update:speed event when speed is changed', async () => {
      const wrapper = mount(SpeedControl, {
        props: {
          speed: AnimationSpeed.Normal,
        },
      });

      const select = wrapper.find('select');
      await select.setValue(AnimationSpeed.Fast.toString());

      expect(wrapper.emitted('update:speed')).toBeTruthy();
      expect(wrapper.emitted('update:speed')![0]).toEqual([AnimationSpeed.Fast]);
    });

    it('emits update:speed event with correct value for Slow', async () => {
      const wrapper = mount(SpeedControl, {
        props: {
          speed: AnimationSpeed.Normal,
        },
      });

      const select = wrapper.find('select');
      await select.setValue(AnimationSpeed.Slow.toString());

      expect(wrapper.emitted('update:speed')![0]).toEqual([AnimationSpeed.Slow]);
    });

    it('emits update:speed event with correct value for Normal', async () => {
      const wrapper = mount(SpeedControl, {
        props: {
          speed: AnimationSpeed.Fast,
        },
      });

      const select = wrapper.find('select');
      await select.setValue(AnimationSpeed.Normal.toString());

      expect(wrapper.emitted('update:speed')![0]).toEqual([
        AnimationSpeed.Normal,
      ]);
    });
  });

  describe('dark mode styling', () => {
    it('applies dark mode classes to label', () => {
      const wrapper = mount(SpeedControl, {
        props: {
          speed: AnimationSpeed.Normal,
        },
      });

      const label = wrapper.find('label');
      expect(label.classes()).toContain('dark:text-gray-300');
    });

    it('applies dark mode classes to select element', () => {
      const wrapper = mount(SpeedControl, {
        props: {
          speed: AnimationSpeed.Normal,
        },
      });

      const select = wrapper.find('select');
      expect(select.classes()).toContain('dark:bg-gray-800');
      expect(select.classes()).toContain('dark:border-gray-600');
      expect(select.classes()).toContain('dark:text-gray-100');
    });
  });

  describe('accessibility', () => {
    it('has proper label association with select', () => {
      const wrapper = mount(SpeedControl, {
        props: {
          speed: AnimationSpeed.Normal,
        },
      });

      const label = wrapper.find('label');
      const select = wrapper.find('select');
      expect(label.attributes('for')).toBe('speed-control');
      expect(select.attributes('id')).toBe('speed-control');
    });

    it('applies focus ring styling for keyboard navigation', () => {
      const wrapper = mount(SpeedControl, {
        props: {
          speed: AnimationSpeed.Normal,
        },
      });

      const select = wrapper.find('select');
      expect(select.classes()).toContain('focus:ring-2');
      expect(select.classes()).toContain('focus:ring-blue-500');
    });
  });
});
