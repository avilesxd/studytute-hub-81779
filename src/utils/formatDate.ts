export const FormatDate = (dateBD: string): string => {
  const [year, month, day] = dateBD.split("-");
  return `${day}-${month}-${year}`;
};
