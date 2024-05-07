<script setup>
import { ref, computed } from 'vue'
import fuzzysort from 'fuzzysort'

const items = [
  { id: 1, content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  { id: 2, content: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
  { id: 3, content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
  // Add more items as needed
]

const searchTerm = ref('')
const selectedItem = ref(null)
const markedItems = ref([])
const activatedItems = ref([])
const dividerPosition = ref(50)

const filteredItems = computed(() => {
  if (!searchTerm.value) return items
  return fuzzysort.go(searchTerm.value, items, { key: 'content' }).map(({ obj }) => obj)
})

const handleKeydown = (event, item) => {
  switch (event.key) {
    case 'm':
      toggleMark(item)
      break
    case 'c':
      toggleActivate(item)
      break
    case 'x':
      clearMarks()
      break
  }
}

const toggleMark = (item) => {
  if (markedItems.value.includes(item.id)) {
    markedItems.value = markedItems.value.filter((id) => id !== item.id)
  } else {
    markedItems.value.push(item.id)
  }
}

const toggleActivate = (item) => {
  if (activatedItems.value.includes(item.id)) {
    activatedItems.value = activatedItems.value.filter((id) => id !== item.id)
  } else {
    activatedItems.value.push(item.id)
  }
}

const clearMarks = () => {
  markedItems.value = []
  activatedItems.value = []
}

const copyToClipboard = () => {
  if (selectedItem.value) {
    navigator.clipboard.writeText(selectedItem.value.content)
  }
}
</script>

<template lang="pug">
div.foxscribe
  .searchbar
    input(v-model="searchTerm" placeholder="Search...")

  .panes
    .left-pane
      ul
        li(
          v-for="item in filteredItems"
          :key="item.id"
          :class="{ marked: markedItems.includes(item.id), activated: activatedItems.includes(item.id) }"
          @click="selectedItem = item"
          @keydown.prevent="handleKeydown($event, item)"
          tabindex="0"
        )
          span.marker(v-if="markedItems.includes(item.id)") &bull;
          span.marker.activated(v-if="activatedItems.includes(item.id)") &bull;
          | {{ item.content }}

    .divider(:style="{ left: `${dividerPosition}%` }")

    .right-pane
      pre(v-if="selectedItem") {{ selectedItem.content }}
      button(@click="copyToClipboard") Copy to Clipboard

  .statistics
    p Total Items: {{ items.length }}
    p Marked Items: {{ markedItems.length }}
    p Activated Items: {{ activatedItems.length }}

</template>

<style lang="stylus" scoped>
.foxscribe
  display: flex
  flex-direction: column
  height: 100vh

.searchbar
  padding: 0.5rem

.panes
  flex-grow: 1
  position: relative
  display: flex

.left-pane, .right-pane
  padding: 1rem
  overflow-y: auto

.left-pane
  width: 50%
  background-color: #f5f5f5

  ul
    list-style-type: none
    padding: 0
    margin: 0

  li
    padding: 0.5rem
    cursor: pointer

    &.marked
      color: red

    &.activated
      color: blue

    &:hover
      background-color: #e0e0e0

    .marker
      font-size: 0.8rem
      margin-right: 0.5rem

    .marker.activated
      color: blue

.divider
  position: absolute
  top: 0
  bottom: 0
  width: 5px
  background-color: #ccc
  cursor: col-resize

.right-pane
  width: 50%
  background-color: #f0f0f0

  pre
    white-space: pre-wrap
    word-wrap: break-word

.statistics
  padding: 1rem
  background-color: #f5f5f5
</style>
