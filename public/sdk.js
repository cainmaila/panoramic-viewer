window.SDK = {
  setup: function (setting) {
    var container = setting.container;
    var viewerPath = setting.viewer;
    // var imageName = setting.imageName;
    var _iframe = document.createElement('iframe');
    _iframe.style.width = '100%';
    _iframe.style.height = '100%';
    _iframe.style.border = 'none';
    container.appendChild(_iframe);
    var emit = emitContainer(container);
    _iframe.onload = function () {
      emit('viewer-ready');
    };
    _iframe.src = viewerPath;
  },
};

function emitContainer(container) {
  return (container.emit = function (event, details) {
    container.dispatchEvent(new CustomEvent(event, { details }));
  });
}
