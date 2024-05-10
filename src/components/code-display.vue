<template lang="pug">
.code-display(v-if = 'code')
  .code-header
    slot(name="header")
    button.copy-btn(@click="copyToClipboard")
        clipboard-icon(:clicked = 'clicked' @clicked = 'clicked = false')

  pre.code-block
      code(v-html = 'computedCode')
.empty-code-display(v-else)
    p waiting for code
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as utils from "/home/kdog3682/2023/utils.js"
import hljs from 'highlight.js'





const props = defineProps({
  code: {
    required: true
  }
})

const clicked = ref(false)
const copyToClipboard = async () => {
    await navigator.clipboard.writeText(props.code)
    clicked.value = true
}
const computedCode = computed(() => {
    const language = 'javascript'
    const highlight = hljs.highlight(props.code, {language})
    return highlight.value
})

</script>

<style lang="stylus" scoped>
.code-display
  position: relative
  border: 1px solid #e1e4e8
  border-radius: 4px

.code-header
  display: flex
  align-items: center
  justify-content: space-between
  padding: 8px 12px
  background-color: #f6f8fa
  border-bottom: 1px solid #e1e4e8
  font-size: 14px
  font-weight: 600

.copy-btn
  display: flex
  align-items: center
  justify-content: center
  background: transparent
  border: 1px solid green
  cursor: pointer

.copy-icon
  width: 16px
  height: 16px

.code-block
  margin: 0
  padding: 12px
  font-family: 'Source Code Pro', monospace
  font-size: 13px
  line-height: 1.5
  overflow: auto

/* Add your preferred syntax highlighting styles here */
</style>
