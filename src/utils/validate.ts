export function isInternet(strs: string) {
  if (typeof strs !== 'string') return false
  const reg =
    /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/
  return reg.test(strs)
}
