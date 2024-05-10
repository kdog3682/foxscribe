<template lang="pug">
div
  div.modal-overlay(v-if="isActive" @click="closeModal")
  div.modal-content(v-if="isActive")
    slot
    button(@click="closeModal") Close
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const emit = defineEmits(['finished'])

const props = defineProps({
  duration: {
    type: Number,
    required: true
  },
  activate: {
    type: Boolean,
    default: false
  }
})

const isActive = ref(false)
let modalTimer = null

const openModal = () => {
  isActive.value = true
  startTimer()
}
const closeModal = () => {
  isActive.value = false
  emit('finished')
  clearTimeout(modalTimer)
}

const startTimer = () => {
  modalTimer = setTimeout(() => {
    closeModal()
  }, props.duration)
}

watch(() => props.activate, (newValue) => {
  // naturally lazy
  if (newValue) {
    openModal()
  } else {
    closeModal()
  }
})

onUnmounted(() => {
  clearTimeout(modalTimer)
})
</script>

<style lang="stylus" scoped>
.modal-overlay
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  background-color: rgba(0, 0, 0, 0.5)
  z-index: 9999

.modal-content
  position: fixed
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  background-color: #fff
  padding: 20px
  border-radius: 4px
  z-index: 10000
</style>
