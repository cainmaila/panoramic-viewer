import { useEffect, useState } from 'react';
import { Snackbar, Alert, Box } from '@mui/material';
import Panoramic from '@/controllers/panoramic_main';
import TopUi from '@/components/TopUi';
import SpeedDialUI from '@/components/SpeedDialUI';
const Home = () => {
  const [panoramic] = useState<Panoramic>(new Panoramic());
  const [pcxUrl, setPcxUrl] = useState<string>('pcx.jpg');

  useEffect(() => {
    panoramic.create(document.getElementById('View'));
    window.addEventListener('mesh-tap', (e: any) => {
      setMessage('點選: ' + e.detail);
    });
    return panoramic.unsubscribe;
  }, []);

  useEffect(() => {
    panoramic.loadImage(pcxUrl);
  }, [pcxUrl]);

  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [key, setKey] = useState<number>(0);

  useEffect(() => {
    setKey(new Date().getTime());
    setOpen(!!message);
  }, [message]);

  useEffect(() => {
    open || setMessage(undefined);
  }, [open]);

  const log = () => {
    console.log('log...');
  };

  return (
    <>
      <Box id="View" sx={{ height: '100vh', overflow: 'hidden' }}></Box>
      <TopUi uploadUrl={setPcxUrl} />
      <SpeedDialUI
        addArea={panoramic.addArea}
        clearStore={panoramic.clearStore}
      />
      <Snackbar
        open={open}
        key={key}
        autoHideDuration={3000}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        onClose={() => setOpen(false)}
      >
        <Alert severity="info" variant="filled" onClose={() => setOpen(false)}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};
export default Home;
