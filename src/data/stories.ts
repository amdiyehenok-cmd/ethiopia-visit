export interface StoryChapter {
  id: string;
  heading: string;
  content: string;
  imageCaption?: string;
  timeline?: string;
  audioSegment: string;
}

export interface CulturalStory {
  id: string;
  title: string;
  subtitle: string;
  category: "history" | "tribe" | "food" | "religion" | "music" | "language";
  audioText: string;
  chapters: StoryChapter[];
  duration: number;
  coverImage: string;
}

export const culturalStories: CulturalStory[] = [
  {
    id: "axum-empire",
    title: "The Rise and Fall of the Aksumite Empire",
    subtitle: "One of the ancient world's greatest civilizations",
    category: "history",
    duration: 8,
    coverImage: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
    audioText:
      "Three thousand years ago, in the highlands of northern Ethiopia, one of history's most extraordinary civilizations was born...",
    chapters: [
      {
        id: "origins",
        heading: "Origins — 300 BCE",
        content:
          "The Aksumite Empire rose in the Tigray highlands, becoming a major trading hub linking Rome, Arabia, India, and sub-Saharan Africa.",
        timeline: "300 BCE",
        audioSegment:
          "The Aksumite Empire rose in the Tigray highlands, becoming a major trading hub linking Rome, Arabia, India, and sub-Saharan Africa.",
      },
      {
        id: "golden-age",
        heading: "The Golden Age — 300 AD",
        content:
          "Under King Ezana, Aksum reached its peak. The empire minted its own coins, erected towering obelisks, and projected power across the Red Sea.",
        timeline: "300 AD",
        audioSegment:
          "Under King Ezana, Aksum reached its peak—minting coins and raising obelisks that still stand today.",
      },
      {
        id: "christianity",
        heading: "Ethiopia Embraces Christianity — 331 AD",
        content:
          "Ethiopia became one of the first regions to embrace Christianity, weaving faith into language, calendar, and daily life for millennia.",
        timeline: "331 AD",
        audioSegment:
          "Christianity took root early here—shaping calendars, art, and pilgrimage routes across the highlands.",
      },
      {
        id: "decline",
        heading: "Decline and Legacy — 700 AD",
        content:
          "As trade routes shifted, political centers moved south—but Aksum's legacy endures in Ethiopian culture, language, and religion.",
        timeline: "700 AD",
        audioSegment:
          "Though imperial power shifted, Aksum's legacy endures in stone, scripture, and story across Ethiopia.",
      },
    ],
  },
  {
    id: "coffee-origin",
    title: "Ethiopia: The Birthplace of Coffee",
    subtitle: "The legend of Kaldi and the dancing goats",
    category: "food",
    duration: 5,
    coverImage: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
    audioText:
      "Imagine a ninth-century goat herder named Kaldi, watching his goats dance with unusual energy after eating red berries from a certain tree...",
    chapters: [
      {
        id: "legend",
        heading: "The Legend of Kaldi",
        content:
          "The story of coffee's discovery begins in the Ethiopian highlands of Kaffa—where forests still hide wild coffee trees.",
        timeline: "9th Century",
        audioSegment:
          "Legend places coffee's discovery in the Ethiopian highlands—where Kaldi first noticed his goats' newfound energy.",
      },
      {
        id: "spread",
        heading: "From Ethiopia to the World",
        content:
          "Arab traders carried beans across the Red Sea; coffee houses bloomed from Cairo to Istanbul—and eventually the world.",
        timeline: "1400s AD",
        audioSegment:
          "From Ethiopian forests, coffee traveled with traders—becoming a global ritual millions cherish daily.",
      },
      {
        id: "ceremony",
        heading: "The Sacred Coffee Ceremony",
        content:
          "In Ethiopia, coffee is not merely a drink—it is hospitality: roasting, grinding, brewing, and sharing in three rounds of connection.",
        timeline: "Present Day",
        audioSegment:
          "The Ethiopian coffee ceremony turns beans into community—three rounds, endless conversation, timeless grace.",
      },
    ],
  },
  {
    id: "lalibela-faith",
    title: "Lalibela — Faith Carved in Stone",
    subtitle: "Eleven churches and a king's vision",
    category: "religion",
    duration: 6,
    coverImage: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
    audioText:
      "King Lalibela dreamed of a new Jerusalem in stone—and masons carved eleven churches downward into living rock.",
    chapters: [
      {
        id: "vision",
        heading: "A New Jerusalem",
        content:
          "Lalibela's churches were carved from the top down—each trench and portal shaped by faith and engineering in the highlands.",
        timeline: "12th Century",
        audioSegment:
          "Lalibela's churches were carved downward into rock—a pilgrimage architecture without parallel.",
      },
      {
        id: "pilgrimage",
        heading: "Living Pilgrimage",
        content:
          "Today, pilgrims still walk these passages—candles, drums, and prayer echoing off stone that has heard centuries of devotion.",
        timeline: "Today",
        audioSegment:
          "Pilgrims still arrive—carrying song and prayer through tunnels of stone that remember every generation.",
      },
    ],
  },
];
