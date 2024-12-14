

// 将 Base64 数据解析为 Blob 对象
export const base64ToBlob = (base64data: string, fileName: string = 'file')  => {
  // 如果浏览器支持msSaveOrOpenBlob方法（也就是使用IE浏览器的时候），那么调用该方法去下载图片
  if (window.navigator.msSaveOrOpenBlob) {
    var bstr = atob(base64data.split(',')[1])
    var n = bstr.length
    var u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    var blob = new Blob([u8arr])
    window.navigator.msSaveOrOpenBlob(blob, 'chart-download' + '.' + 'png')
  } else {
    // 这里就按照chrome等新版浏览器来处理
    const a = document.createElement('a')
    a.href = base64data
    a.setAttribute('download', fileName)
    a.click()
  }
}
