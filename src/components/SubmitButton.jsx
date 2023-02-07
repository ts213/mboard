export function SubmitButton({
                               submitting = false,
                               value = 'Submit',
                               clickHandler = undefined,
                               extraStyle = '',
                               buttonType = 'button',
                             }) {

  return (
    <button type={buttonType}
      disabled={submitting}
      onClick={clickHandler}
      className={`${extraStyle} px-4 py-2.5 text-sm border bg-gray-800 text-gray-400 border-gray-600 hover:text-white hover:bg-gray-700 tracking-wide`}>
      {submitting ? 'Saving...' : value}
    </button>
  )
}
