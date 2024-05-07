<script setup>
console.clear()
import { Fzf } from "fzf";
import * as u from "/home/kdog3682/projects/foxscribe/src/composables/helpers.js"
import * as utils from "/home/kdog3682/2023/utils.js"

// inoremap <silent> <buffer>' ""<left><C-R>=Eatchar('\s')<CR>
// inoremap <silent> <buffer>" '<C-R>=Eatchar('\s')<CR>
// inoreab <buffer> xyz foobar<left><C-R>=Eatchar('\s')<CR>


const vFocus = {
  mounted: (el) => el.focus()
}

const vMarked = (el, binding) => {
    const color = binding.arg
    const mods = binding.modifiers
    const key = "background"
    const fg = "color"
     if (binding.value) {
         el.style[key] = color
         el.style[fg] = "black" 
     } else {
         el.style[key] = null
         el.style[fg] = null
     }
     // toggleable
}

const onClick = (index) => {
    selectedIndex.value = index
}
const list = [
  { id: "1", label: "abigaileee",hidden:false,tags:[] },
  { id: "2", label: "abby",hidden:false,tags:[] },
  { id: "3", label: "car",hidden:false,tags:[] },
  { id: "4", label: "can",hidden:false,tags:[] },
  { id: "5", label: "dog",hidden:false,tags:[] },
]


const fzf = new Fzf(list, {
  selector: (item) => item.label,
})

const rankings = ref([])
const entries = ref([])


function checkpoint(entry) {
    return entry.item.hidden == false
}

const onInput = () => {
    entries.value = fzf.find(query.value).filter(checkpoint)
}

const selectedIndex = ref(0)
const count = ref(0)
const onEscape = () => {
    count.value++
    query.value = ''
}


const message = ref('no message yet')
const onEnter = () => {
    message.value = `enter was pressed at ${new Date}`
}
const actions = {
    escape: onEscape,
    enter: onEnter,
}
onMounted(async () => {
    // it is a syntax sugar to get things
    const cmd = 'a'
    const items =  u.keyparse(cmd, query, actions)
    await u.keytrain(items, query, actions)
    incrementGlobalTag()
    // input.focus()
})

const query = ref('')
watch(query, onInput)


function arrowMovement(dir) {
    const size = entries.value.length
    const index = utils.modularIncrementIndex(size, selectedIndex.value, dir)
    selectedIndex.value = index
}
const keyHandlers = {
    Tab() {
        input.value.focus()
    },
    ArrowUp() {
        arrowMovement(-1)
    },
    ArrowDown() {
        arrowMovement(1)
    },
    m() {
        const tag = "util"
        toggleTag(tag)
    }
}

function toggleTag(tag) {
        const tags = entries.value[selectedIndex.value].item.tags
        if (tags.includes(tag)) {
            utils.pop2(tags, tag)
        } else {
            tags.push(tag)
        }
}
function pushTag(tag) {
        const tags = entries.value[selectedIndex.value].item.tags
        if (tags.includes(tag)) {
            return 
        }
        tags.push(tag)
}
const handleKeydown = (e) => {
    const key = e.key
    const fn = keyHandlers[key]
    if (fn) {
        fn()
        e.preventDefault()
    } else {
        console.log({key})
    }
}
const input = ref(null)
const currentGlobalTag = ref("")

const tags = [
    "util",
    "validation",
    "matching",
    "pathing",
    "collections",
    "misc",
    "format",
]

const globalTags = ref(tags)
function announce() {
    const strf = "%I:%M:%s%p"
    message.value = `${utils.strftime(strf)}: ${u.getCaller5()} `
}
function incrementGlobalTag() {
    const nextTag = utils.modularIncrement(globalTags.value, currentGlobalTag.value)
    currentGlobalTag.value = nextTag    
    announce()
}

function applyTagGlobally() {
    const v = currentGlobalTag.value
    const items = entries.value
    const messages = []
    items.forEach((item, i) => {
        if (utils.empty(item.tags)) {
            item.tags.push(v)
            messages.push(`applied tag ${v} to ${item.label}`)
        }
    })
    logMessages(messages)
}
const logs = ref([])
async function logMessages(messages) {

    logs.value = messages
    await sleep(2000)
    logs.value = []
}

const selectGlobalTag = (tag) => {
    currentGlobalTag.value = tag
}
</script><template lang='pug'>
    p.message message: {{message}}

    button(@click = 'incrementGlobalTag') incrementGlobalTag    

    button(@click = 'applyTagGlobally') applyTagGlobally    

    ul.flex.tag-group
        span(
        class = "top-tag"
                v-for = "tag, index in globalTags"
                v-marked:yellow.bg="tag == currentGlobalTag"
                @click = "selectGlobalTag(tag)"
        ) {{tag}}

    div.label-group
        label currentGlobalTag:
        input(v-model='currentGlobalTag' placeholder = "placeholder tag")
    
    div.label-group
        label query input:
        input(
            tabindex="0"
            v-model="query" 
            v-focus
            @input="onInput" 
            @keydown.esc="onEscape"
            placeholder = "press escape to clear"
        )
    ul(v-if = "entries.length", 
        tabindex="0"
        @keydown = 'handleKeydown'
    )
        li(
            :class="{ 'selected': index === selectedIndex }"
            v-for = "entry, index in entries" :key = "entry.item")

                div.space-between(@click = "onClick(index)")
                    fzf-entry(v-bind = "entry")
                    div.tags
                        .tag( v-for = "tag in entry.item.tags" @click = "emitTagChange(tag)" :class = "tag + '-tag'" ) {{tag}}
    // pre.entries {{entries}}
    // div.count {{count}}
</template>

<style lang = "stylus">

.message
    color: blue
.entries
    border: 1px solid red
.count
    color: black 
    background: yellow
.flex 
    display: flex
    column-gap: 5px
    flex-wrap: wrap
.tags
    display: flex
    column-gap: 5px
.tag
    border-radius: 50%
    width: fit-content
    height: 10px
    padding: 5px
    border: 1px solid blue
.util-tag
    border: 1px solid green
.selected
    background: yellow
.space-between
    display: flex
    justify-content: space-between
.yellow
    background: yellow
ul 
    max-width: 300px
.label-group
    max-width: 400px
    display: flex
    flex-wrap: wrap
.label-group
    label
        white-space: nowrap   // prevents wrapping
        flex-shrink: 0        // prevents label from shrinking
    input
        flex-grow: 0          // we want the input to grow
        min-width: 100px
    label:hover
        color: blue
    input:hover
        border: 2px solid black
pre
    width: 300px
    overflow: hidden
button
    display: block
.tag-group
    display: flex
    flex-wrap: wrap
    column-gap: 5px

    span
        font-size: 15px
        overflow: hidden
        border-radius: 10px
        background: blue
        padding: 5px
        color: white
        font-weight: bold
        border: 0.5px solid black
        
</style>
