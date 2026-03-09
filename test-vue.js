const { ref, reactive, isReactive } = require('vue')
const arr = ref([])
const obj = { id: 1, text: '' }
arr.value.push(obj)
console.log(isReactive(obj))
console.log(isReactive(arr.value[0]))
