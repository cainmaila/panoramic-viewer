import { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';

const MyHome = styled.div`
  height: 100%;
  overflow: hidden;
`;
import { sceneInit } from './controllers/createRender';
import Panoramic from './controllers/panoramic_main';

import TopUi from './components/TopUi';

const Home = () => {
  const [panoramic] = useState(new Panoramic());
  const [pcxUrl, setPcxUrl] = useState('pcx.jpg');

  useEffect(() => {
    panoramic.create(document.getElementById('View'));
    return panoramic.unsubscribe;
  }, []);

  useEffect(() => {
    panoramic.loadImage(pcxUrl);
  }, [pcxUrl]);

  return (
    <>
      <MyHome id="View"></MyHome>
      <TopUi uploadUrl={setPcxUrl} addArea={panoramic.addArea} />
    </>
  );
};
export default Home;
