import { Button, Stack } from '@mui/material';
import styled from 'styled-components';
import UploadButton from './UploadButton';

const StackNav = styled(Stack)`
  position: fixed;
  top: 0;
  left: 0;
`;

interface TopUiProps {
  uploadUrl: (string) => void;
  addArea: () => void;
}

const TopUi = (props: TopUiProps) => {
  return (
    <StackNav direction="row" spacing={2}>
      <UploadButton uploadUrl={props.uploadUrl} />
      <Button onClick={props.addArea}>新增區域</Button>
    </StackNav>
  );
};

export default TopUi;
