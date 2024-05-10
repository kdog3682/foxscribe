<template lang="pug">
  div
    table(v-if = 'columnHeaders && rowHeaders')
      thead
        tr
          th(v-for="colHeader in columnHeaders" :key="colHeader") {{ colHeader }}
      tbody
        tr(v-for="(row, rowIndex) in body" :key="rowIndex")
          td(v-for="(cell, colIndex) in row" :key="colIndex") {{ cell }}
    table(v-else-if = 'columnHeaders')
      thead
        tr
          th(v-for="colHeader in columnHeaders" :key="colHeader") {{ colHeader }}
      tbody
        tr(v-for="(row, rowIndex) in body" :key="rowIndex")
          td(v-for="(cell, colIndex) in row" :key="colIndex") {{ cell }}
    table(v-else-if = 'rowheaders')
      tbody
        tr(v-for="(row, rowIndex) in body" :key="rowIndex")
            th {{rowHeaders[rowIndex]}}
            td(v-for="(cell, colIndex) in row" :key="colIndex") {{ cell }}
</template>

<script setup>

const props = defineProps(['rowHeaders', 'columnHeaders', 'body'])

</script>

<style lang="stylus">
table
  width: 100%
  border-collapse: collapse

th, td
  padding: 0.5rem
  border: 1px solid #ddd
  text-align: left

th
  background-color: #f5f5f5
  font-weight: bold

tr:nth-child(even)
  background-color: #f2f2f2
</style>
