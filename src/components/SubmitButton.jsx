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
      className={`${extraStyle}py-2.5 px-5 text-sm border hover:bg-gray-100 focus:ring-4 bg-gray-800 text-gray-400 border-gray-600 hover:text-white hover:bg-gray-700`}>
      {submitting ? 'Saving...' : value}
    </button>
  )
}
