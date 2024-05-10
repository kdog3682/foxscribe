<script setup>

const green = 'green'
const red = 'red'
const orange = 'orange'
const blue = 'blue'
const black = 'black'
const yellow = 'yellow'

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
        const a = {
            fontWeight: 700,
            color: green,
        }
        /*
            @doc
            because there are other class effects, it is necessary to do the coloring via style to override previous class effects
        */
        const style = hasKey ? a : null
        const opts = {
            style
        }
        return h('span', opts, ch)
        // const className = hasKey ? 'fzf-labeled' : null
        // return h('span', {class: className}, ch)
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

