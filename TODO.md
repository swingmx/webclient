# TODO 📦
- Track share page
    - Add right-click option to copy track url
- Check out the mobile sidebar and navbar
- Remove old settings page files
- Fix: Breadcrumb align center (shifts when the the position of the highlighted folder is auto-scrolled to)
- Fix: Tracklist item index slightly shifts up and down on hover/unhover
- Fix: track loading indicator in bottom bar
- Fix: Edit playlist button hiding on playlist update
- Merge "Save as playlist" with "Add to playlist > New Playlist"

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