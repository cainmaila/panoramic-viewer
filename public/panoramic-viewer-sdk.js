class EventEmitter {
  constructor() {
    this.events = {};
  }
  on(eventName, func) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(func);
  }
  emit(eventName, ...params) {
    const events = this.events[eventName];
    if (events) {
      events.forEach((event) => {
        event.apply(this, params);
      });
    }
  }
  off(eventName, func) {
    if (this.events[eventName]) {
      if (!func) {
        this.events[eventName] = [];
      } else {
        this.events[eventName].splice(this.events[eventName].indexOf(func), 1);
      }
    }
  }
  removeAllListners(eventName) {
    if (eventName) {
      this.events[eventName] = [];
    } else {
      this.events = {};
    }
  }
}

class PanoramicViewerSDK extends EventEmitter {
  constructor(setting) {
    super();
    const container = setting.container;
    const emit = _emitContainer(container);
    const _iframe = this._createIframe(setting.viewer, function () {
      _postToViewer(_iframe, 'loadImage', setting.imagePath);
    });
    this._iframe = _iframe;
    container.appendChild(this._iframe);
    this._addEventListener(emit);
  }
  addInfoNodeMode(iconType, iconSize) {
    this._postToViewer('addInfoNode', { iconType, iconSize });
  }
  delInfoNode(id) {
    this._postToViewer('delInfoNode', id);
  }
  stopAddInfoNode() {
    this._postToViewer('stopAddInfoNode');
  }
  changeIconType(id, iconType, size) {
    this._postToViewer('changeIconType', { id, iconType, size });
  }
  getInfoNodes() {
    this._postToViewer('getInfoNodes');
  }
  loolAtInfoNode(id) {
    this._postToViewer('loolAtInfoNode', id);
  }
  setInfoNodes(nodeMetas) {
    this._postToViewer('setInfoNodes', nodeMetas || []);
  }
  clearInfoNodes() {
    this._postToViewer('clearInfoNodes');
  }
  _addEventListener(emit) {
    this._iframe.contentWindow.addEventListener('message', (e) => {
      if (e.data?.app === 'Viewer') {
        switch (e.data?.val?.command) {
          case 'viewer-ready':
            this.emit('viewer-ready');
            break;
          case 'addInfoNode':
            this.emit('viewer-addInfoNode', e.data.val.params);
            break;
          case 'delInfoNode':
            this.emit('viewer-delInfoNode', e.data.val.params);
            break;
          case 'clickInfoNode':
            this.emit('viewer-clickInfoNode', e.data.val.params);
            break;
          case 'onGetInfoNodes':
            this.emit('viewer-getInfoNodes', e.data.val.params);
            break;
          default:
            console.warn('未定義 Viewer message', e.data);
        }
      }
    });
  }
  _postToViewer(command, val) {
    _postToViewer(this._iframe, command, val);
  }
  _createIframe(viewerPath, onready) {
    var _iframe = document.createElement('iframe');
    _iframe.style.width = '100%';
    _iframe.style.height = '100%';
    _iframe.style.border = 'none';
    _iframe.onload = onready;
    _iframe.src = viewerPath;
    return _iframe;
  }
}

function _postToViewer(_iframe, command, val) {
  _iframe.contentWindow.postMessage({ target: 'Viewer', command, val }, '*');
}

function _emitContainer(container) {
  return (container.emit = function (event, detail) {
    container.dispatchEvent(new CustomEvent(event, { detail }));
  });
}
