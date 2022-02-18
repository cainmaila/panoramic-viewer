window.SDK = {
  setup: function (setting) {
    var container = setting.container;
    var emit = _emitContainer(container);
    var _iframe = this._createIframe(setting.viewer, function () {
      _postToViewer(_iframe, 'loadImage', setting.imagePath);
    });
    this._iframe = _iframe;
    container.appendChild(this._iframe);
    this._iframe.contentWindow.addEventListener('message', function (e) {
      if (e.data?.app === 'Viewer') {
        switch (e.data?.val?.command) {
          case 'viewer-ready':
            emit('viewer-ready');
            break;
          case 'addInfoNode':
            emit('viewer-addInfoNode', e.data.val.params);
            break;
          default:
            console.warn('未定義 Viewer message', e.data);
        }
      }
    });
  },
  addInfoNodeMode(iconType, iconSize) {
    this._postToViewer('addInfoNode', { iconType, iconSize });
  },
  stopAddInfoNode() {
    this._postToViewer('stopAddInfoNode');
  },
  _postToViewer(command, val) {
    _postToViewer(this._iframe, command, val);
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

function _postToViewer(_iframe, command, val) {
  _iframe.contentWindow.postMessage({ target: 'Viewer', command, val }, '*');
}

function _emitContainer(container) {
  return (container.emit = function (event, detail) {
    container.dispatchEvent(new CustomEvent(event, { detail }));
  });
}
