export type PersonRelationship =
  | "Partner"
  | "Crush"
  | "Ex"
  | "Friend"
  | "Family"
  | "Other";

export type PersonStatus = "Active" | "Archived" | "Hidden";

export type FavoriteItem = {
  id?: string;
  category: string;
  label: string;
  value: string;
};

export type WishlistItem = {
  id: string;
  title: string;
  category: "Short-term" | "Long-term" | "Gift idea";
  priority: "Low" | "Medium" | "High";
  status: "Planned" | "Bought" | "Completed" | "Ignored";
};

export type DiaryEntry = {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: string;
  tags: string[];
  isPublic: boolean;
  image?: string;
};

export type TimelineEvent = {
  id: string;
  date: string;
  title: string;
  description: string;
};

export type LittleThing = {
  id: string;
  text: string;
  category: "Likes" | "Dislikes" | "Habits" | "Words" | "Other";
};

export type MediaAsset = {
  altText?: string;
  diaryEntryId?: string;
  id: string;
  sourceType: "profile" | "diary" | "gallery";
  storagePath?: string;
  url: string;
};

export type Person = {
  id: string;
  name: string;
  nickname: string;
  relationship: PersonRelationship;
  status: PersonStatus;
  birthday: string;
  location: string;
  description: string;
  photo: string;
  tags: string[];
  favorites: FavoriteItem[];
  wishlist: WishlistItem[];
  diaryEntries: DiaryEntry[];
  gallery: MediaAsset[];
  timeline: TimelineEvent[];
  littleThings: LittleThing[];
};
