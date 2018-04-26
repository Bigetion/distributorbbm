import Excel from './excel'
import Pdf from './pdf'
const FileSaver = require('file-saver')

function excel(content, filename) {
  var wbout = Excel.generateDocDefinition(content, filename);
  FileSaver.saveAs(new Blob(wbout, { type: "application/octet-stream" }), filename + ".xlsx")
}

function excelByteArray(content, filename) {
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

function pdf(content, filename, orientation, pageSize) {
  var docDefinition = Pdf.generateDocDefinition(content, filename, orientation, pageSize);
  pdfMake.createPdf(docDefinition).download(filename + '.pdf');
}

function pdfByteArray(content, filename, orientation, pageSize) {
  var docDefinition = Pdf.generateDocDefinition(content, filename, orientation, pageSize);
  var deferred = $q.defer();

  pdfMake.createPdf(docDefinition).getBase64(function (encodedString) {
    deferred.resolve(Converter.base64ToByteArray(encodedString));
  });

  return deferred.promise;
}

function print(content, filename, orientation, pageSize) {
  var docDefinition = Pdf.generateDocDefinition(content, filename, orientation, pageSize);
  pdfMake.createPdf(docDefinition).print();
}

export { excel, excelByteArray, pdf, pdfByteArray, print }