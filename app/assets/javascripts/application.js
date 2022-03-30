/* global $ */

// Warn about using the kit in production
if (window.console && window.console.info) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
}

$(document).ready(function () {
  window.GOVUKFrontend.initAll()
})

// Hide upload button
document.querySelector('#file-upload-btn').style.display = 'none';

// Automatically upload file on selection
document.getElementById("file-upload-input").onchange = () => {
  document.getElementById("upload-files").submit();
};
