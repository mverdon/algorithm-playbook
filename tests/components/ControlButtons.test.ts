import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ControlButtons from '@/components/ControlButtons.vue'

describe('ControlButtons', () => {
  describe('Rendering', () => {
    it('renders all three buttons', () => {
      const wrapper = mount(ControlButtons)
      const buttons = wrapper.findAll('button')
      expect(buttons).toHaveLength(3)
    })

    it('shows play icon and label when not playing', () => {
      const wrapper = mount(ControlButtons, {
        props: { isPlaying: false }
      })
      const playButton = wrapper.findAll('button')[0]
      expect(playButton.text()).toContain('▶')
      expect(playButton.text()).toContain('Play')
    })

    it('shows pause icon and label when playing', () => {
      const wrapper = mount(ControlButtons, {
        props: { isPlaying: true }
      })
      const playButton = wrapper.findAll('button')[0]
      expect(playButton.text()).toContain('⏸')
      expect(playButton.text()).toContain('Pause')
    })

    it('renders reset button with label', () => {
      const wrapper = mount(ControlButtons)
      const resetButton = wrapper.findAll('button')[1]
      expect(resetButton.text()).toContain('⟲')
      expect(resetButton.text()).toContain('Reset')
    })

    it('renders shuffle button with label', () => {
      const wrapper = mount(ControlButtons)
      const shuffleButton = wrapper.findAll('button')[2]
      expect(shuffleButton.text()).toContain('🔀')
      expect(shuffleButton.text()).toContain('Shuffle')
    })
  })

  describe('Button States', () => {
    it('disables play button when canPlay is false', () => {
      const wrapper = mount(ControlButtons, {
        props: { canPlay: false }
      })
      const playButton = wrapper.findAll('button')[0]
      expect(playButton.attributes('disabled')).toBeDefined()
    })

    it('disables play button when isComplete is true', () => {
      const wrapper = mount(ControlButtons, {
        props: { isComplete: true }
      })
      const playButton = wrapper.findAll('button')[0]
      expect(playButton.attributes('disabled')).toBeDefined()
    })

    it('enables play button when canPlay is true and not complete', () => {
      const wrapper = mount(ControlButtons, {
        props: { canPlay: true, isComplete: false }
      })
      const playButton = wrapper.findAll('button')[0]
      expect(playButton.attributes('disabled')).toBeUndefined()
    })

    it('disables shuffle button when playing', () => {
      const wrapper = mount(ControlButtons, {
        props: { isPlaying: true }
      })
      const shuffleButton = wrapper.findAll('button')[2]
      expect(shuffleButton.attributes('disabled')).toBeDefined()
    })

    it('enables shuffle button when not playing', () => {
      const wrapper = mount(ControlButtons, {
        props: { isPlaying: false }
      })
      const shuffleButton = wrapper.findAll('button')[2]
      expect(shuffleButton.attributes('disabled')).toBeUndefined()
    })

    it('reset button is always enabled', () => {
      const wrapper = mount(ControlButtons, {
        props: { isPlaying: true }
      })
      const resetButton = wrapper.findAll('button')[1]
      expect(resetButton.attributes('disabled')).toBeUndefined()
    })
  })

  describe('Events', () => {
    it('emits play event when play button clicked while not playing', async () => {
      const wrapper = mount(ControlButtons, {
        props: { isPlaying: false, canPlay: true }
      })
      const playButton = wrapper.findAll('button')[0]
      await playButton.trigger('click')
      expect(wrapper.emitted('play')).toBeTruthy()
      expect(wrapper.emitted('play')).toHaveLength(1)
    })

    it('emits pause event when play button clicked while playing', async () => {
      const wrapper = mount(ControlButtons, {
        props: { isPlaying: true, canPlay: true }
      })
      const playButton = wrapper.findAll('button')[0]
      await playButton.trigger('click')
      expect(wrapper.emitted('pause')).toBeTruthy()
      expect(wrapper.emitted('pause')).toHaveLength(1)
    })

    it('emits reset event when reset button clicked', async () => {
      const wrapper = mount(ControlButtons)
      const resetButton = wrapper.findAll('button')[1]
      await resetButton.trigger('click')
      expect(wrapper.emitted('reset')).toBeTruthy()
      expect(wrapper.emitted('reset')).toHaveLength(1)
    })

    it('emits shuffle event when shuffle button clicked', async () => {
      const wrapper = mount(ControlButtons, {
        props: { isPlaying: false }
      })
      const shuffleButton = wrapper.findAll('button')[2]
      await shuffleButton.trigger('click')
      expect(wrapper.emitted('shuffle')).toBeTruthy()
      expect(wrapper.emitted('shuffle')).toHaveLength(1)
    })

    it('does not emit play event when disabled', async () => {
      const wrapper = mount(ControlButtons, {
        props: { canPlay: false }
      })
      const playButton = wrapper.findAll('button')[0]
      await playButton.trigger('click')
      expect(wrapper.emitted('play')).toBeFalsy()
    })
  })

  describe('Dark Mode', () => {
    it('applies dark mode classes to play button', () => {
      const wrapper = mount(ControlButtons)
      const playButton = wrapper.findAll('button')[0]
      expect(playButton.classes()).toContain('dark:from-blue-600')
      expect(playButton.classes()).toContain('dark:to-blue-500')
      expect(playButton.classes()).toContain('dark:hover:from-blue-700')
      expect(playButton.classes()).toContain('dark:hover:to-blue-600')
    })

    it('applies dark mode classes to reset button', () => {
      const wrapper = mount(ControlButtons)
      const resetButton = wrapper.findAll('button')[1]
      expect(resetButton.classes()).toContain('dark:bg-gray-600')
      expect(resetButton.classes()).toContain('dark:hover:bg-gray-700')
    })

    it('applies dark mode classes to shuffle button', () => {
      const wrapper = mount(ControlButtons)
      const shuffleButton = wrapper.findAll('button')[2]
      expect(shuffleButton.classes()).toContain('dark:bg-green-600')
      expect(shuffleButton.classes()).toContain('dark:hover:bg-green-700')
    })
  })

  describe('Accessibility', () => {
    it('has aria-label for play button', () => {
      const wrapper = mount(ControlButtons, {
        props: { isPlaying: false }
      })
      const playButton = wrapper.findAll('button')[0]
      expect(playButton.attributes('aria-label')).toBe('Play algorithm animation')
    })

    it('has aria-label for pause button', () => {
      const wrapper = mount(ControlButtons, {
        props: { isPlaying: true }
      })
      const playButton = wrapper.findAll('button')[0]
      expect(playButton.attributes('aria-label')).toBe('Pause algorithm animation')
    })

    it('has aria-label for reset button', () => {
      const wrapper = mount(ControlButtons)
      const resetButton = wrapper.findAll('button')[1]
      expect(resetButton.attributes('aria-label')).toBe('Reset algorithm visualization to initial state')
    })

    it('has aria-label for shuffle button', () => {
      const wrapper = mount(ControlButtons)
      const shuffleButton = wrapper.findAll('button')[2]
      expect(shuffleButton.attributes('aria-label')).toBe('Shuffle array to generate new random values')
    })

    it('has focus ring styling on all buttons', () => {
      const wrapper = mount(ControlButtons)
      const buttons = wrapper.findAll('button')
      buttons.forEach(button => {
        expect(button.classes()).toContain('focus:outline-none')
        expect(button.classes()).toContain('focus:ring-2')
      })
    })

    it('has role="group" on control container', () => {
      const wrapper = mount(ControlButtons)
      const container = wrapper.find('div')
      expect(container.attributes('role')).toBe('group')
      expect(container.attributes('aria-label')).toBe('Algorithm visualization controls')
    })

    it('has type="button" on all buttons', () => {
      const wrapper = mount(ControlButtons)
      const buttons = wrapper.findAll('button')
      buttons.forEach(button => {
        expect(button.attributes('type')).toBe('button')
      })
    })

    it('has aria-pressed on play/pause button', () => {
      const wrapper = mount(ControlButtons, {
        props: { isPlaying: true }
      })
      const playButton = wrapper.findAll('button')[0]
      expect(playButton.attributes('aria-pressed')).toBe('true')
    })

    it('has aria-disabled on disabled buttons', () => {
      const wrapper = mount(ControlButtons, {
        props: { canPlay: false }
      })
      const playButton = wrapper.findAll('button')[0]
      expect(playButton.attributes('aria-disabled')).toBe('true')
    })

    it('provides screen reader feedback for disabled play button', () => {
      const wrapper = mount(ControlButtons, {
        props: { canPlay: false }
      })
      const playButton = wrapper.findAll('button')[0]
      expect(playButton.attributes('aria-describedby')).toBe('play-pause-disabled-reason')
      const reasonSpan = wrapper.find('#play-pause-disabled-reason')
      expect(reasonSpan.exists()).toBe(true)
      expect(reasonSpan.classes()).toContain('sr-only')
      expect(reasonSpan.text()).toBe('Cannot play animation')
    })

    it('provides screen reader feedback for completed animation', () => {
      const wrapper = mount(ControlButtons, {
        props: { isComplete: true }
      })
      const playButton = wrapper.findAll('button')[0]
      expect(playButton.attributes('aria-describedby')).toBe('play-pause-disabled-reason')
      const reasonSpan = wrapper.find('#play-pause-disabled-reason')
      expect(reasonSpan.text()).toBe('Animation is complete')
    })

    it('provides screen reader feedback for disabled shuffle button', () => {
      const wrapper = mount(ControlButtons, {
        props: { isPlaying: true }
      })
      const shuffleButton = wrapper.findAll('button')[2]
      expect(shuffleButton.attributes('aria-describedby')).toBe('shuffle-disabled-reason')
      const reasonSpan = wrapper.find('#shuffle-disabled-reason')
      expect(reasonSpan.exists()).toBe(true)
      expect(reasonSpan.classes()).toContain('sr-only')
      expect(reasonSpan.text()).toBe('Cannot shuffle while animation is playing')
    })
  })
})
