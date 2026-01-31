/**
 * Converts a date string (ISO or other) to a human-readable local date.
 * Example: "2025-06-15" -> "Jun 15, 2025"
 */
export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

/**
 * Generates labels for Y-axis of a chart using a generic numeric array.
 * Can be used for application trends, interview stats, etc.
 * Example: [{ label: 'Jan', value: 20 }] → ["20 Applications", "10 Applications", ...]
 */
export const generateYAxis = (
  data: { value: number }[],
  unit: string = 'Applications'
) => {
  const yAxisLabels = [];
  const highest = Math.max(...data.map((d) => d.value));
  const topLabel = Math.ceil(highest / 10) * 10;

  for (let i = topLabel; i >= 0; i -= 10) {
    yAxisLabels.push(`${i} ${unit}`);
  }

  return { yAxisLabels, topLabel };
};

/**
 * Generates pagination range for paginated lists.
 * Useful for paginating applicant data, interview records, etc.
 */
export const generatePagination = (
  currentPage: number,
  totalPages: number,
): (number | string)[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};
