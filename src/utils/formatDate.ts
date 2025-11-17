/**
 * The `FormatDate` function takes a date in "yyyy-mm-dd" format and returns it in "dd-mm-yyyy" format.
 * @param {string} dateBD - The `dateBD` parameter is a string representing a date in the format "YYYY-MM-DD".
 * @returns The `FormatDate` function takes a date string in the format "YYYY-MM-DD" and returns the date formatted as "DD-MM-YYYY".
 */
export const FormatDate = (dateBD: string): string => {
  const [year, month, day] = dateBD.split('-')
  return `${day}-${month}-${year}`
}
