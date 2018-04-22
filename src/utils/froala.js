export default {
  config: {
    placeholderText: 'Edit Your Content Here',
    charCounterCount: false,
    requestWithCORS: false,
    imageAllowedTypes: ['jpeg', 'jpg', 'png'],
    imageManagerLoadMethod: 'POST',
    imageManagerLoadURL: process.env.API_URL + 'page/image/getAllImage',
    imageUploadMethod: 'POST',
    imageUploadURL: process.env.API_URL + 'page/image/uploadImage',
    imageUploadParam: 'image',
    imageManagerDeleteURL: process.env.API_URL + 'page/image/deleteImage'
  }
}