import { useEffect, useState } from 'react';
// import styled from 'styled-components';
import { Snackbar, Alert, Box } from '@mui/material';
import { makeStyles } from '@material-ui/styles';

// const MyHome = styled.div`
//   height: 100%;
//   overflow: hidden;
// `;
import Panoramic from './controllers/panoramic_main';

import TopUi from './components/TopUi';

const useStyles = makeStyles({
  root: {
    height: '100%',
    overflow: 'hidden',
  },
});

const Home = () => {
  const classes = useStyles();
  const [panoramic] = useState(new Panoramic());
  const [pcxUrl, setPcxUrl] = useState('pcx.jpg');

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

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | undefined>(undefined);

  useEffect(() => {
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
        autoHideDuration={6000}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Alert severity="info" variant="filled" onClose={() => setOpen(false)}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};
export default Home;
