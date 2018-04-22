import Confirmation from './../components/directives/Confirmation'
import DownloadExcel from './../components/directives/DownloadExcel'

function modal(context, options) {
  var promise = new Promise(function(resolve, reject) {
    const newOptions = Object.assign({
      onClose(response) {
        resolve(response)
      }
    }, options)
    context.$vuedals.open(newOptions)
  });
  return promise
}

function confirm(context, props) {
  var promise = new Promise(function(resolve, reject) {
    context.$vuedals.open({
      name: 'confirmation-modal',
      props: props,
      dismissable: false,
      component: Confirmation,
      onClose(condition) {
        if(condition) resolve(condition);
      }
    })
  });
  return promise
}

function downloadExcel(context, props) {
  var promise = new Promise(function(resolve, reject) {
    context.$vuedals.open({
      name: 'download-modal',
      props: props,
      dismissable: false,
      component: DownloadExcel,
      onClose(response) {
        if(response) resolve(response);
      }
    })
  });
  return promise
}

export { modal, confirm, downloadExcel }