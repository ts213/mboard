import '../styles/PostForm.css';
import { Button } from '../parts/Button.jsx';
import { FormAttachments } from './FormAttachments.jsx';
import { useFetcher } from 'react-router-dom';
import { useResetFormState } from '../../hooks/useResetFormState.jsx';
import { toggleFloatingForm, dragHtmlElement, onMarkupButtonClick } from '../../utils/utils.js';
import { useFormErrors } from '../../hooks/useFormErrors.jsx';
import { useFormDispatchContext, useFormStateContext } from './PostFormReducer.jsx';
import i18n from '../../utils/translation.js';


export function PostFormsStateContainer({ toggleable = false }) {
  const fetcher = useFetcher();
  const state = useFormStateContext();
  const dispatch = useFormDispatchContext();

  useResetFormState(dispatch, fetcher);
  const [errorList, isSubmitDisabled] = useFormErrors(state.fileList, fetcher.data);

  function onFormFilesInput(e) {
    if (e.target.files.length > 4) {
      e.target.value = '';
      alert('>4');
      return;
    }
    dispatch({ type: 'fileListChange', value: Array.from(e.target.files) });
  }

  function syncFormFilesWithState(e) {
    const dt = new DataTransfer();
    for (let file of state.fileList) {
      dt.items.add(file);
    }
    e.target.image.files = dt.files;
  }

  const formProps = {
    dispatch, state, fetcher, errorList, isSubmitDisabled,
    syncFormFilesWithState, onFormFilesInput,
    i18n,
  };

  return (
    <>
      <FloatingFormWrapper i18n={i18n}>
        <PostForm {...formProps} />
      </FloatingFormWrapper>
      <ConditionalToggleableForm toggleable={toggleable} i18n={i18n}>
        <PostForm {...formProps} />
      </ConditionalToggleableForm>
    </>
  )
}

function PostForm({ dispatch, state, fetcher, errorList, isSubmitDisabled, i18n, ...props }) {
  return (
    <>
      {errorList.length > 0 &&
        errorList.map((er, idx) =>
          <output style={{ whiteSpace: 'pre-wrap' }} key={idx} className='post-form-error'>
            {er.detail}
          </output>
        )
      }

      <fetcher.Form
        onSubmit={props.syncFormFilesWithState}
        method='POST' encType='multipart/form-data'
        className='postForm'
      >

        <div className='post-form-poster-input-wrap'>
          <input name='poster'
                 value={state.posterName}
                 onChange={ev => dispatch({ type: 'posterEdited', value: ev.target.value })}
                 className='post-form-poster-input'
                 type='text' maxLength='35' placeholder='Anon'
          />
          <Button
            disabled={isSubmitDisabled || fetcher.state !== 'idle'}
            submitting={fetcher.state === 'submitting'}
            buttonType='submit'
            value={i18n.submitButton}
          />
        </div>

        <textarea value={state.postText}
                  name='text'
                  onChange={ev => dispatch({ type: 'textEdited', value: ev.target.value })}
                  required={state.fileList.length < 1}
                  rows='7' minLength='1' maxLength='10000'
                  className='post-form-textarea'
                  onKeyDown={ev => (ev.altKey && ev.key === 'Enter') && ev.target.form.requestSubmit()}
        />

        <MarkupButtons />

        <label
          className='file-input-label'>
          <div className='file-input-label-span'>
            {i18n.selectFile}
          </div>
          <input
            name='image' type='file' accept='image/*'
            multiple
            onChange={props.onFormFilesInput}
          />
        </label>

        {state.fileList.length > 0 &&
          <FormAttachments
            onClick={(idx) => dispatch({ type: 'fileListPop', value: idx })}
            fileList={state.fileList}
          />
        }
      </fetcher.Form>
    </>
  );
}

function FloatingFormWrapper({ children, i18n }) {
  return (
    <div className='floatingFormWrapper hidden'>
      <header
        onMouseDownCapture={dragHtmlElement}
      >
          <span
            onClick={() => toggleFloatingForm()}
            style={{ marginLeft: '2%', fontSize: 'larger', cursor: 'pointer' }}
          >
            ⨯
          </span>
        <span style={{ flexGrow: '1', cursor: 'move' }}>
          {i18n.replyToThread}
          <output style={{ marginLeft: '1%', color: 'cornflowerblue' }} />
          </span>
      </header>
      {children}
    </div>
  )
}

function ConditionalToggleableForm({ children, toggleable, i18n }) {
  return (
    toggleable
      ?
      <details>
        <summary>
          {i18n.newThread}
        </summary>
        {children}
      </details>

      : children
  )
}

function MarkupButtons() {
  const buttons = [
    ['s', '[S]'],
    ['i', '[I]'],
    ['b', '[B]'],
    ['spoiler', '[ ]'],
    ['arrow', '[>]'],
  ];
  return (
    <div onClick={onMarkupButtonClick} className='markup-wrap'>
      {buttons.map(([name, value], idx) =>
        <button key={idx} name={name} type='button' tabIndex='-1'>
          {value}
        </button>
      )}
    </div>
  );
}
