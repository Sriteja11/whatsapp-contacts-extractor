(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  const container = document.querySelector(
    'div[aria-label*="Members list"]'
  );

  if (!container) {
    console.error('Members list not found');
    return;
  }

  // Auto-scroll to load all members
  let lastHeight = -1;

  while (true) {
    container.scrollTop = container.scrollHeight;

    await sleep(1500);

    if (container.scrollHeight === lastHeight) {
      break;
    }

    lastHeight = container.scrollHeight;
  }

  const members = [];
  const seen = new Set();

  const items = document.querySelectorAll(
    'div[role="listitem"]'
  );

  items.forEach((item, index) => {

    // MAIN NAME EXTRACTION
    let name = '';

    const titleSpan = item.querySelector('span[title]');

    if (titleSpan) {
      name = titleSpan.getAttribute('title')?.trim() || '';
    }

    // FALLBACK NAME
    if (!name) {
      const selectable = item.querySelector(
        '[data-testid="selectable-text"]'
      );

      if (selectable) {
        name = selectable.innerText.trim();
      }
    }

    // FULL TEXT
    const text = item.innerText || '';

    // PHONE EXTRACTION
    let phone = '';

    const phonePatterns = [
      /\+\d[\d\s\-()]{7,}\d/g,
      /\d{10,15}/g
    ];

    for (const pattern of phonePatterns) {
      const match = text.match(pattern);

      if (match?.length) {
        phone = match[0].replace(/\D/g, '');
        break;
      }
    }

    // Skip junk rows
    if (
      !name ||
      name === 'Add member' ||
      name === 'Search'
    ) {
      return;
    }

    const key = `${name}-${phone}`;

    if (!seen.has(key)) {
      seen.add(key);

      members.push({
        index,
        name,
        phone,
        rawText: text
      });
    }
  });

  console.table(members);

  // CSV
  const csv = [
    'Name,Phone',
    ...members.map(m =>
      `"${m.name}","${m.phone}"`
    )
  ].join('\n');

  console.log(csv);

  copy(csv);

  console.log(
    `Done. Extracted ${members.length} members. CSV copied.`
  );

  return members;
})();
