<script setup>
import { h, getCurrentInstance, toRaw } from 'vue';

const props = defineProps({
  value: {
    type: String,
    required: true
  }
});

const instance = getCurrentInstance();
const parentInstance = toRaw(instance.proxy).$parent;

import * as utils from "/home/kdog3682/2023/utils.js"
const renderTemplate = () => {
  const template = props.value
  const regex = /\$(?:(\w+)|\[(.*?)\]|\{(.*?)\})/g;
  const items = template.trim().split(regex).filter(utils.isDefined)

    function callback(item, i) {
        if (utils.isEven(i)) {
            return h('span', item)
        } else {
            const value = parentInstance[item]
            const className = utils.dashCase(item)
            return h('span', {class: className}, value)
        }
    }
        
    const children = items.map(callback)
    return h('div', {class: 'templater'}, children)
};

const s = `
    2 + 2 = $[4].
    Next, $[5] + 7 = 12.

    function foo(a, b) {
        return $[a] + b + $[b]
    }
    foo(1, 2) = 5
    foo(3, 5) = 13
    // a templating system
`
</script>

<template>
  <render-template></render-template>
</template>
