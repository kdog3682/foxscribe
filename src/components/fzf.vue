<script setup>
console.clear()
import { Fzf } from "fzf";
import * as u from "/home/kdog3682/projects/foxscribe/src/composables/helpers.js"
import * as utils from "/home/kdog3682/2023/utils.js"

// inoremap <silent> <buffer>' ""<left><C-R>=Eatchar('\s')<CR>
// inoremap <silent> <buffer>" '<C-R>=Eatchar('\s')<CR>
// inoreab <buffer> xyz foobar<left><C-R>=Eatchar('\s')<CR>
// fix is ...


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
const labels = [
    "abigaileee",
    "abby",
    "car",
    "can",
    "dog",
]
const funcs = Object.keys(utils)
const list = labels.map((label, i) => {
    const item = {}
    item.content = String(utils[funcs[i]])
    item.hidden = false
    item.filtered = false
    item.tags = []
    item.id = i + 1
    item.label = label
    return item
})


const fzf = new Fzf(list, {
  selector: (item) => item.label,
})

const rankings = ref([])
const entries = ref([])


function checkpoint(entry) {
    return entry.item.hidden == false
}

const onInput = (val, oldval) => {
    const baseMatches = fzf.find(query.value)
    const matches = baseMatches.filter(checkpoint)
    entries.value = matches
}

const numTotal = ref(list.length)
const numMatched = computed(() => {
    return list.length - entries.value.length
})

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
const keyTrainActions = {
    escape: onEscape,
    enter: onEnter,
}
onMounted(async () => {
    // it is a syntax sugar to get things
    const cmd = 'a'
    const items =  u.keyparse(cmd, query, keyTrainActions)
    await u.keytrain(items, query, keyTrainActions)

    // incrementGlobalTag()
    const themeColors = {
  '--color-base': 'black',           // Base text color for code blocks
  '--color-comment': 'blue',        // For comments
  '--color-keyword': 'black',        // Purple color used for keywords
  '--color-string': 'black',         // Green color used for strings
  '--color-type': 'green',           // Blue used for function names, types
  '--color-name': 'red',           // Red used for variable names, tags
  '--color-meta': '#de935f',           // Orange used for meta info, like numbers, preprocessor directives
  '--color-section': 'blue',        // Aqua color
  '--color-link': '#f0c674',           // Yellow used for links (hypothetically)
  '--font-weight-normal': '400',       // Normal font weight
  '--font-weight-bold': '700',         // Bold font weight
  '--background-color': 'white',     // Background color for code blocks
};
    // u.setHighlightTheme(themeColors)
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
const opts = {
    options: ['vert', 'horo']
}
function useToggle(opts) {
    const status = ref('')
    function toggle() {
        status.value = utils.modularIncrement(opts.options, status.value)
    }
    toggle()
    return {
        status, toggle
    }
}
const {status: vertOrHorozo, toggle: toggleVertOrHoro} = useToggle(opts)
let baseActions = [
    selectGlobalTag,
    applyTagGlobally,
    toggleVertOrHoro,
]

function fix(fn) {
    if (utils.isFunction(fn)) {
        return {
            name: fn.name,
            handler: fn,
        }
    }
}
const actions = reactive(baseActions.map(fix))

const codeDisplayText = computed(() => {
    const entry = entries.value[selectedIndex.value]
    if (!entry) {
        return 
    }
    return entry.item.content
})

const filters = ref([])
function addFilter() {
    console.log('adding filterrrrrrrrrrrrrrrrr')
    const o = {
        regex: '',
        label: 'regex',
        type: '',
        options: ['identifier', 'body'],
    }
    filters.value.push(o)
}
function executeFilters(filter) {
    const { type, regex } = filter
    console.log({type, regex})
}

const profiles = ref([])
function saveFilterProfile(label, filters) {
    profiles.values.push({label, filters})
}


function computeTable(filters) {
    const headers = ['type', 'regex']
    const item = (filter) => {
        return headers.map((header) => filter[header])
    }

    return {
        columnHeaders: headers,
        body: filters.map(callback)
    }

}
</script><template lang='pug'>

div.vert
    p.message message: {{message}}

    button.submit(v-if = "numRemaining == 0" @click = 'submitResults')

    // the current results
    section
        .partitions
            .profile(v-for = 'p in profiles')

        .amount-remaining
            v-templater( value = 'there are still $numRemaining items remaining.')
        
        
    .profiles
        .profile(v-for = 'p in profiles')
            v-tooltip(:label = 'p.label')
                template(#content)
                    v-table(:value = 'computeTable(p.filters)')
    .buttons
        .action-button(v-for= "action in actions")
            button(@click = "action.handler" ) {{action.name}}

    ul.flex.tag-group
        span(
        class = "top-tag"
                v-for = "tag, index in globalTags"
                v-marked:yellow.bg="tag == currentGlobalTag"
                @click = "selectGlobalTag(tag)"
        ) {{tag}}

    v-input(v-model = 'currentGlobalTag', label = 'Active Tag', pos = 'left')

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

    div.filter-component.vert
        ul
            li.filter-selection-item(v-for = 'filter, index in filters')
                v-input(v-model = 'filter.regex', :label = 'filter.label')
                v-checkbox(v-model = 'filter.type', :options = 'filter.options')

        div.vert
            button.add-input(@click='addFilter') add filter
            button.execute-filter(@click = 'executeFilters') executeFilter
            
    .fzf-container(:class = 'vertOrHorozo')
        .left
            .fzf-list
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
                                    .tag(
                                        v-for = "tag in entry.item.tags"
                                        @click = "emitTagChange(tag)"
                                        :class = "tag + '-tag'"
                                    ) {{tag}}
                p(v-else) nothing to show

            .entry-count {{numMatched}} / {{numTotal}}

        .right(v-if = '1 + 1 == 2')
            code-display(
                :code = 'codeDisplayText'                           
                 language = 'javascript'
            )

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

.vert
    display: flex
    flex-direction: column
.horo
    display: flex

.filter-selection-item
    border: 0.5px solid black

.filter-component
    border: 0.5px solid black
</style>
