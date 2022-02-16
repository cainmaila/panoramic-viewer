import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Panoramic from '@/controllers/panoramic_main';
const Home = () => {
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

  useEffect(() => {
    window.addEventListener('message', (e) => {
      sdkCommand(e.data);
    });
  }, []);

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
