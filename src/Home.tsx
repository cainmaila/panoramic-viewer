import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Panoramic from '@/controllers/panoramic_main';
const Home = () => {
  const [panoramic] = useState<Panoramic>(new Panoramic());
  const [pcxUrl, setPcxUrl] = useState<string>('pcx.jpg');

  useEffect(() => {
    panoramic.create(document.getElementById('View'));
    return panoramic.unsubscribe;
  }, []);

  useEffect(() => {
    panoramic.loadImage(pcxUrl);
  }, [pcxUrl]);
  return (
    <>
      <Box id="View" sx={{ height: '100vh', overflow: 'hidden' }}></Box>
    </>
  );
};
export default Home;
