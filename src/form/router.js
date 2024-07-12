import { createRouter, createWebHashHistory } from 'vue-router'
import * as utils from "/home/kdog3682/2023/utils.js"

const numbers = [
    "1",
    "2",
    "3",
    "4",
    "5",
]

function createComponent(n) {
    const template = utils.sayhi(n)
    return {
        template
    }
}
function callback(n) {
    return {
        path: `step-${n}`,
        component: createComponent(n)
    }
}

const children = numbers.map(callback)
const routes = [
  {
    path: '/',
    component: Form,
    children
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
