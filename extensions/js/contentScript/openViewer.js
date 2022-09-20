(function() {
  window.postMessage({
    type: 'SHADER_VIEWER',
    data: {
      type: 'OPEN_VIEWER',
      data: window._shaderViewerExtensionsGlobal
    }
  }, '*');
})();