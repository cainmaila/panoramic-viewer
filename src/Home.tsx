import { useEffect, useState } from 'react';
import {
  Snackbar,
  Alert,
  Box,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
} from '@mui/material';
import FireplaceIcon from '@mui/icons-material/Fireplace';
import AutoDeleteIcon from '@mui/icons-material/AutoDelete';
import Panoramic from '@/controllers/panoramic_main';
import TopUi from '@/components/TopUi';
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
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction
          key={'AddArea'}
          icon={<FireplaceIcon />}
          tooltipTitle={'新增區域'}
          onClick={panoramic.addArea}
        />
        <SpeedDialAction
          key={'ClearStore'}
          icon={<AutoDeleteIcon />}
          tooltipTitle={'清空緩存'}
          onClick={panoramic.clearStore}
        />
      </SpeedDial>
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
