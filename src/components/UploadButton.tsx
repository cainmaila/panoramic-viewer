import { Button } from '@mui/material';
import { fromEvent } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { useRef, useEffect } from 'react';

interface UploadButtonProps {
  uploadUrl: (string) => void;
}

const UploadButton = (props: UploadButtonProps) => {
  const uploadInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const clicky = fromEvent(
      uploadInputRef.current as HTMLInputElement,
      'change',
    )
      .pipe(
        map((e) => {
          const _input = e.target as HTMLInputElement;
          return _input?.files;
        }),
        map((files) => (files && files[0]) || null),
        filter((file) => !!file),
        map((_file) => _file && URL.createObjectURL(_file)),
      )
      .subscribe(props.uploadUrl);
    return () => clicky.unsubscribe();
  }, []);

  return (
    <>
      <Button
        onClick={() => uploadInputRef.current && uploadInputRef.current.click()}
      >
        上傳全景圖
      </Button>
      <input ref={uploadInputRef} type="file" accept="image/*" hidden />
    </>
  );
};

export default UploadButton;
