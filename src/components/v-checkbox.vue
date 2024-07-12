<template lang="pug">
  div
    select(v-model="selectedOption" @change="emitSelectedOption")
      option(v-for="option in computedOptions" :value="option.value" :key="option.value") {{ option.label }}
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'

const props = defineProps({
  options: {
    type: Array,
    required: true
  },
  modelValue: {
    type: [String, Number],
    default: ''
  }
})


const emit = defineEmits(['update:modelValue'])
const selectedOption = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newValue) => {
    selectedOption.value = newValue
  }
)

const emitSelectedOption = () => {
  emit('update:modelValue', selectedOption.value)
}

const computedOptions = computed(() => {
  return props.options.map(option => {
    if (typeof option === 'string') {
      return {
        value: option,
        label: option
      }
    }
    return option
  })
})

</script>

<style lang="stylus" scoped>
select
  padding: 0.5rem
  font-size: 1rem
  border: 1px solid #ccc
  border-radius: 4px

</style>

