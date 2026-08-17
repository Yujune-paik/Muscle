create extension if not exists pgcrypto;

create type public.equipment_status as enum ('unknown', 'present', 'absent');
create type public.session_status as enum ('planned', 'active', 'paused', 'completed', 'abandoned');
create type public.item_status as enum ('pending', 'active', 'completed', 'skipped');

create table public.goals (
  id text primary key,
  name_ja text not null,
  name_en text not null,
  description_ja text not null,
  description_en text not null,
  active boolean not null default true
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  locale text not null default 'ja-JP',
  unit_system text not null default 'metric' check (unit_system in ('metric', 'imperial')),
  experience_level text,
  weekly_frequency integer check (weekly_frequency in (2, 3)),
  session_duration_min integer check (session_duration_min in (30, 45, 60)),
  onboarding_completed boolean not null default false,
  current_gym_id uuid
);

create table public.user_goals (
  user_id uuid primary key references auth.users(id) on delete cascade,
  goal_id text not null references public.goals(id),
  started_at timestamptz not null default now(),
  active boolean not null default true
);

create table public.gyms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  branch_name text,
  country_code text,
  is_demo boolean not null default false,
  created_by uuid references auth.users(id) on delete set null
);
alter table public.profiles add constraint profiles_current_gym_fk foreign key (current_gym_id) references public.gyms(id) on delete set null;

create table public.equipment_types (
  id text primary key,
  name_ja text not null,
  name_en text not null,
  movement_tags text[] not null default '{}',
  thumbnail_asset text
);

create table public.user_gym_equipment (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  gym_id uuid not null references public.gyms(id) on delete cascade,
  equipment_type_id text not null references public.equipment_types(id),
  status public.equipment_status not null default 'unknown',
  last_confirmed_at timestamptz,
  notes text,
  unique (user_id, gym_id, equipment_type_id)
);

create table public.exercises (
  id text primary key,
  name_ja text not null,
  name_en text not null,
  equipment_type_id text not null references public.equipment_types(id),
  movement_pattern text not null,
  primary_muscles text[] not null,
  secondary_muscles text[] not null default '{}',
  rep_min integer not null check (rep_min > 0),
  rep_max integer not null check (rep_max >= rep_min),
  default_sets integer not null check (default_sets > 0),
  rest_seconds integer not null check (rest_seconds > 0),
  setup_cues_ja text[] not null,
  setup_cues_en text[] not null,
  active boolean not null default true,
  content_version integer not null default 1
);

create table public.exercise_media (
  exercise_id text primary key references public.exercises(id) on delete cascade,
  poster_uri text not null,
  video_mp4_uri text,
  video_webm_uri text,
  start_frame_uri text not null,
  end_frame_uri text not null,
  duration_ms integer not null,
  angle text not null,
  alt_ja text not null,
  alt_en text not null
);

create table public.exercise_substitutions (
  source_exercise_id text not null references public.exercises(id) on delete cascade,
  substitute_exercise_id text not null references public.exercises(id) on delete cascade,
  priority integer not null,
  reason_ja text not null,
  reason_en text not null,
  primary key (source_exercise_id, substitute_exercise_id)
);

create table public.program_templates (
  id text primary key,
  goal_id text not null references public.goals(id),
  frequency integer not null check (frequency in (2, 3)),
  duration_min integer not null check (duration_min in (30, 45, 60)),
  name text not null,
  version integer not null default 1,
  active boolean not null default true
);

create table public.program_slots (
  id uuid primary key default gen_random_uuid(),
  program_template_id text not null references public.program_templates(id) on delete cascade,
  day_index integer not null,
  slot_index integer not null,
  movement_pattern text not null,
  muscle_emphasis text not null,
  optional boolean not null default false,
  unique (program_template_id, day_index, slot_index)
);

create table public.user_exercise_state (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_id text not null references public.exercises(id),
  prescribed_weight numeric,
  prescribed_reps integer not null,
  prescribed_sets integer not null,
  increment numeric,
  successful_top_range_count integer not null default 0,
  last_difficulty text check (last_difficulty in ('easy', 'good', 'hard')),
  last_completed_at timestamptz,
  pain_flag boolean not null default false,
  unique (user_id, exercise_id)
);

create table public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  program_template_id text references public.program_templates(id),
  program_day_index integer not null default 0,
  status public.session_status not null default 'planned',
  started_at timestamptz,
  completed_at timestamptz,
  current_item_index integer not null default 0,
  estimated_duration_min integer not null,
  actual_duration_sec integer,
  source text not null default 'demo' check (source in ('scheduled', 'manual', 'demo'))
);

create table public.workout_items (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.workout_sessions(id) on delete cascade,
  slot_index integer not null,
  exercise_id text not null references public.exercises(id),
  original_exercise_id text references public.exercises(id),
  replacement_reason text,
  planned_weight numeric,
  planned_reps integer not null,
  planned_sets integer not null,
  status public.item_status not null default 'pending',
  difficulty text check (difficulty in ('easy', 'good', 'hard')),
  pain_reported boolean not null default false,
  unique (session_id, slot_index)
);

