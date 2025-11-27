/**
 * The `FormatDate` function takes a date string and returns it in "dd-mm-yyyy" format.
 * @param {string} dateString - The `dateString` parameter is a string representing a date.
 * @returns The date formatted as "DD-MM-YYYY".
 */
export const FormatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Month is 0-indexed
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
}
