# Add your studio photos here

Put your own photos into the matching folder:

```text
portfolio/
  tattoo/
  piercing/
  beauty/
    bridal/
    makeup/
    hair/
    facial/
    waxing/
    threading/
```

The portfolio and home page use these photos automatically. Empty categories
remain available, without stock photos. Do not put photos directly in this top
folder; use one of the category folders listed above.

The initial tattoo and piercing uploads have been converted to JPEGs with a
maximum longest side of 1800 pixels. Their original files and filename mappings
are preserved locally under `.portfolio-originals/tattoo/` and
`.portfolio-originals/piercing/` at the project root. That folder is ignored by
Git and is kept outside the public website. The original ZIP and video are also
preserved there; the portfolio displays the prepared photographs.

- Formats: `.jpg`, `.jpeg`, `.png`, `.webp`, or `.avif` (uppercase extensions also work).
  Convert iPhone `.heic` photos to JPEG or WebP before uploading. SVG and GIF are
  not included.
- Use clear filenames such as `rose-tattoo.jpg`, `bridal-look.jpg`, or
  `01-ear-piercing.webp`. Captions show only the service category, without numbers.
  An optional number prefix sets the order within the category. Images sort
  by filename, with numbers in natural order (`2` before `10`).
- Recommended: 1200–2400 pixels on the longest side and under 2 MB per image.
  Compress large phone photos before adding them for a faster mobile experience.
- Only regular image files directly inside each category are included. Hidden
  files, symbolic links, nested folders, and unsupported file formats are ignored.
- Publish only work you own or have permission to display, with the client's
  permission where needed. These folders are public: do not upload private images,
  customer details, or documents. Remove location metadata from photos if needed.
- Keep the empty `.gitkeep` files so folders remain visible in Git. You can leave
  them alongside your uploaded photos; they never appear in the portfolio.

After adding or removing photos, commit and push the changes to GitHub. Vercel
rebuilds the website and the new photos appear after the deployment finishes.
For a local production build, rebuild and restart the site. Restart `npm run dev`
if a newly added photo does not appear during local development.
