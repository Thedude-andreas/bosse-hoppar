# Majkens spelhala

`Majkens spelhala` ar en samling browserbaserade Bosse-spel i ren HTML, CSS och JavaScript.

## Spel

- `Bosse Hoppar` ar en endless runner dar Bosse hoppar over elefanter, klappar Sigge och samlar morotter.
- `Bosse Vimsar` ar ett labyrintspel med tio banor dar Bosse samlar morotter och undviker elefanter.
- `Bosse pa is` ar ett hockeyspel i lodvy dar spelaren laddar skott och forsoker overlista malvakten.
- `Bosse klattrar` ar ett plattformsspel med tio berg dar Bosse hoppar mellan hyllor, samlar morotter och tar sig upp till flaggan.

Projektet innehaller ocksa:

- separata topplistor per spel
- fallback till lokal lagring om Supabase inte ar konfigurerat
- mobilanpassade kontroller for varje spellage
- cheatkoder for utvalda varianter i `Bosse Hoppar`

## Kontroller

- Desktop `Bosse Hoppar`: `Space`, `ArrowUp`, klick eller tryck
- Desktop `Bosse Vimsar`: piltangenter eller `WASD`
- Desktop `Bosse pa is`: mus eller touch for att sikta och ladda skott
- Desktop `Bosse klattrar`: `ArrowLeft` och `ArrowRight` eller `A` och `D` for sidled, `Space`, `W` eller `ArrowUp` for hopp och hopboost
- Mobil `Bosse Hoppar`: tryck pa spelplanen
- Mobil `Bosse Vimsar`: joystick med hoger tumme
- Mobil `Bosse pa is`: dra pa spelplanen for att ladda och sikta skott
- Mobil `Bosse klattrar`: vanster skarmhalva for hopp och dubbeltryck for boost, hoger tumme dras i sidled for rorelse
- Cheatdialog: tryck `C` pa desktop eller dubbeltryck poangkortet pa mobil

## Kora lokalt

Oppna `index.html` direkt i en webblasare eller servera katalogen med en enkel statisk server.

## Topplista och Supabase

For delade topplistor:

1. Kor `supabase-setup.sql` i ditt Supabase-projekt.
2. Fyll i `supabase-config.js` eller utga fran `supabase-config.example.js`.
3. Publicera `supabase-config.js` tillsammans med appen.

Om Supabase saknas anvands lokal lagring i webblasaren.

## Deploy

`deploy.sh` publicerar appen till `bosse-hoppar` pa fjarrservern med miljo variabler fran den lokala `.env`-filen som scriptet refererar till.

Publik deploy omfattar:

- `index.html`
- `style.css`
- `script.js`
- `supabase-config.js`
- `assets/`

## Projektfiler

- `index.html` - appstruktur, overlays och script/style-laddning
- `style.css` - layout, mobilanpassning och visuellt tema
- `script.js` - spellogik, rendering, input, topplistor och Supabase-integration
- `assets/crocodile-photo-sprite.png` - runtime-sprite for krokodil-cheaten i runner-laget
- `deploy.sh` - publiceringsscript for produktionsmiljon
- `supabase-config.example.js` - mall for lokal Supabase-konfiguration
- `supabase-config.js` - faktisk Supabase-konfiguration for lokal eller publicerad miljo
- `supabase-setup.sql` - databasstruktur och policyer for topplistor
