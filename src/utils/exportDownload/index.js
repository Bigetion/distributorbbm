import Excel from './excel'
const FileSaver = require('file-saver')

function excel (content, filename) {
  var wbout = Excel.generateDocDefinition(content, filename);
  FileSaver.saveAs(new Blob(wbout, {type: "application/octet-stream"}), filename + ".xlsx")
}

function excelByteArray (content, filename) {
  var wbout = Excel.generateDocDefinition(content, filename);
  var bytes = new Uint8Array(wbout[0]);
  var binary = '';
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  var base64 = window.btoa(binary);
  return Converter.base64ToByteArray(base64);
}

export { excel, excelByteArray }