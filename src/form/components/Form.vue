<script setup>
    
    ../
</script>


<template lang= 'pug'>
  div
    h1 Multi-Step Form
    component(:is="currentComponent")
    div
      button(@click="previousStep") Previous
      button(@click="nextStep") Next
</template>

<!-- ContactList.vue -->
<template lang="pug">
  div
    h1 Contact List
    ul
      li(v-for="contact in contacts" :key="contact.id")
        router-link(:to="`/contacts/${contact.id}`") {{ contact.name }}
    router-view
</template>

<script setup>
import { defineComponent, ref } from 'vue'

defineComponent({
  name: 'ContactList'
})

const contacts = ref([
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' }
  // ...
</script>
])
