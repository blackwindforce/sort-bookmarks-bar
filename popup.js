const sort = (xs) =>
  xs
    .values()
    .map((x) => x.children)
    .filter(Boolean)
    .map((ys) => ys.toSorted(compare))
    .map((ys) => Array.fromAsync(ys, move))
    .forEach((x) => x.then(sort));

const compare = (a, b) => compareUrlOrigin(a, b) || compareTitle(a, b);

const compareUrlOrigin = (a, b) =>
  a.url && b.url && new URL(a.url).origin.localeCompare(new URL(b.url).origin);

const compareTitle = (a, b) =>
  a.title.localeCompare(b.title, undefined, { numeric: true });

const move = (x) => chrome.bookmarks.move(x.id, { parentId: x.parentId });

(await chrome.bookmarks.getSubTree("1"))
  .values()
  .map((x) => x.children)
  .forEach(sort);
