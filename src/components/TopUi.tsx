import { Button, Stack } from '@mui/material';
import UploadButton from './UploadButton';

interface TopUiProps {
  uploadUrl: (string) => void;
  addArea: () => void;
  clearStore: () => void;
}

const TopUi = (props: TopUiProps) => {
  return (
    <Stack
      sx={{ position: 'fixed', top: 0, left: 0 }}
      direction="row"
      spacing={2}
    >
      <UploadButton uploadUrl={props.uploadUrl} />
      <Button onClick={props.addArea}>新增區域</Button>
      <Button onClick={props.clearStore}>清空緩存</Button>
    </Stack>
  );
};

export default TopUi;
