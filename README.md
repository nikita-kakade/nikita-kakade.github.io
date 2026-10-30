# nikita-kakade.github.io

**Live site: [nikita-kakade.github.io](https://nikita-kakade.github.io/)**

Personal portfolio of **Nikita Kakade**, a student engineer at Dayton Regional STEM School in Dayton, Ohio.
It is a single, static page with a warm editorial look a soft serif (Fraunces) with DM Sans and DM Mono, round award "stamps", and one small gallery of photos and videos.

It is plain HTML, CSS and a little vanilla JavaScript. There is no build step, framework or tracking.
GitHub Pages serves it straight from the repository root.

## Preview locally

```sh
python3 -m http.server 8001
```

Then open `http://127.0.0.1:8001/` in your browser. That address only works on your own computer while the command above is running;
the public site is always at https://nikita-kakade.github.io/.

## Where to edit

| What | File |
| --- | --- |
| All text, links, awards, skills and projects | `index.html` (each section is marked with a `<!-- ==== N · NAME ==== -->` comment) |
| Colors, type and layout | `styles.css` (the palette and theme tokens are at the top, in `:root` and the `.surface--*` rules) |
| Mobile menu, gallery lightbox, scroll reveals, print helper | `script.js` |
| Photos and video posters | `assets/gallery/` (each photo has a small `-thumb.jpg` for the grid and a full-size file for the lightbox) |
| Videos | `assets/video/` |
| Search engines | `sitemap.xml`, `robots.txt` |

The page runs top to bottom (Nikita picked the "quiet editorial" draft as the base):
Hero ("Hard math, helpful machines." with the 2× Superior stamp) · Selected work — projects 01–03 as the three
full-width colour bands from the "colour-block" draft (classes prefixed `cb-`), then 04 Robotics & leadership ·
More work (a two-column index, with a small chart on the AI survey) · Gallery (the three science-fair videos first) ·
Awards (with small stamps) · Skills.

Notes for editing:

- **More work:** keep the index newest → oldest, and put the date in each item's mono tag (leave it out when the date isn't known).
- **Project bands (01–03):** each band's colours come from its `.cb-band--*` class; its round stamp is the inline SVG in
  `.cb-project-stamp` (edit the ring text inside `<textPath>`).
- **Gallery:** each tile in `#gallery` is a plain link to the full image, the `.mp4`, or the YouTube page, so it works without JavaScript.
  `script.js` opens it in the `<dialog>` lightbox instead. The tile's `data-type` is `image`, `video` or `youtube`.
  Images also take `data-w` / `data-h` (the full file's size), videos take `data-poster`, YouTube tiles take `data-yt` (the video id),
  and any tile can take a `data-desc` line for the lightbox. The caption under the tile (`.g-title` and `.g-meta`) is reused in the lightbox.
  Any other link can open a tile with `data-gallery-open="<tile id>"` (e.g. the "Watch the tour" link in More work).
  YouTube videos use color-block tiles on purpose (no YouTube thumbnails, so there are no external requests until someone presses play),
  and play through `youtube-nocookie.com`.
- **Videos** in `assets/video/` are compressed H.264 MP4s, 1280 px wide, so they stay small enough for GitHub Pages.
  The full-quality originals live in `resume26/context`. No `<video>` element exists until a tile is opened, so nothing downloads
  until someone presses play, and closing the lightbox pauses and unloads the video.
- **The page works without JavaScript.** The script only adds enhancements. Keep new content visible by default.
  Hide things only behind classes that `script.js` adds (`.js-nav`, `.js-reveal`), or ship an element with the `hidden`
  attribute and let `script.js` remove it (the menu button works this way).
- **Accessibility:** keep every text color on the theme tokens (`--fg`, `--muted`), because they are checked for WCAG AA contrast on each surface.
  Give new images `width`, `height` and `alt`, and add `loading="lazy"` to any image below the hero.

## To confirm with Nikita

These were left off the site on purpose, or written carefully, until they are confirmed:

- [ ] **Graduation year / current grade.** No class year appears anywhere on the site yet.
- [ ] **Email address.** No contact email is published yet. Add one where the HTML says `<!-- add email here -->` (in the footer).
- [ ] **Maximum Potential.** The official name of the leadership credential (Maximum Potential's high-school program is called
      "Student Leadership Excellence"), and the year, if you want one shown. The site says "Maximum Potential leadership certification".
- [ ] **History game.** The resume says "Unity History Simulation (C#), 2023", but the tour video shows Unreal Engine and was exported
      in May 2026, so the site says "Cold War Museum — Unreal Engine — May 2026". Change it if that's wrong.
- [ ] **Pencil Pouch Pals.** Permission from the co-author before the storybook PDF is posted. For now the site only describes it.
- [ ] **IEEE and ASME.** Shown as won at the Dayton Regional STEM School Science Fair (2026) for the wheelchair attachment.
- [ ] **B-WISER.** Shown as "Roller Coaster: 2nd Place" with "Speed Champion" and the $100 camp scholarship as the note.
- [ ] **Skills.** "Astropy" and "YOLO11" were added as Nikita asked; adjust if a different name was meant.
- [ ] Wording to double-check: the FRC team name and number ("Team 10011, Gridrunners").

Synced from the resume on Oct 22, 2026: FRC team captain (2 seasons); IEEE Award at the regional fair for WeatherWear;
ASME 1st Place and 2nd Place Overall at the regional fair for the wheelchair attachment; 2026 Superior ratings at the school fair,
regional fair, State Science Day, BSEF and Ohio STEP; B-WISER Roller Coaster Speed Champion with a $100 camp scholarship.

From Nikita on Oct 30, 2026: two Governor's Thomas Edison Awards (1st place 2026 and 3rd place 2025, same category and grade band);
B-WISER, the school fair and ASME were all 2026; she never did REV Robotics, so that build and its photo were removed.

Also Oct 30: FRC team captain for one season; the B-WISER roller-coaster photo, the Roman Tribune comic and the doorknob sketch
were removed (the photo didn't match that project); the About section was removed; 30 wheelchair users tested Self-Drive and Thrive.
