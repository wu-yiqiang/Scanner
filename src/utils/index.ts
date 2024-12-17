

// 将 Base64 数据解析为 Blob 对象
export const base64ToBlob = (base64data: string, fileName: string = 'file')  => {
  const a = document.createElement('a')
  a.href = base64data
  a.setAttribute('download', fileName)
  a.click()
}
