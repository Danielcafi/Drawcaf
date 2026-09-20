import { supabase } from './supabase'

const BUCKET = 'Drawcaf'

export const storageUpload = async (path, file) => {
  const { error } = await supabase.storage.from(BUCKET).upload(path, file)
  if (error) throw error
  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return publicUrl
}

export const storageRemove = async (paths) => {
  if (!paths || paths.length === 0) return
  const { error } = await supabase.storage.from(BUCKET).remove(paths)
  if (error) throw error
}

export const storageGetPublicUrl = (path) => {
  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return publicUrl
}
