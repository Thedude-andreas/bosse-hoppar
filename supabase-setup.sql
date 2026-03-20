create table if not exists public.highscores (
  id bigint generated always as identity primary key,
  game text not null check (game in ('runner', 'maze', 'hockey')),
  name text not null check (char_length(trim(name)) between 1 and 20),
  score integer not null check (score >= 0),
  created_at timestamptz not null default now()
);

create index if not exists highscores_game_score_idx
  on public.highscores (game, score desc, created_at asc);

alter table public.highscores enable row level security;

drop policy if exists "Public can read highscores" on public.highscores;
create policy "Public can read highscores"
on public.highscores
for select
to anon, authenticated
using (true);

drop policy if exists "Public can insert highscores" on public.highscores;
create policy "Public can insert highscores"
on public.highscores
for insert
to anon, authenticated
with check (
  game in ('runner', 'maze', 'hockey')
  and char_length(trim(name)) between 1 and 20
  and score >= 0
);
