export function FormAttachments({ fileList, onFileRemove }) {

  const attachments = fileList.map((file, idx) =>
    <picture key={idx}
             onClick={() => onFileRemove(idx, file)}
             className='relative w-fit inline-block'
    >
      <source srcSet={URL.createObjectURL(file)}
              type={file.type}
              title={file.name}
              style={{ maxWidth: '100px', maxHeight: '100px', display: 'inline' }}
      />
      <img src='' title={file.name}  // without 'alt' so as to display an empty box
           style={{ width: '100px', height: '100px', display: 'inline' }}
      />
      <span className='absolute right-2 pointer-events-none text-red-400 font-bold'>
        X
      </span>
    </picture>
  );

  return (
    <div className={`min-w-max`}>
      {attachments}
    </div>
  )
}
