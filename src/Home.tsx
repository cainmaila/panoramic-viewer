import { useEffect, useState } from 'react';
import styled from 'styled-components';

const MyHome = styled.div`
  height: 100%;
  overflow: hidden;
`;
import { sceneInit } from './controllers/createRender';

const Home = () => {
  useEffect(() => {
    const { unsubscribe } = sceneInit(document.getElementById('View'));
    return unsubscribe;
  }, []);
  return (
    <>
      <MyHome id="View"></MyHome>
    </>
  );
};
export default Home;
