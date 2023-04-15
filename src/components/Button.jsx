import './styles/Button.css';

export function Button({
                         submitting = false,
                         disabled = false,
                         value = 'Submit',
                         clickHandler = undefined,
                         extraStyle = undefined,
                         extraClass = '',
                         buttonType = 'button',
                       }) {

  return (
    <button
      type={buttonType}
      style={extraStyle}
      disabled={submitting || disabled}
      onClick={clickHandler}
      className={`button ${extraClass}`}
    >
      {submitting ? 'Saving...' : value}
    </button>
  )
}
