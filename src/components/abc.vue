
<script setup>
import { Fzf } from "fzf";
import * as u from "/home/kdog3682/projects/foxscribe/src/composables/helpers.js"

const list = [
  { id: "1", label: "abigaile" },
  { id: "2", label: "apple" },
  { id: "3", label: "car" },
  { id: "4", label: "can" },
  { id: "5", label: "dog" },
]

const fzf = new Fzf(list, {
  selector: (item) => item.label,
})
const rankings = ref([])
const entries = ref([])

const onInput = () => {
    entries.value = fzf.find(query.value)
    rankings.value = entries.value.map((entry) => entry.item.label)
}

const count = ref(0)
const onEscape = () => {
    count.value++
    query.value = ''
}


const message = ref('')
const onEnter = () => {
    message.value = `enter was pressed at ${new Date}`
}
const actions = {
    escape: onEscape,
    enter: onEnter,
}
onMounted(async () => {
    const cmd = 'a   b'
    const items =  u.keyparse(cmd, query, actions)
    u.keytrain(items, query, actions)
})

const query = ref('')
const values = ref([])
watch(query, (newVal, oldVal) => {
    values.value.push({newVal, oldVal})
    onInput()
})

</script>


<template lang='pug'>
    p.message {{message}}
    input(
        v-model="query" 
        @input="onInput" 
        @keydown.esc="onEscape"
        placeholder = "press escape to clear"
        autofocus
    )
    ul
        li(v-for = "rank in rankings") {{rank}}

    pre.entries {{entries}}
    pre.entries {{values}}
    div.count {{count}}
</template>

<style lang = "stylus">
    .message
        color: blue
    .entries
        border: 1px solid red
    .count
        color: black 
        background: yellow
    
</style>

