import { SpeedDial, SpeedDialIcon, SpeedDialAction } from '@mui/material';
import FireplaceIcon from '@mui/icons-material/Fireplace';
import AutoDeleteIcon from '@mui/icons-material/AutoDelete';
const SpeedDialUI = (props: I_Panoramic_Handle) => {
  return (
    <SpeedDial
      ariaLabel="SpeedDialUI"
      sx={{ position: 'absolute', bottom: 16, right: 16 }}
      icon={<SpeedDialIcon />}
    >
      <SpeedDialAction
        key={'AddArea'}
        icon={<FireplaceIcon />}
        tooltipTitle={'新增區域'}
        onClick={props.addArea}
      />
      <SpeedDialAction
        key={'ClearStore'}
        icon={<AutoDeleteIcon />}
        tooltipTitle={'清空緩存'}
        onClick={props.clearStore}
      />
    </SpeedDial>
  );
};

export default SpeedDialUI;
