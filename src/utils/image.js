export function getImageUrl(url, updatedAt) {
  if (!url) return null
  if (url.startsWith('https://ui-avatars.com')) return url
  const timestamp = updatedAt ? new Date(updatedAt).getTime() : Date.now()
  return `${url}?t=${timestamp}`
}
