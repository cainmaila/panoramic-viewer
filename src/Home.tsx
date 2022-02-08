import { useEffect, useState } from 'react';
import { Snackbar, Alert, Box } from '@mui/material';
import { makeStyles } from '@material-ui/styles';
import Panoramic from '@/controllers/panoramic_main';
import TopUi from '@/components/TopUi';

const useStyles = makeStyles({
  root: {
    height: '100%',
    overflow: 'hidden',
  },
});

const Home = () => {
  const classes = useStyles();
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

  return (
    <>
      {/* <MyHome id="View"></MyHome> */}
      <Box id="View" className={classes.root}></Box>
      <TopUi
        uploadUrl={setPcxUrl}
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
