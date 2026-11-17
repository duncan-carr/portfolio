/** @template {{ hideFromMain?: boolean }} T
 * @param {T[]} positions Positions in display order.
 */
export function groupExperience(positions) {
  const featured = positions
    .filter((position) => position.hideFromMain !== true)
    .slice(0, 3);
  const featuredPositions = new Set(featured);
  const other = positions.filter((position) => !featuredPositions.has(position));
  return { featured, other };
}
