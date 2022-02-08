import { Button, Stack } from '@mui/material';
import UploadButton from './UploadButton';

interface TopUiProps {
  uploadUrl: (string) => void;
}

const TopUi = (props: TopUiProps) => {
  return (
    <Stack
      sx={{ position: 'fixed', top: 0, left: 0 }}
      direction="row"
      spacing={2}
    >
      <UploadButton uploadUrl={props.uploadUrl} />
    </Stack>
  );
};

export default TopUi;
