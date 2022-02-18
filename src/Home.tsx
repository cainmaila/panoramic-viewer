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

  const sdkCommand = ({ target, command, val }) => {
    if (target !== 'Viewer') return;
    switch (command) {
      case 'loadImage':
        setPcxUrl(val);
        break;
      case 'addInfoNode':
        panoramic.mode = { state: 'addInfoNode', params: val };
        break;
      case 'stopAddInfoNode':
        panoramic.mode = null;
        break;
      default:
        console.warn('no command', command);
    }
  };

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

  useEffect(() => {
    window.addEventListener('message', (e) => {
      sdkCommand(e.data);
    });

    ajax('./config.json')
      .pipe(map(({ response }) => response))
      .subscribe(setConfig);

    //add an InfoNode
    const addInfoNode$ = fromEvent(window, 'add-infoNode')
      .pipe(
        map((e: Event) => {
          const _e = e as CustomEvent;
          return _e.detail;
        }),
      )
      .subscribe((infoNode) => {
        sdkResultCall('addInfoNode', infoNode);
      });
    return addInfoNode$.unsubscribe;
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
