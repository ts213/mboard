export function SubmitButton({
                               submitting = false,
                               value = 'Submit',
                               clickHandler = undefined,
                               extraStyle = '',
                               buttonType = 'button',
                               fileError = false,
                             }) {

  return (
    <button type={buttonType}
      disabled={submitting || fileError}
      onClick={clickHandler}
      className={`${extraStyle} ${fileError ? 'opacity-50 cursor-not-allowed' : 'hover:text-white hover:bg-gray-700 '} px-4 py-2.5 text-sm border bg-gray-800 text-gray-400 border-gray-600 tracking-wide`}
    >
      {submitting ? 'Saving...' : value}
    </button>
  )
}
