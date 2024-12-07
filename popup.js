chrome.bookmarks.getSubTree("1").then(async (bookmarksBar) => {
  await Array.fromAsync(bookmarksBar, async ({ children: folders = [] }) => {
    await Array.fromAsync(folders, async ({ children: pages = [] }) => {
      const sorted = new Set(
        pages.toSorted(
          (a, b) =>
            (a.url &&
              b.url &&
              URL.canParse(a.url) &&
              URL.canParse(b.url) &&
              new URL(a.url).origin.localeCompare(new URL(b.url).origin)) ||
            a.title.localeCompare(b.title, undefined, { numeric: true }),
        ),
      );

      const removed = new Set(
        Map.groupBy(sorted, (x) => x.title.replaceAll(/\d+/g, ""))
          .values()
          .flatMap((xs) => xs.slice(0, -1)),
      );

      await Array.fromAsync(sorted.difference(removed), async (x) =>
        chrome.bookmarks.move(x.id, { parentId: x.parentId }),
      );

      await Array.fromAsync(removed, async (x) =>
        chrome.bookmarks.remove(x.id),
      );
    });
  });
});
