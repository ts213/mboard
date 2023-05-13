import { Button } from './Button.jsx';
import { useFetcher } from 'react-router-dom';
import { usePostPermissions } from '../../hooks/usePostPermissions.jsx';
import { toggleFloatingForm } from '../../utils/utils.js';

export function PostDropdown({ post, onEditMenuClick, dispatch }) {
  const fetcher = useFetcher();

  const [canEdit, canDelete, canBan] = usePostPermissions(post);

  return (
    <div className='dropdown-menu'>
      <Button
        value={'Reply'}
        clickHandler={() => toggleFloatingForm({ force: false, post, dispatch })}
      />

      {canEdit &&
        <Button
          clickHandler={() => onEditMenuClick(post.id)}
          value='Edit'
          extraStyle={{ display: 'block' }}
        />
      }

      {canDelete &&
        <>
          <Button
            clickHandler={deletePost}
            value={'Delete'}
            submitting={fetcher.data}
            extraStyle={{ display: 'block' }}
            extraClass='del-btn'
          />
          {canBan &&
            <Button extraStyle={{ transform: 'translate(100%, -100%)', display: 'none' }}
                    extraClass='ban-btn'
                    value='& Ban'
                    clickHandler={(ev) => deletePost(ev, { promtForBan: true })}
            />
          }
        </>
      }
    </div>
  );

  function deletePost(ev, options = undefined) {
    let url = `/post/${post.id}/`;

    if (canBan) {
      const toggled = toggleBanButtonOnFirstClick(ev);
      if (toggled) return;

      if (options?.promtForBan) {
        const duration = promptForBanDuration();
        if (duration) {
          url += `?ban=${duration}`;
        } else {
          return;
        }
      }
    }

    fetcher.submit(
      null,
      { method: 'delete', action: url }
    );
  }
}

function promptForBanDuration() {
  const duration = Number(window.prompt('Ban for (days; 1-30)', '1'));
  if (duration === 0) {
    return;
  }

  if (Number.isNaN(Number(duration)) || Number(duration) > 30) {
    return promptForBanDuration();
  }

  return duration;
}

function toggleBanButtonOnFirstClick(ev) {
  ev.preventDefault();
  const banBtn = document.querySelector('.ban-btn');
  if (banBtn.style.display === 'none') {
    banBtn.style.display = 'block';
    return true;
  }
}
