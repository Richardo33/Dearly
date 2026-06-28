import { getPersonSlug } from "@/lib/person-path";
import type { Person } from "@/src/types/person";

const demoPeopleBase: Omit<Person, "slug">[] = [
  {
    birthday: "12 May 2002",
    description:
      "Soft spoken, suka cerita random, dan punya selera humor yang hangat.",
    diaryEntries: [
      {
        content:
          "Hari ini kita kehujanan pas pulang dari kafe. Dia tidak bawa payung, jadi kita berteduh sambil ngobrol hal random sampai hujannya reda.",
        date: "2024-03-12",
        id: "demo-diary-nadya-1",
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
        isPublic: true,
        mood: "Happy",
        tags: ["Rain", "Bandung"],
        title: "Hujan pertama bersama",
      },
      {
        content:
          "Nonton film di rumah, banyak ketawa, lalu ngobrol tentang hal kecil yang ternyata masih kebawa sampai malam.",
        date: "2024-04-30",
        id: "demo-diary-nadya-2",
        image:
          "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=900&q=80",
        isPublic: true,
        mood: "Excited",
        tags: ["Movie"],
        title: "Nonton bareng",
      },
    ],
    favorites: [
      { category: "Food", id: "demo-fav-1", label: "Mie Ayam", value: "Mie Ayam" },
      {
        category: "Film",
        id: "demo-fav-2",
        label: "Drama Korea",
        value: "Drama Korea",
      },
      { category: "Film", id: "demo-fav-3", label: "Anime", value: "Anime" },
      {
        category: "Drink",
        id: "demo-fav-4",
        label: "Matcha Latte",
        value: "Matcha Latte",
      },
    ],
    gallery: [
      {
        altText: "Nadya profile photo",
        id: "demo-media-nadya-profile",
        sourceType: "profile",
        url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
      },
    ],
    id: "demo-nadya",
    littleThings: [
      { category: "Likes", id: "demo-little-1", text: "Dia suka es less ice." },
      {
        category: "Words",
        id: "demo-little-2",
        text: "Dia suka dipanggil Nad kalau lagi santai.",
      },
    ],
    location: "Bandung, Indonesia",
    name: "Nadya Saputri",
    nickname: "Nadya",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
    relationship: "Partner",
    status: "Active",
    tags: ["Sweet", "Kind", "Funny", "Thoughtful"],
    timeline: [
      {
        date: "2024-03-12",
        description: "Mulai ngobrol dari hal kecil yang ternyata nyambung.",
        id: "demo-timeline-1",
        title: "First Chat",
      },
      {
        date: "2024-04-20",
        description: "Ketemu pertama di cafe kecil di Bandung.",
        id: "demo-timeline-2",
        title: "First Date",
      },
    ],
    wishlist: [
      {
        category: "Short-term",
        id: "demo-wish-1",
        priority: "High",
        status: "Planned",
        title: "Nonton konser NIKI",
      },
      {
        category: "Long-term",
        id: "demo-wish-2",
        priority: "Medium",
        status: "Planned",
        title: "Trip ke tempat dingin",
      },
    ],
  },
  {
    birthday: "6 Aug 2003",
    description: "Suka journaling dan all about self improvement.",
    diaryEntries: [
      {
        content:
          "Alya cerita tentang buku yang baru selesai dia baca. Sederhana, tapi caranya cerita bikin ikut semangat.",
        date: "2024-06-08",
        id: "demo-diary-alya-1",
        isPublic: true,
        mood: "Calm",
        tags: ["Books"],
        title: "Cerita buku baru",
      },
    ],
    favorites: [
      {
        category: "Books",
        id: "demo-fav-5",
        label: "Atomic Habits",
        value: "Atomic Habits",
      },
      {
        category: "Drink",
        id: "demo-fav-6",
        label: "Iced Tea",
        value: "Iced Tea",
      },
    ],
    gallery: [
      {
        altText: "Alya profile photo",
        id: "demo-media-alya-profile",
        sourceType: "profile",
        url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80",
      },
    ],
    id: "demo-alya",
    littleThings: [
      {
        category: "Habits",
        id: "demo-little-3",
        text: "Selalu bawa notebook kecil.",
      },
    ],
    location: "Jakarta, Indonesia",
    name: "Alya Putri",
    nickname: "Alya",
    photo:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80",
    relationship: "Crush",
    status: "Active",
    tags: ["Green", "Soft", "Journal"],
    timeline: [
      {
        date: "2024-06-08",
        description: "Ngobrol panjang soal buku dan goals.",
        id: "demo-timeline-3",
        title: "Long Talk",
      },
    ],
    wishlist: [
      {
        category: "Gift idea",
        id: "demo-wish-3",
        priority: "Low",
        status: "Planned",
        title: "Notebook linen cover",
      },
    ],
  },
  {
    birthday: "17 Jun 2003",
    description: "Teman lama yang paling jago ngasih reality check.",
    diaryEntries: [],
    favorites: [
      { category: "Color", id: "demo-fav-7", label: "Pink", value: "Soft Pink" },
    ],
    gallery: [
      {
        altText: "Sarah profile photo",
        id: "demo-media-sarah-profile",
        sourceType: "profile",
        url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
      },
    ],
    id: "demo-sarah",
    littleThings: [],
    location: "Surabaya, Indonesia",
    name: "Sarah",
    nickname: "Sarah",
    photo:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    relationship: "Friend",
    status: "Active",
    tags: ["Honest", "Warm"],
    timeline: [],
    wishlist: [],
  },
];

export const demoPeople = demoPeopleBase.map((person) => ({
  ...person,
  slug: getPersonSlug(person),
}));