create table public.set_results (
  id uuid primary key default gen_random_uuid(),
  workout_item_id uuid not null references public.workout_items(id) on delete cascade,
  set_index integer not null,
  planned_weight numeric,
  actual_weight numeric,
  planned_reps integer not null,
  actual_reps integer,
  completed_at timestamptz not null default now(),
  edited boolean not null default false,
  client_event_id uuid not null unique,
  unique (workout_item_id, set_index)
);

create table public.protein_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null,
  protein_grams numeric not null check (protein_grams > 0),
  schedule_type text not null check (schedule_type in ('daily', 'training_days', 'off')),
  timing_anchor text not null check (timing_anchor in ('post_workout', 'morning', 'evening', 'fixed_time')),
  fixed_local_time time,
  active boolean not null default true
);

create table public.protein_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  protein_plan_id uuid not null references public.protein_plans(id) on delete cascade,
  local_date date not null,
  completed_at timestamptz not null default now(),
  protein_grams numeric not null,
  client_event_id uuid not null unique,
  unique (user_id, protein_plan_id, local_date)
);

create table public.body_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  measured_at timestamptz not null,
  weight_kg numeric,
  waist_cm numeric,
  chest_cm numeric,
  arm_cm numeric,
  source text not null default 'manual' check (source in ('manual', 'healthkit', 'scale'))
);

create table public.app_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  reduce_motion boolean,
  haptics_enabled boolean not null default true,
  rest_timer_sound boolean not null default false,
  notification_enabled boolean not null default false,
  analytics_consent boolean not null default false
);

create table public.sync_events (
  id bigint generated by default as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  client_event_id uuid not null unique,
  event_type text not null,
  payload jsonb not null default '{}',
  created_at timestamptz not null,
  received_at timestamptz not null default now()
);

alter table public.goals enable row level security;
alter table public.profiles enable row level security;
alter table public.user_goals enable row level security;
alter table public.gyms enable row level security;
alter table public.equipment_types enable row level security;
alter table public.user_gym_equipment enable row level security;
alter table public.exercises enable row level security;
alter table public.exercise_media enable row level security;
alter table public.exercise_substitutions enable row level security;
alter table public.program_templates enable row level security;
alter table public.program_slots enable row level security;
alter table public.user_exercise_state enable row level security;
alter table public.workout_sessions enable row level security;
alter table public.workout_items enable row level security;
alter table public.set_results enable row level security;
alter table public.protein_plans enable row level security;
alter table public.protein_logs enable row level security;
alter table public.body_metrics enable row level security;
alter table public.app_preferences enable row level security;
alter table public.sync_events enable row level security;

create policy goals_read on public.goals for select to anon, authenticated using (true);
create policy demo_gyms_read on public.gyms for select to anon, authenticated using (is_demo or created_by = auth.uid());
create policy equipment_types_read on public.equipment_types for select to anon, authenticated using (true);
create policy exercises_read on public.exercises for select to anon, authenticated using (active);
create policy exercise_media_read on public.exercise_media for select to anon, authenticated using (true);
create policy substitutions_read on public.exercise_substitutions for select to anon, authenticated using (true);
create policy templates_read on public.program_templates for select to anon, authenticated using (active);
create policy slots_read on public.program_slots for select to anon, authenticated using (true);

create policy profiles_owner on public.profiles for all to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy user_goals_owner on public.user_goals for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy user_gyms_insert on public.gyms for insert to authenticated with check (created_by = auth.uid());
create policy user_gyms_update on public.gyms for update to authenticated using (created_by = auth.uid()) with check (created_by = auth.uid());
create policy user_gyms_delete on public.gyms for delete to authenticated using (created_by = auth.uid());
create policy user_gym_equipment_owner on public.user_gym_equipment for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy user_exercise_state_owner on public.user_exercise_state for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy workout_sessions_owner on public.workout_sessions for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy workout_items_owner on public.workout_items for all to authenticated
  using (exists (select 1 from public.workout_sessions s where s.id = session_id and s.user_id = auth.uid()))
  with check (exists (select 1 from public.workout_sessions s where s.id = session_id and s.user_id = auth.uid()));
create policy set_results_owner on public.set_results for all to authenticated
  using (exists (select 1 from public.workout_items i join public.workout_sessions s on s.id = i.session_id where i.id = workout_item_id and s.user_id = auth.uid()))
  with check (exists (select 1 from public.workout_items i join public.workout_sessions s on s.id = i.session_id where i.id = workout_item_id and s.user_id = auth.uid()));
create policy protein_plans_owner on public.protein_plans for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy protein_logs_owner on public.protein_logs for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy body_metrics_owner on public.body_metrics for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy app_preferences_owner on public.app_preferences for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy sync_events_owner on public.sync_events for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from auth.users where id = auth.uid();
end;
$$;
revoke all on function public.delete_my_account() from public;
grant execute on function public.delete_my_account() to authenticated;

