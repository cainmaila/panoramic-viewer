window.SDK = {
  setup: function (setting) {
    var container = setting.container;
    var emit = emitContainer(container);
    var _iframe = this._createIframe(setting.viewer, function () {
      emit('viewer-ready');
      _iframe.contentWindow.postMessage(
        { target: 'Viewer', command: 'loadImage', val: setting.imagePath },
        '*',
      );
    });
    container.appendChild(_iframe);
  },
  _createIframe(viewerPath, onready) {
    var _iframe = document.createElement('iframe');
    _iframe.style.width = '100%';
    _iframe.style.height = '100%';
    _iframe.style.border = 'none';
    _iframe.onload = onready;
    _iframe.src = viewerPath;
    return _iframe;
  },
};

function emitContainer(container) {
  return (container.emit = function (event, details) {
    container.dispatchEvent(new CustomEvent(event, { details }));
  });
}
