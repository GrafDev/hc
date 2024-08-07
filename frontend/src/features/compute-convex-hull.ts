function computeConvexHull(points: {x: number, y: number}[]): {x: number, y: number}[] {
  if (points.length < 3) return points;

  function orientation(p: {x: number, y: number}, q: {x: number, y: number}, r: {x: number, y: number}) {
    let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    if (val == 0) return 0;
    return (val > 0) ? 1 : 2;
  }

  let n = points.length;
  let hull: {x: number, y: number}[] = [];

  let l = 0;
  for (let i = 1; i < n; i++)
    if (points[i].x < points[l].x)
      l = i;

  let p = l, q;
  do {
    hull.push(points[p]);
    q = (p + 1) % n;
    for (let i = 0; i < n; i++) {
      if (orientation(points[p], points[i], points[q]) == 2)
        q = i;
    }
    p = q;
  } while (p != l);

  return hull;
}

export default computeConvexHull;