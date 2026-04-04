import type { Dish, Restaurant } from "@/types";

export const dishes: Dish[] = [
  {
    id: "injera",
    name: "Injera",
    description: "Sour fermented flatbread—edible plate for wats, tibs, and gomen. The foundation of every feast.",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=85",
  },
  {
    id: "doro-wat",
    name: "Doro Wat",
    description: "Slow-cooked chicken stew in berbere spice and nitir kibbeh—rich, ceremonial, unforgettable.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=85",
  },
  {
    id: "kitfo",
    name: "Kitfo",
    description: "Minced raw beef seasoned with mitmita and kibbeh—often paired with ayib cheese and gomen.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=85",
  },
  {
    id: "tibs",
    name: "Tibs",
    description: "Sautéed meat with onions, peppers, and rosemary—quick, smoky, perfect with injera rolls.",
    image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800&q=85",
  },
  {
    id: "shiro",
    name: "Shiro Wat",
    description: "Silky chickpea or lentil stew—vegan comfort food, beloved on fasting days and every day.",
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&q=85",
  },
  {
    id: "tej",
    name: "Tej",
    description: "Honey wine with a golden hue—sip slowly in tej bets or upscale restaurants.",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=85",
  },
  {
    id: "buna",
    name: "Ethiopian Coffee",
    description: "Birthplace of coffee—green beans roasted fresh, brewed in a clay jebena, served in tiny cups.",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=85",
  },
  {
    id: "firfir",
    name: "Firfir",
    description: "Leftover injera fried with berbere, clarified butter, and onions—humble, addictive, soulful.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=85",
  },
];

export const restaurants: Restaurant[] = [
  { id: "1", name: "Yod Abyssinia", city: "Addis Ababa", specialty: "Cultural dinner & dance" },
  { id: "2", name: "Champion's", city: "Addis Ababa", specialty: "Tibs & local grills" },
  { id: "3", name: "2000 Habesha", city: "Addis Ababa", specialty: "Traditional multi-course feast" },
  { id: "4", name: "Kategna", city: "Addis Ababa", specialty: "Injera & tej in modern setting" },
  { id: "5", name: "Ben Abeba", city: "Lalibela", specialty: "Rooftop views & Ethiopian staples" },
  { id: "6", name: "Unique Restaurant", city: "Gondar", specialty: "Highland cuisine & tej house" },
];
