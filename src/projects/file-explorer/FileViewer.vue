<template lang="pug">
.file-viewer
  .left-menu
    ul
      li(v-for="file in unmarkedFiles" :key="file.filename" 
         @click="selectFile(file)" 
         :class="{ active: activeFile === file }")
        | {{ file.filename }}
  .right-content
    .file-info(v-if="activeFile")
      h2 {{ activeFile.filename }}
      p Size: {{ activeFile.size }} bytes
      p Last Modified: {{ new Date(activeFile.lastModified).toLocaleString() }}
    .file-text(v-if="activeFile")
      | {{ activeFile.text }}
  modal(v-if="showModal" @close="showModal = false")
    h3 Select Destination
    ul
      li(v-for="(dest, index) in destinations" :key="dest")
        | {{ dest }} ({{ dest[0] }})

</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'FileViewer',
  props: {
    files: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const activeFile = ref(null)
    const trashArray = ref([])
    const destinationArrays = ref({
      'Archive': [],
      'Important': [],
      'Work': [],
      'Personal': [],
      'Miscellaneous': []
    })
    const showModal = ref(false)
    const destinations = Object.keys(destinationArrays.value)

    const unmarkedFiles = computed(() => {
      return props.files.filter(file => 
        !trashArray.value.includes(file.filename) && 
        !Object.values(destinationArrays.value).flat().includes(file.filename)
      )
    })

    const selectFile = (file) => {
      activeFile.value = file
    }

    const handleKeyPress = (event) => {
      if (event.key === 'd') {
        markFile('trash')
      } else if (event.key === 'm') {
        showModal.value = true
      } else if (destinations.map(d => d[0].toLowerCase()).includes(event.key)) {
        markFile(destinations.find(d => d[0].toLowerCase() === event.key))
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        navigateFiles(event.key === 'ArrowUp' ? -1 : 1)
      }
    }

    const markFile = (destination) => {
      if (!activeFile.value) return

      if (destination === 'trash') {
        trashArray.value.push(activeFile.value.filename)
      } else {
        destinationArrays.value[destination].push(activeFile.value.filename)
      }

      const currentIndex = unmarkedFiles.value.indexOf(activeFile.value)
      if (currentIndex < unmarkedFiles.value.length - 1) {
        activeFile.value = unmarkedFiles.value[currentIndex + 1]
      } else if (unmarkedFiles.value.length > 0) {
        activeFile.value = unmarkedFiles.value[0]
      } else {
        activeFile.value = null
      }

      showModal.value = false
    }

    const navigateFiles = (direction) => {
      const currentIndex = unmarkedFiles.value.indexOf(activeFile.value)
      const newIndex = (currentIndex + direction + unmarkedFiles.value.length) % unmarkedFiles.value.length
      activeFile.value = unmarkedFiles.value[newIndex]
    }

    window.addEventListener('keydown', handleKeyPress)

    return {
      activeFile,
      unmarkedFiles,
      selectFile,
      showModal,
      destinations
    }
  }
}
</script>

<style lang="stylus">
.file-viewer
  display: flex
  height: 100vh

.left-menu
  width: 200px
  border-right: 1px solid #ccc
  overflow-y: auto

  ul
    list-style-type: none
    padding: 0

    li
      padding: 10px
      cursor: pointer

      &:hover
        background-color: #f0f0f0

      &.active
        background-color: #e0e0e0

.right-content
  flex: 1
  padding: 20px
  overflow-y: auto

.file-info
  margin-bottom: 20px

.file-text
  white-space: pre-wrap

.modal
  position: fixed
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  background-color: white
  padding: 20px
  border-radius: 5px
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1)

  ul
    list-style-type: none
    padding: 0

    li
      margin-bottom: 10px
</style>
