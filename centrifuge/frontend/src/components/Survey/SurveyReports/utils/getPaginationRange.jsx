export function getPaginationRange({
  totalPages,
  currentPage,
  siblingCount = 2,
  boundaryCount = 2,
}) {
  if (totalPages <= 0) return [];
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const startPages = Array.from({ length: Math.min(boundaryCount, totalPages) }, (_, i) => i + 1);
  const endPages = Array.from(
    { length: Math.min(boundaryCount, totalPages) },
    (_, i) => totalPages - (boundaryCount - 1) + i
  );

  const left = clamp(currentPage - siblingCount, 1, totalPages);
  const right = clamp(currentPage + siblingCount, 1, totalPages);
  const middleStart = Math.max(left, boundaryCount + 1);
  const middleEnd = Math.min(right, totalPages - boundaryCount);

  const middle = middleEnd >= middleStart
    ? Array.from({ length: middleEnd - middleStart + 1 }, (_, i) => middleStart + i)
    : [];

  const range = [];
  range.push(...startPages);

  if (middle.length && middle[0] > startPages[startPages.length - 1] + 1) {
    range.push('…');
  }

  range.push(...middle);

  if (middle.length && endPages[0] > range[range.length - 1] + 1) {
    range.push('…');
  }

  for (const p of endPages) {
    if (!range.includes(p)) range.push(p);
  }

  return range;
}