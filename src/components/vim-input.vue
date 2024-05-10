<template lang="pug">
div
  div(v-for="(option, index) in propValue", :key="index", :class="{ 'active': currentIndex === index }")
    input(
      v-if="option.type === 'text'",
      v-model="inputValues[option.key]",
      type="text",
      @keydown.tab="nextOption",
      @keydown.esc="toggleNormalMode(index)",
    )
    input(
      v-else-if="option.type === 'checkbox'",
      v-model="inputValues[option.key]",
      type="checkbox",
      @keydown.tab="nextOption"
    )
    input(
      v-else-if="option.type === 'radio'",
      v-model="inputValues[option.key]",
      type="radio",
      :value="option.value",
      @keydown.tab="nextOption"
    )
    div(v-show="normalModeIndexes.includes(index)")
      p normal mode mappings
      span(
        v-for="(mapping, mappingIndex) in normalModeKeymappings",
        :key="mappingIndex"
      ) {{ mapping }}
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  propValue: {
    type: Array,
    required: true
  }
})

const inputValues = reactive({})
const currentIndex = ref(0)
const normalModeIndexes = ref([])

const normalModeKeymappings = [
  'i: Insert mode',
  'x: Delete character',
  'dd: Delete line',
  'u: Undo',
  'Ctrl+r: Redo'
]

const emit = defineEmits(['update:modelValue'])

const nextOption = () => {
}

const toggleNormalMode = (index) => {
  if (normalModeIndexes.value.includes(index)) {
    normalModeIndexes.value = normalModeIndexes.value.filter(i => i !== index)
  } else {
    normalModeIndexes.value.push(index)
  }
}

watch(inputValues, (newValue) => {
  emit('update:modelValue', newValue)
}, { deep: true })
</script>

<style lang="stylus">
.active
  font-weight: bold
</style>
