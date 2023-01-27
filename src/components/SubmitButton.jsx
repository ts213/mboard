export function SubmitButton({
                               submitting = false,
                               value = 'Submit',
                               clickHandler = undefined,
                               extraStyle = '',
                             }) {

  return (
    <button type='submit'
            disabled={submitting}
            onClick={clickHandler}
            className={`${extraStyle}py-2.5 px-5 text-sm text-gray-900 border hover:bg-gray-100 focus:ring-4 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700`}>
      {submitting ? 'Saving...' : value}
    </button>
  )
}
