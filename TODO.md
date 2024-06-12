# TODO 📦
- Track share page
    - Add right-click option to copy track url
- Check out the mobile sidebar and navbar
- Remove old settings page files
- Fix: track loading indicator in bottom bar

- Unfuck javascript controlled responsiveness

- Redesign the album page header for mobile
- Merge all cards into one generic card or something! ... for better control and updates. ie. have a layout card to controls the sections and general style. Use slots, props and emits to create child components.
- Merge sidenav dimmer and modal dimmer
- Fix: Add to favorite button on headers icon alignment
- Add trailing slash to folder url accessed from the breadcrumb
- Clip the browseable items on the homepage

# DONE ✅
- Remove welcome dialog
- Reduce folder item height
- Fix max album cards calculator
- Replace the search input X with an SVG
- Remove track item hover effect on mobile view
- Add auth info to home page greetings. eg. Good afternoon cwilvx
- Update folder page breadcrumb when response has skipped empty folders
- Rewrite context menu to only fetch server side data when you need it:
    - WHY: To remove popup delays!
    - REVIEW: Is this really what we need?
    - HOW: eg. fetch playlists when you hover/click "Add to playlist"
    - IDEA: Maybe have a store for available playlists, and fetch new items when you read the store? Or something!
- Add generic headers to favorite subpages
- Fix: Edit playlist button hiding on playlist update
- Merge "Save as playlist" with "Add to playlist > New Playlist"
- Fix: Tracklist item index slightly shifts up and down on hover/unhover
- Settings dialog responsiveness
- Fix: Breadcrumb align center (shifts when the the position of the highlighted folder is auto-scrolled to)
- Fix: Audio not being muted (when audio is muted by user) on queue repeat
- hide "remove from playlist" option on system playlists
- ADD QR CODE SOMEWHERE ON THE WEB
- Add a "Rescan folders" item to the "Browse Library" section