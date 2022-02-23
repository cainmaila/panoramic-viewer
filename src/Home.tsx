import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { ajax } from 'rxjs/ajax';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

import Panoramic from '@/controllers/panoramic_main';
const Home = () => {
  const [config, setConfig] = useState<any>(null);
  const [panoramic] = useState<Panoramic>(new Panoramic());
  const [pcxUrl, setPcxUrl] = useState<string>('./null.jpg');

  const sdkResultCall = (
    command: string,
    params: any | undefined = undefined,
  ) => {
    window.postMessage(
      {
        app: 'Viewer',
        val: { command, params },
      },
      '*',
    );
  };
  let projectRes;
  const sdkCommand = ({ target, command, val }) => {
    if (target !== 'Viewer') return;
    switch (command) {
      case 'loadImage':
        setPcxUrl(val);
        break;
      case 'addInfoNode':
        panoramic.mode = { state: 'addInfoNode', params: val };
        break;
      case 'delInfoNode':
        panoramic.delInfoNode(val);
        break;
      case 'stopEditMode':
        panoramic.mode = null;
        break;
      case 'editInfoNodeMode':
        panoramic.mode = { state: 'editInfoNode', params: val };
        break;
      case 'changeIconType':
        panoramic.changeIconType(val.id, val.iconType, val.size);
        break;
      case 'getInfoNodes':
        sdkResultCall('onGetInfoNodes', panoramic.infoNodes);
        break;
      case 'loolAtInfoNode':
        panoramic.loolAtInfoNode(val.id, val.setting, () => {
          sdkResultCall('loolAtInfoNode-complete', {
            callBackId: val.callBackId,
          });
        });
        break;
      case 'setInfoNodes':
        panoramic.setInfoNodes(val);
        break;
      case 'clearInfoNodes':
        panoramic.clearInfoNodes();
        break;
      case 'project':
        projectRes = panoramic.project(val.po3d);
        sdkResultCall('projectRes', { ...val, po2d: projectRes });
        break;
      default:
        console.warn('no command', command);
    }
  };

  useEffect(() => {
    window.addEventListener('message', (e) => {
      sdkCommand(e.data);
    });

    ajax('./config.json')
      .pipe(map(({ response }) => response))
      .subscribe(setConfig);

    //add an InfoNode
    const res_addInfoNode = (_meta) => {
      sdkResultCall('addInfoNode', _meta);
      panoramic.mode = null;
    };
    panoramic.on('add-infoNode', res_addInfoNode);

    //del an InfoNode
    panoramic.on('del-infoNode', (_delId) =>
      sdkResultCall('delInfoNode', _delId),
    );
    //click infoNode
    panoramic.on('click-infoNode', (_meta) =>
      sdkResultCall('clickInfoNode', _meta),
    );
    //edit infNode
    panoramic.on('edit-infoNode', (_meta) =>
      sdkResultCall('editInfoNode', _meta),
    );

    return () => {
      panoramic.off('add-infoNode');
      panoramic.off('del-infoNode');
      panoramic.off('click-infoNode');
    };
  }, []);

  useEffect(() => {
    if (config) {
      _settingIconTexture(config?.iconLib || []);
      sdkResultCall('viewer-ready');
    }
  }, [config]);

  useEffect(() => {
    panoramic.create(document.getElementById('View'));
    return panoramic.unsubscribe;
  }, []);

  useEffect(() => {
    pcxUrl && panoramic.loadImage(pcxUrl);
  }, [pcxUrl]);
  return (
    <>
      <Box id="View" sx={{ height: '100vh', overflow: 'hidden' }}></Box>
    </>
  );
};

export default Home;

//設定icon類型與材質
import TextureLib from '@/controllers/customize/TextureLib';
function _settingIconTexture(icons: [I_IconTexture]) {
  icons.forEach((icon: I_IconTexture) => {
    TextureLib.createTexture(icon.type, icon.path);
  });
}
