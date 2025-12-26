for (const { children: fs = [] } of await chrome.bookmarks.getSubTree("1")) {
  for (const { children: bs = [] } of fs) {
    const ss = new Set(
      bs.toSorted(
        (a, b) =>
          new URL(a.url).origin.localeCompare(new URL(b.url).origin) ||
          a.title.localeCompare(b.title, undefined, { numeric: true }),
      ),
    );

    const rs = new Set(
      Map.groupBy(ss, (x) => x.title.replaceAll(/\d+/g, ""))
        .values()
        .flatMap((xs) => xs.slice(0, -1)),
    );

    for (const x of ss.difference(rs)) {
      await chrome.bookmarks.move(x.id, { parentId: x.parentId });
    }

    for (const x of rs) {
      chrome.bookmarks.remove(x.id);
    }
  }
}
