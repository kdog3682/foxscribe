<script setup>

const props = defineProps({
  item: {
    type: Object,
  },
  score: {
    type: Number,
  },
  positions: {
    type: Set,
  }
})

const render = () => {

    const text = props.item.label
    const positions = props.positions

    function colorize(ch, i) {
        const hasKey = positions.has(i)
        const className = hasKey ? 'fzf-labeled' : null
        return h('span', {class: className}, ch)
    }

    const children = text.split('').map(colorize)
    const opts = {
        class: 'fzf-entry'
    }
    return h('li', opts, children)
}
</script>

<template lang = "pug">
    render
</template>

<style lang = "stylus" scoped>
    .message
        color: blue
    .entries
        border: 1px solid red
    .count
        color: black 
        background: yellow
    .fzf-labeled
        color: green
        font-weight: 700
    .fzf-entry
        border-radius: 5px
        border: 1px solid green
        padding: 5px
</style>

