export function debounce(fn, wait = 2000) {
    let timeout
    return (...args) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => fn(...args), wait)
    }
}