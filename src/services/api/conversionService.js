import apiClient from './client'

export async function convertXmlToMt103(file) {
  if (!file) {
    throw new Error('File is required for conversion.')
  }

  const formData = new FormData()
  formData.append('file', file)

  const { data } = await apiClient.post('/convert', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return data
}
