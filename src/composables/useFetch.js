import { ref, toValue, watchEffect } from "vue"
import { onMounted, onUnmounted } from 'vue'

async function request(url) {
    const res = await fetch(url)
    return await res.json()
}

export function useFetch(url, get = request) {
    const data = ref(null)
    const error = ref(null)
    const isLoading = ref(false)

    watchEffect(async () => {
        // reset state before fetching..
        data.value = null
        error.value = null
        isLoading.value = true

        // resolve the url value synchronously so it's tracked as a
        // dependency by watchEffect()
        const urlValue = toValue(url)
        try {
            data.value = await get(urlValue)
        } catch (e) {
            error.value = e
        } finally {
            isLoading.value = false
        }
    })

    return { data, error, isLoading }
}

function resolveElement(target) {
    if (isString(target)) {
        return document.querySelector(target)
    } else {
        return target
    }
}
export function useEventListener(target, event, callback) {
    const el = resolveElement(target)
  onMounted(() => el.addEventListener(event, callback))
  onUnmounted(() => el.removeEventListener(event, callback))
}




