export function FormAttachments({ fileList, onClick }) {
  const attachments = fileList.map((file, idx) =>
    <picture key={idx}
             onClick={() => onClick(idx)}
             className='form-preview-file-cont'
    >
      <source srcSet={URL.createObjectURL(file)}
              type={file.type}
              title={file.name}
              style={{ maxWidth: '100px', maxHeight: '100px', display: 'inline' }}
      />
      <img src='' title={file.name}  // without 'alt' so as to display an empty box
           style={{ width: '100px', height: '100px', display: 'inline' }}
      />
      <span className='form-file-preview-close-btn'>
        X
      </span>
    </picture>
  );

  return (
    <div className='form-files-wrap'>
      {attachments}
    </div>
  );
}
