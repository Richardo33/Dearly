delete from public.media_assets;
delete from public.little_things;
delete from public.timeline_events;
delete from public.wishlist_items;
delete from public.favorite_items;
delete from public.diary_entries;
delete from public.people;

insert into public.people (
  id,
  name,
  nickname,
  relationship,
  status,
  birthday,
  location,
  description,
  photo_url,
  tags
)
values
(
  '11111111-1111-4111-8111-111111111111',
  'Nadya Saputri',
  'Nadya',
  'Partner',
  'Active',
  '12 May 2002',
  'Bandung, Indonesia',
  'Soft spoken, suka cerita random, dan punya selera humor yang sama.',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
  array['Sweet', 'Kind', 'Funny', 'Thoughtful']
),
(
  '22222222-2222-4222-8222-222222222222',
  'Alya Putri',
  'Alya',
  'Crush',
  'Active',
  '6 Aug 2003',
  'Jakarta, Indonesia',
  'Suka journaling dan all about self improvement.',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',
  array['Green', 'Soft', 'Journal']
),
(
  '33333333-3333-4333-8333-333333333333',
  'Sarah',
  'Sarah',
  'Friend',
  'Active',
  '17 Jun 2003',
  'Surabaya, Indonesia',
  'Teman lama yang paling jago ngasih reality check.',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
  array['Honest', 'Warm']
),
(
  '44444444-4444-4444-8444-444444444444',
  'Raka Mahendra',
  'Raka',
  'Friend',
  'Active',
  '7 Aug 1999',
  'Bogor, Indonesia',
  'Suka olahraga, podcast, dan kopi hitam.',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
  array['Blue', 'Coffee']
),
(
  '55555555-5555-4555-8555-555555555555',
  'Dinda Anjani',
  'Dinda',
  'Ex',
  'Archived',
  '28 Sep 1998',
  'Indonesia',
  'Suka drama Korea, makanan pedas, dan jalan sore.',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
  array['Purple', 'K-Drama']
);

insert into public.favorite_items (person_id, category, label, value)
values
('11111111-1111-4111-8111-111111111111', 'Songs', 'Oceans & Engines', 'NIKI'),
('11111111-1111-4111-8111-111111111111', 'Songs', 'Sparks', 'Coldplay'),
('11111111-1111-4111-8111-111111111111', 'Food', 'Dimsum', 'Mentai dimsum'),
('11111111-1111-4111-8111-111111111111', 'Drink', 'Matcha Latte', 'Less ice'),
('11111111-1111-4111-8111-111111111111', 'Bands', 'Arctic Monkeys', 'AM era'),
('11111111-1111-4111-8111-111111111111', 'Flowers', 'Baby breath', 'White'),
('22222222-2222-4222-8222-222222222222', 'Books', 'Atomic Habits', 'James Clear'),
('22222222-2222-4222-8222-222222222222', 'Drink', 'Iced tea', 'Less sugar'),
('33333333-3333-4333-8333-333333333333', 'Color', 'Pink', 'Soft pink'),
('44444444-4444-4444-8444-444444444444', 'Drink', 'Coffee', 'Americano'),
('55555555-5555-4555-8555-555555555555', 'Food', 'Seblak', 'Extra spicy');

insert into public.wishlist_items (
  id,
  person_id,
  title,
  category,
  priority,
  status
)
values
('aaaaaaaa-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111', 'Bali Elinda', 'Short-term', 'Medium', 'Planned'),
('aaaaaaaa-0000-4000-8000-000000000002', '11111111-1111-4111-8111-111111111111', 'Nonton konser NIKI', 'Short-term', 'High', 'Planned'),
('aaaaaaaa-0000-4000-8000-000000000003', '11111111-1111-4111-8111-111111111111', 'Pergi ke cafe baru di Bandung', 'Short-term', 'Low', 'Planned'),
('aaaaaaaa-0000-4000-8000-000000000004', '11111111-1111-4111-8111-111111111111', 'Trip ke tempat dingin', 'Long-term', 'High', 'Planned');

insert into public.diary_entries (
  id,
  person_id,
  date,
  title,
  content,
  mood,
  tags,
  is_public,
  image_url
)
values
(
  'bbbbbbbb-0000-4000-8000-000000000001',
  '11111111-1111-4111-8111-111111111111',
  '2024-03-12',
  'Hujan pertama bersama',
  'Hari ini kita kehujanan pas pulang dari kafe. Dia gak bawa payung, jadi kita berteduh di halte bus sambil ngobrol hal random.',
  'Happy',
  array['Rain', 'Bandung'],
  true,
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80'
),
(
  'bbbbbbbb-0000-4000-8000-000000000002',
  '11111111-1111-4111-8111-111111111111',
  '2024-04-30',
  'Nonton bareng',
  'Nonton film di rumah dia. Banyak ketawa dan ngobrol sampai lupa waktu.',
  'Excited',
  array['Movie'],
  true,
  'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=900&q=80'
),
(
  'bbbbbbbb-0000-4000-8000-000000000003',
  '11111111-1111-4111-8111-111111111111',
  '2024-07-23',
  'Beli matcha bareng',
  'Dia rekomendasi matcha enak banget di satu coffee shop kecil.',
  'Happy',
  array['Matcha'],
  true,
  'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=900&q=80'
),
(
  'bbbbbbbb-0000-4000-8000-000000000004',
  '55555555-5555-4555-8555-555555555555',
  '2026-06-08',
  'Sore yang panjang',
  'Jalan sore sambil bahas drama yang ending-nya masih bikin kesel.',
  'Calm',
  array['Walk'],
  false,
  null
);

insert into public.timeline_events (
  person_id,
  date,
  title,
  description
)
values
('11111111-1111-4111-8111-111111111111', '2024-03-12', 'First Chat', 'Mulai ngobrol di Instagram.'),
('11111111-1111-4111-8111-111111111111', '2024-03-18', 'First Call', 'Telepon pertama kali sampai 1 jam.'),
('11111111-1111-4111-8111-111111111111', '2024-04-20', 'First Date', 'Ketemu pertama di Braga.'),
('11111111-1111-4111-8111-111111111111', '2024-06-10', 'First Gift', 'Dia kasih gantungan kunci lucu.'),
('11111111-1111-4111-8111-111111111111', '2025-03-12', 'First Anniversary', 'Setahun kenal dan tetap saling ingat.');

insert into public.little_things (
  person_id,
  text,
  category
)
values
('11111111-1111-4111-8111-111111111111', 'Dia suka es less ice.', 'Likes'),
('11111111-1111-4111-8111-111111111111', 'Dia tidak suka kismis.', 'Dislikes'),
('11111111-1111-4111-8111-111111111111', 'Dia suka dipanggil Nad.', 'Words'),
('11111111-1111-4111-8111-111111111111', 'Dia mudah nangis saat adegan drama paling soft.', 'Habits');

insert into public.media_assets (
  person_id,
  diary_entry_id,
  source_type,
  url,
  alt_text
)
values
('11111111-1111-4111-8111-111111111111', null, 'profile', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80', 'Nadya profile photo'),
('11111111-1111-4111-8111-111111111111', 'bbbbbbbb-0000-4000-8000-000000000001', 'diary', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80', 'Rain diary image'),
('11111111-1111-4111-8111-111111111111', 'bbbbbbbb-0000-4000-8000-000000000002', 'diary', 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=900&q=80', 'Movie diary image'),
('11111111-1111-4111-8111-111111111111', 'bbbbbbbb-0000-4000-8000-000000000003', 'diary', 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=900&q=80', 'Matcha diary image');
