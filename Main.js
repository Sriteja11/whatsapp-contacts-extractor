(async () => {

  const sleep = ms =>
    new Promise(r => setTimeout(r, ms));

  // MODAL
  const modal = document.querySelector(
    '[data-testid="contacts-modal"]'
  );

  if (!modal) {
    console.error(
      'Contacts modal not found'
    );
    return;
  }

  console.log('Contacts modal found');

  // FIND SCROLLABLE CONTAINER
  const scrollContainer =
    [...modal.querySelectorAll('div')]
      .find(el =>
        el.scrollHeight >
        el.clientHeight + 500
      );

  if (!scrollContainer) {
    console.error(
      'Scrollable container not found'
    );
    return;
  }

  console.log(
    'Scrollable container found'
  );

  // STORAGE
  const members = new Map();

  // EXTRACTION FUNCTION
  const extractVisibleMembers = () => {

    const items =
      modal.querySelectorAll(
        'div[role="listitem"]'
      );

    items.forEach(item => {

      // IGNORE HEADERS
      if (
        item.querySelector(
          '[data-testid="section-header"]'
        )
      ) {
        return;
      }

      // NAME
      let name = '';

      const nameEl =
        item.querySelector(
          'span[title]'
        );

      if (nameEl) {
        name =
          nameEl
            .getAttribute('title')
            ?.trim() || '';
      }

      if (!name) return;

      // PHONE
      let phone = '';

      // Dedicated phone column
      const phoneEl =
        item.querySelector(
          '[aria-colindex="1"] span[dir="auto"]'
        );

      if (phoneEl) {
        phone =
          phoneEl.innerText
            .replace(/\D/g, '');
      }

      // Fallback:
      // sometimes number is name
      if (!phone) {

        const match =
          name.match(
            /\+?\d[\d\s]{7,}/
          );

        if (match) {
          phone =
            match[0]
              .replace(/\D/g, '');
        }
      }

      // SAVE
      const key =
        phone || name;

      if (!members.has(key)) {

        members.set(key, {
          name,
          phone
        });

        console.log(
          'Added:',
          name,
          phone
        );
      }

    });

  };

  // INITIAL EXTRACTION
  extractVisibleMembers();

  // SCROLL LOOP
  let lastScrollTop = -1;
  let stableCount = 0;

  while (stableCount < 8) {

    scrollContainer.scrollTop += 1200;

    await sleep(1200);

    extractVisibleMembers();

    const currentScrollTop =
      scrollContainer.scrollTop;

    console.log(
      'ScrollTop:',
      currentScrollTop,
      'Members:',
      members.size
    );

    if (
      currentScrollTop ===
      lastScrollTop
    ) {
      stableCount++;
    } else {
      stableCount = 0;
    }

    lastScrollTop =
      currentScrollTop;
  }

  // FINAL ARRAY
  const finalMembers =
    [...members.values()];

  console.table(finalMembers);

  // CSV
  const csv = [
    'Name,Phone',
    ...finalMembers.map(
      m =>
        `"${m.name}","${m.phone}"`
    )
  ].join('\n');

  // DOWNLOAD
  const blob = new Blob(
    [csv],
    {
      type:
        'text/csv;charset=utf-8;'
    }
  );

  const url =
    URL.createObjectURL(blob);

  const a =
    document.createElement('a');

  a.href = url;

  a.download =
    `whatsapp_group_${Date.now()}.csv`;

  document.body.appendChild(a);

  a.click();

  document.body.removeChild(a);

  URL.revokeObjectURL(url);

  console.log(
    `DONE. Extracted ${finalMembers.length} members`
  );

  return finalMembers;

})();
