import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import ErrorBoundary from '@/components/ErrorBoundary.vue';

// Create a normal component that doesn't throw
const NormalComponent = defineComponent({
  name: 'NormalComponent',
  render() {
    return h('div', { class: 'normal-child' }, 'Normal content');
  },
});

describe('ErrorBoundary', () => {
  it('renders children when no error occurs', () => {
    const wrapper = mount(ErrorBoundary, {
      slots: {
        default: h(NormalComponent),
      },
    });

    expect(wrapper.find('.normal-child').exists()).toBe(true);
    expect(wrapper.text()).toContain('Normal content');
  });

  it('displays error UI when error state is set', async () => {
    const wrapper = mount(ErrorBoundary, {
      slots: {
        default: h(NormalComponent),
      },
    });

    // Manually trigger error state by accessing component internals
    const vm = wrapper.vm as any;
    vm.error = true;
    vm.errorMessage = 'Test error message';
    await wrapper.vm.$nextTick();

    // Should show error message
    expect(wrapper.text()).toContain('Something went wrong');
    expect(wrapper.text()).toContain('An error occurred while running the algorithm');
  });

  it('shows error details in expandable section', async () => {
    const wrapper = mount(ErrorBoundary, {
      slots: {
        default: h(NormalComponent),
      },
    });

    // Manually set error state
    const vm = wrapper.vm as any;
    vm.error = true;
    vm.errorMessage = 'Detailed error information\nStack trace here';
    await wrapper.vm.$nextTick();

    // Should have details element
    expect(wrapper.find('details').exists()).toBe(true);
    expect(wrapper.find('summary').text()).toContain('Show error details');
    expect(wrapper.find('pre').text()).toContain('Detailed error information');
  });

  it('has retry button that clears error', async () => {
    const wrapper = mount(ErrorBoundary, {
      slots: {
        default: h(NormalComponent),
      },
    });

    // Set error state
    const vm = wrapper.vm as any;
    vm.error = true;
    vm.errorMessage = 'Test error';
    await wrapper.vm.$nextTick();

    // Should show error
    expect(wrapper.text()).toContain('Something went wrong');

    // Click retry button
    const retryButton = wrapper.findAll('button')[0];
    expect(retryButton.text()).toBe('Try Again');
    await retryButton.trigger('click');

    // Error should be cleared
    expect(vm.error).toBe(false);
    expect(vm.errorMessage).toBe('');
  });

  it('has reset button that reloads page', async () => {
    const reloadSpy = vi.fn();
    
    // Mock window.location.reload
    Object.defineProperty(window, 'location', {
      value: { reload: reloadSpy },
      writable: true,
    });

    const wrapper = mount(ErrorBoundary, {
      slots: {
        default: h(NormalComponent),
      },
    });

    // Set error state
    const vm = wrapper.vm as any;
    vm.error = true;
    vm.errorMessage = 'Test error';
    await wrapper.vm.$nextTick();

    // Click reset button
    const resetButton = wrapper.findAll('button')[1];
    expect(resetButton.text()).toBe('Reset');
    await resetButton.trigger('click');

    // Should call reload
    expect(reloadSpy).toHaveBeenCalled();
  });

  it('displays error message in pre element', async () => {
    const wrapper = mount(ErrorBoundary, {
      slots: {
        default: h(NormalComponent),
      },
    });

    // Set error with stack trace
    const vm = wrapper.vm as any;
    vm.error = true;
    vm.errorMessage = 'Error: Test error from child component\n  at Component.setup';
    await wrapper.vm.$nextTick();

    // Should show error message in pre element
    const pre = wrapper.find('pre');
    expect(pre.exists()).toBe(true);
    expect(pre.text()).toContain('Test error from child component');
  });

  it('has proper styling classes for error UI', async () => {
    const wrapper = mount(ErrorBoundary, {
      slots: {
        default: h(NormalComponent),
      },
    });

    // Set error state
    const vm = wrapper.vm as any;
    vm.error = true;
    vm.errorMessage = 'Test error';
    await wrapper.vm.$nextTick();

    // Check for main container classes
    expect(wrapper.find('.min-h-screen').exists()).toBe(true);
    expect(wrapper.find('.rounded-lg').exists()).toBe(true);
    expect(wrapper.find('.shadow-lg').exists()).toBe(true);

    // Check for icon
    expect(wrapper.find('svg').exists()).toBe(true);
  });

  it('renders slot content by default', () => {
    const wrapper = mount(ErrorBoundary, {
      slots: {
        default: '<div class="test-content">Test Content</div>',
      },
    });

    expect(wrapper.find('.test-content').exists()).toBe(true);
    expect(wrapper.text()).toContain('Test Content');
  });
});
