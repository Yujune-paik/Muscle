insert into public.goals (id, name_ja, name_en, description_ja, description_en)
values ('lean_athletic', 'Lean Athletic', 'Lean Athletic', '肩・胸・背中を育てた、引き締まった全身体型', 'A lean full-body shape with developed shoulders, chest, and back')
on conflict (id) do nothing;

insert into public.gyms (id, name, branch_name, country_code, is_demo)
values ('00000000-0000-0000-0000-000000000001', 'Demo Gym', null, 'JP', true)
on conflict (id) do nothing;

insert into public.equipment_types (id, name_ja, name_en, movement_tags) values
('chest_press_machine', 'チェストプレス', 'Chest press machine', array['horizontal_push']),
('lat_pulldown_machine', 'ラットプルダウン', 'Lat pulldown', array['vertical_pull']),
('leg_press_machine', 'レッグプレス', 'Leg press', array['knee_dominant']),
('seated_row_machine', 'シーテッドロー', 'Seated row', array['horizontal_pull']),
('lateral_raise_machine', 'ラテラルレイズ', 'Lateral raise machine', array['shoulder_isolation']),
('cable_station', 'ケーブル', 'Cable station', array['vertical_pull','horizontal_pull','shoulder_isolation']),
('dumbbells', 'ダンベル', 'Dumbbells', array['horizontal_push','horizontal_pull','shoulder_isolation']),
('dumbbells_bench', 'ダンベルとベンチ', 'Dumbbells and bench', array['horizontal_push','horizontal_pull']),
('bodyweight', '器具なし', 'Bodyweight', array['horizontal_push','knee_dominant'])
on conflict (id) do nothing;

insert into public.program_templates (id, goal_id, frequency, duration_min, name, version) values
('lean_athletic_3_45', 'lean_athletic', 3, 45, 'Full Body A/B/C', 1),
('lean_athletic_2_45', 'lean_athletic', 2, 45, 'Full Body A/B', 1)
on conflict (id) do nothing;

