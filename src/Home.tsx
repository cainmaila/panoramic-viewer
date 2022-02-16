import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs';
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
      default:
        console.warn('no command', command);
    }
  };

  const sdkResultCall = (val: any) => {
    window.postMessage(
      {
        app: 'Viewer',
        val,
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
  }, []);

  useEffect(() => {
    config && sdkResultCall('viewer-ready');
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
