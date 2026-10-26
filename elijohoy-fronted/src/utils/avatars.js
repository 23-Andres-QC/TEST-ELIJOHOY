// Avatares de los 16 tipos de personalidad (WebP optimizados en public/avatars/<codigo>.webp)
export function getAvatarUrl (codigo) {
  if (!codigo) return ''
  return `/avatars/${codigo.toLowerCase()}.webp`
}
