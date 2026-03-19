# Majkens spelhåla

`Majkens spelhåla` is a browser game collection with two separate games:

- `Bosse Hoppar`: an endless runner where Bosse jumps over plush elephants, pets Sigge, and collects carrots.
- `Bosse Vimsar`: a scrolling maze game where Bosse gathers carrots and avoids wandering elephants.

The project also includes:

- separate top-10 leaderboards for each game
- optional Supabase-backed shared highscores
- cheat codes for runner variants and events
- mobile landscape fullscreen play, tap-to-jump, and joystick control in the maze

## Controls

- Desktop `Bosse Hoppar`: `Space`, `ArrowUp`, click, or tap
- Desktop `Bosse Vimsar`: arrow keys or `WASD`
- Mobile `Bosse Hoppar`: tap the game area in landscape
- Mobile `Bosse Vimsar`: right-thumb joystick in landscape
- Cheat dialog: press `C` on desktop or double-tap the score card on mobile

## Run locally

This project is plain HTML, CSS, and JavaScript.

Open `index.html` directly in a browser, or serve the directory with a simple static server.

## Supabase

To enable shared leaderboards:

1. Run `supabase-setup.sql` in your Supabase project.
2. Fill in `supabase-config.js`.
3. Publish the config file together with the app.

If Supabase is not configured, the game falls back to local browser storage for highscores.

## Files

- `index.html` - app structure, overlays, and script/style loading
- `style.css` - visual design, mobile layout, and control presentation
- `script.js` - game logic, rendering, controls, cheats, leaderboards, and Supabase integration
- `supabase-config.js` - local Supabase project settings
- `supabase-setup.sql` - database schema and policies for highscores
