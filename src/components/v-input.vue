<template lang="pug">
  div(:class="pos")
    label(v-if="label") {{label}}
    input(
      ref = 'input'
      :type="type"
      :value="modelValue"
      @input="emitInput"
      @keydown.enter="emitSubmit"
      @keydown.escape="emitEscape"
      :placeholder="placeholder"
    )

</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: false, 
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  pos: {
    type: String,
    default: 'top',
    validator: (value) => ['top', 'left'].includes(value)
  }
})

onMounted(() => {
    // console.log(props)
})
const emit = defineEmits(['update:modelValue', 'submit', 'escape'])

const emitEscape = (event) => {
  emit('escape', event.target.value)
}

const emitSubmit = (event) => {
  emit('submit', event.target.value)
}

const emitInput = (event) => {
  emit('update:modelValue', event.target.value)
}


const input = ref(null)
const focus = (x) => {
    input.value.focus()
}
defineExpose({
    focus,
})
</script>

<style lang="stylus" scoped>

div
    display: flex
    zoom: 0.75

    &.top
        flex-direction: column

div.left
    flex-direction: row 
    align-items: center
    gap: 10px

label
  font-size: 0.9rem
  font-weight: 600
  font-family: monospace

input
  padding: 0.5rem
  font-size: 1rem
  border: 2px solid black
  border-radius: 10px

  &:hover
      border: 3px solid black
      
</style>
