<template lang="pug">
  div(@mouseover="showTooltip" @mouseleave="hideTooltip" :class="tooltipClasses")
    slot(name = "label" :label = 'label')
        .tooltip-label {{label}}
    .tooltip-content(v-show="showTooltipContent" :class="tooltipPositionClasses")
        slot(name="tooltip")
            .tooltip-value {{value}}
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({

  value: {
  },

  label: {
  },
  position: {
    type: String,
    default: 'top',
    validator: (value) => ['north', 'east', 'south', 'west'].includes(value)
  }
})

const showTooltipContent = ref(false)

const showTooltip = () => {
  showTooltipContent.value = true
}

const hideTooltip = () => {
  showTooltipContent.value = false
}

const tooltipClasses = computed(() => ({
  'has-tooltip': true,
  'has-tooltip-top': props.position === 'north',
  'has-tooltip-right': props.position === 'east',
  'has-tooltip-bottom': props.position === 'south',
  'has-tooltip-left': props.position === 'west'
}))

const tooltipPositionClasses = computed(() => ({
  'tooltip-top': props.position === 'north',
  'tooltip-right': props.position === 'east',
  'tooltip-bottom': props.position === 'south',
  'tooltip-left': props.position === 'west'
}))
</script>

<style lang="stylus">
.has-tooltip
  position: relative
  display: inline-block

.tooltip-top, .tooltip-bottom
  left: 50%
  transform: translateX(-50%)

.tooltip-right, .tooltip-left
  top: 50%
  transform: translateY(-50%)

.tooltip-top
  top: calc(100% + 0.5rem)

.tooltip-bottom
  bottom: calc(100% + 0.5rem)

.tooltip-right
  right: calc(100% + 0.5rem)

.tooltip-left
  left: calc(100% + 0.5rem)

.tooltip-top, .tooltip-bottom, .tooltip-right, .tooltip-left
  position: absolute
  background-color: #333
  color: #fff
  padding: 0.5rem
  border-radius: 4px
  z-index: 10
  opacity: 0
  transition: opacity 0.3s ease
  pointer-events: none

.has-tooltip:hover .tooltip-top,
.has-tooltip:hover .tooltip-bottom,
.has-tooltip:hover .tooltip-right,
.has-tooltip:hover .tooltip-left
  opacity: 1
</style>
