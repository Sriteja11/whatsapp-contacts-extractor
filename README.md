# WhatsApp Contacts Extractor

Extract WhatsApp group member names and phone numbers directly from WhatsApp Web and export them as CSV files.

Supports:

* Small groups (right sidebar)
* Large groups with modal popup (`Search members`)
* Auto scrolling
* CSV download
* Virtualized/lazy-loaded member lists

---

# How It Works

WhatsApp Web renders group members in 2 different ways:

| Group Size   | UI Type             | Script                     |
| ------------ | ------------------- | -------------------------- |
| Small groups | Right sidebar       | `extract-from-side-bar.js` |
| Large groups | Members modal popup | `main.js`                  |

---

# Requirements

* Google Chrome / Chromium browser
* WhatsApp Web
* Browser DevTools Console

---

# Usage

## 1. Open WhatsApp Web

Go to:

```text
https://web.whatsapp.com
```

Login if required.

---

# Small Groups (Right Sidebar)

Use this when all members are visible directly in the right-side group info panel.

## Steps

1. Open the WhatsApp group
2. Click the group name
3. Open Chrome DevTools:

   * Windows/Linux:

     ```text
     Ctrl + Shift + J
     ```
   * Mac:

     ```text
     Cmd + Option + J
     ```
4. Open `extract-from-side-bar.js`
5. Copy the entire script
6. Paste into the Console
7. Press Enter

The script will:

* Scroll the sidebar
* Extract names/numbers
* Copy CSV data

---

# Large Groups (Search Members Modal)

Use this when WhatsApp opens a popup/modal with:

```text
Search members
```

This is required for large groups because WhatsApp virtualizes the DOM and only renders visible rows.

## Steps

1. Open the WhatsApp group
2. Click group name
3. Click:

   ```text
   See all
   ```

   or open the members popup
4. Ensure the popup containing:

   ```text
   Search members
   ```

   is visible
5. Open Chrome DevTools Console
6. Open `main.js`
7. Copy the entire script
8. Paste into Console
9. Press Enter

The script will:

* Detect the members modal
* Continuously scrape while scrolling
* Handle virtualized lists
* Extract all visible members
* Download CSV automatically

---

# IMPORTANT — "allow pasting"

The first time you paste code into Chrome DevTools Console, Chrome may block pasting and show:

```text
Warning: Don't paste code into the DevTools Console...
```

Type this exactly:

```text
allow pasting
```

Then press Enter.

After that, paste the script again.

---

# Output

The script exports:

```text
Name,Phone
John Doe,919876543210
Jane Doe,918888888888
```

CSV file downloads automatically.

---

# Notes

* Saved contacts may not expose phone numbers
* Unsaved contacts usually expose numbers
* WhatsApp changes DOM structure frequently
* Scripts may require updates in the future

---

# Files

| File                       | Purpose                              |
| -------------------------- | ------------------------------------ |
| `extract-from-side-bar.js` | Extract from small-group sidebar     |
| `main.js`                  | Extract from large-group modal popup |

---

# Disclaimer

Use responsibly.

This project is intended for personal/export purposes only.

Do not use for spam, scraping abuse, or violating WhatsApp Terms of Service.
