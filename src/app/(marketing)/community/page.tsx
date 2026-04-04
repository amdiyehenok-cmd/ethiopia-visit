"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PhotoUploadWidget } from "@/components/ugc/PhotoUploadWidget";
import { ShimmerText } from "@/components/ui/ShimmerText";
import { GoldButton } from "@/components/ui/GoldButton";
import { Badge } from "@/components/ui/Badge";

// ── Types ──────────────────────────────────────────────
interface Reply {
  id: string;
  author: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
  likedByMe: boolean;
}

interface Post {
  id: string;
  author: string;
  avatar: string;
  location: string;
  text: string;
  image?: string;
  time: string;
  likes: number;
  likedByMe: boolean;
  replies: Reply[];
  tag: string;
}

// ── Seed data ──────────────────────────────────────────
const SEED_POSTS: Post[] = [
  {
    id: "p1",
    author: "Lena Hoffmann",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80",
    location: "Lalibela, Ethiopia",
    text: "Arrived at Bete Giyorgis at 5:30 AM — total silence except for distant chanting. No words. Just go. 🙏",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
    time: "2 hours ago",
    likes: 48,
    likedByMe: false,
    tag: "Lalibela",
    replies: [
      { id: "r1", author: "Marco Rossi", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80", text: "This is exactly how I felt! Did you do the full circuit same day?", time: "1 hr ago", likes: 5, likedByMe: false },
      { id: "r2", author: "Habesha AI 🤖", avatar: "/favicon.ico", text: "Pro tip: hire a local priest-guide for inside access to Bete Medhane Alem — they know passages not on any map.", time: "45 min ago", likes: 12, likedByMe: false },
    ],
  },
  {
    id: "p2",
    author: "James Okonkwo",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80",
    location: "Danakil Depression",
    text: "Day 2 at Erta Ale. The lava lake is ALIVE. We watched it for 3 hours straight. Highly recommend Kebede as your guide — he's phenomenal.",
    image: "https://images.unsplash.com/photo-1525857597365-5f6dbff2e36e?w=800&q=80",
    time: "5 hours ago",
    likes: 91,
    likedByMe: false,
    tag: "Danakil",
    replies: [
      { id: "r3", author: "Sofia Andersson", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&q=80", text: "Kebede is listed on the guides page! Booking him for February!", time: "3 hrs ago", likes: 7, likedByMe: false },
    ],
  },
  {
    id: "p3",
    author: "Priya Sharma",
    avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=80&q=80",
    location: "Addis Ababa",
    text: "3-hour coffee ceremony at a family home in Bole. They roasted, ground, brewed — three rounds. I cried a little at the third cup (baraka) because of the kindness. Ethiopia really opens your heart. ☕❤️",
    time: "1 day ago",
    likes: 124,
    likedByMe: false,
    tag: "Culture",
    replies: [
      { id: "r4", author: "Dawit T.", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&q=80", text: "Welcome to Ethiopia! The third cup is called baraka — blessing. You received it well 🙏", time: "20 hrs ago", likes: 28, likedByMe: false },
    ],
  },
  {
    id: "p4",
    author: "Carlos Mendez",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80",
    location: "Simien Mountains",
    text: "Day 3 of our Simien trek. Gelada baboons 50cm from the tent at dawn. I could hear them munching grass while I drank my coffee. Best alarm clock ever.",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
    time: "2 days ago",
    likes: 77,
    likedByMe: false,
    tag: "Wildlife",
    replies: [],
  },
  {
    id: "p5",
    author: "Aiko Tanaka",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&q=80",
    location: "Omo Valley",
    text: "Turmi Market on Tuesday — vendors from 6 different tribes. The colors, the jewelry, the music. I shot 1,200 photos and they're all good. Hired Tigist from the guides platform — she was flawless at navigating ethical photography.",
    image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800&q=80",
    time: "3 days ago",
    likes: 143,
    likedByMe: false,
    tag: "Photography",
    replies: [
      { id: "r5", author: "Tigist B. 🌟", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&q=80", text: "It was an honour, Aiko! See you next year for the bull jumping? 🐂", time: "2 days ago", likes: 19, likedByMe: false },
    ],
  },
];

const TAGS = ["All", "Lalibela", "Danakil", "Culture", "Wildlife", "Photography", "Food", "Hotels", "Tips"];

// ── Component ──────────────────────────────────────────
export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>(SEED_POSTS);
  const [activeTag, setActiveTag] = useState("All");
  const [newText, setNewText] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newTag, setNewTag] = useState("Tips");
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [showCompose, setShowCompose] = useState(false);
  const [photoUploads, setPhotoUploads] = useState<string[]>([]);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const filtered = activeTag === "All" ? posts : posts.filter((p) => p.tag === activeTag);

  function toggleLike(postId: string) {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, likes: p.likedByMe ? p.likes - 1 : p.likes + 1, likedByMe: !p.likedByMe } : p
      )
    );
  }

  function toggleReplyLike(postId: string, replyId: string) {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              replies: p.replies.map((r) =>
                r.id === replyId ? { ...r, likes: r.likedByMe ? r.likes - 1 : r.likes + 1, likedByMe: !r.likedByMe } : r
              ),
            }
          : p
      )
    );
  }

  function submitPost() {
    if (!newText.trim()) return;
    const post: Post = {
      id: `p-${Date.now()}`,
      author: "You",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=80",
      location: "Ethiopia",
      text: newText,
      image: newImage || undefined,
      time: "Just now",
      likes: 0,
      likedByMe: false,
      tag: newTag,
      replies: [],
    };
    setPosts((prev) => [post, ...prev]);
    setNewText("");
    setNewImage("");
    setShowCompose(false);
  }

  function submitReply(postId: string) {
    const text = replyText[postId]?.trim();
    if (!text) return;
    const reply: Reply = {
      id: `r-${Date.now()}`,
      author: "You",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=80",
      text,
      time: "Just now",
      likes: 0,
      likedByMe: false,
    };
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, replies: [...p.replies, reply] } : p))
    );
    setReplyText((prev) => ({ ...prev, [postId]: "" }));
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-dark-1 via-dark-2 to-obsidian py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle at 30% 50%, #1a6b3a 0%, transparent 60%), radial-gradient(circle at 70% 50%, #bf1b2c 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-4 text-center md:px-8">
          <ShimmerText className="text-5xl md:text-7xl" as="h1">
            Share your Ethiopia
          </ShimmerText>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ivory/60">
            A traveller community for stories, photos, tips, and connections.{" "}
            <span className="text-gold-light">#EthiopiaVisit</span>
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => setShowCompose(true)}
              className="btn-gold rounded-full px-6 py-3 text-sm font-semibold"
            >
              + Share your story
            </button>
            <GoldButton href="/guides" variant="outline" className="text-sm">
              Find a guide
            </GoldButton>
          </div>
          {/* Stats */}
          <div className="mt-10 flex flex-wrap justify-center gap-8">
            {[
              { v: "12K+", l: "Travellers" },
              { v: "4.2K+", l: "Stories" },
              { v: "89K+", l: "Photos shared" },
              { v: "130+", l: "Countries" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <p className="font-display text-3xl text-gold-light">{s.v}</p>
                <p className="text-xs uppercase tracking-widest text-ivory/40">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12 md:px-8">
        {/* Tag filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          {TAGS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActiveTag(t)}
              className={`rounded-full px-4 py-1.5 text-sm transition ${
                activeTag === t
                  ? "bg-gold-primary text-obsidian font-semibold"
                  : "border border-white/10 bg-white/5 text-ivory/60 hover:border-white/20"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Compose modal */}
        <AnimatePresence>
          {showCompose && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
              onClick={(e) => { if (e.target === e.currentTarget) setShowCompose(false); }}
            >
              <motion.div
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                className="w-full max-w-lg rounded-t-3xl border border-white/10 bg-[#111114] p-6 sm:rounded-3xl"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-display text-2xl text-ivory">Share your story</h2>
                  <button type="button" onClick={() => setShowCompose(false)} className="text-ivory/40 hover:text-ivory">✕</button>
                </div>
                <textarea
                  ref={textRef}
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="What happened on your Ethiopian adventure? 🇪🇹"
                  rows={4}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-ivory placeholder-ivory/30 focus:border-gold-primary/50 focus:outline-none"
                />
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <select
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="rounded-lg border border-white/10 bg-dark-2 px-3 py-1.5 text-xs text-ivory"
                  >
                    {TAGS.filter((t) => t !== "All").map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {newImage && (
                    <div className="relative h-12 w-20 overflow-hidden rounded-lg border border-white/10">
                      <Image src={newImage} alt="preview" fill className="object-cover" sizes="80px" />
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <PhotoUploadWidget
                    compact
                    onUploaded={(url) => { setNewImage(url); setPhotoUploads((p) => [url, ...p]); }}
                  />
                </div>
                <button
                  type="button"
                  onClick={submitPost}
                  disabled={!newText.trim()}
                  className="btn-gold mt-4 w-full rounded-full py-3 text-sm font-semibold disabled:opacity-50"
                >
                  Post to community
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Feed */}
          <div className="space-y-6 lg:col-span-2">
            {filtered.length === 0 && (
              <p className="text-center text-ivory/40 py-12">No posts in this category yet — be the first!</p>
            )}
            {filtered.map((post) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
              >
                {/* Post image */}
                {post.image && (
                  <div className="relative aspect-video w-full">
                    <Image src={post.image} alt="" fill className="object-cover" sizes="(max-width:768px) 100vw, 600px" />
                  </div>
                )}
                <div className="p-5">
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full border border-gold-primary/30">
                      <Image src={post.avatar} alt={post.author} fill className="object-cover" sizes="40px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-ivory text-sm">{post.author}</p>
                      <p className="text-xs text-ivory/40">{post.location} · {post.time}</p>
                    </div>
                    <Badge className="text-[10px] shrink-0">{post.tag}</Badge>
                  </div>
                  {/* Text */}
                  <p className="mt-3 text-sm leading-relaxed text-ivory/85">{post.text}</p>
                  {/* Actions */}
                  <div className="mt-4 flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-1.5 text-sm transition ${post.likedByMe ? "text-gold-light" : "text-ivory/40 hover:text-ivory/70"}`}
                    >
                      {post.likedByMe ? "❤️" : "🤍"} {post.likes}
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                      className="flex items-center gap-1.5 text-sm text-ivory/40 hover:text-ivory/70 transition"
                    >
                      💬 {post.replies.length}
                    </button>
                    <button
                      type="button"
                      onClick={() => { if (navigator.share) navigator.share({ title: post.author, text: post.text, url: window.location.href }); }}
                      className="flex items-center gap-1.5 text-sm text-ivory/40 hover:text-ivory/70 transition"
                    >
                      🔗 Share
                    </button>
                  </div>
                  {/* Replies */}
                  <AnimatePresence>
                    {expandedPost === post.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 space-y-3 border-t border-white/5 pt-4">
                          {post.replies.map((r) => (
                            <div key={r.id} className="flex gap-2.5">
                              <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border border-white/10">
                                <Image src={r.avatar} alt={r.author} fill className="object-cover" sizes="28px" />
                              </div>
                              <div className="flex-1 rounded-xl bg-white/5 px-3 py-2">
                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-xs font-semibold text-gold-light">{r.author}</p>
                                  <p className="text-[10px] text-ivory/30">{r.time}</p>
                                </div>
                                <p className="mt-0.5 text-xs text-ivory/75 leading-relaxed">{r.text}</p>
                                <button
                                  type="button"
                                  onClick={() => toggleReplyLike(post.id, r.id)}
                                  className={`mt-1.5 text-[11px] transition ${r.likedByMe ? "text-gold-light" : "text-ivory/30 hover:text-ivory/50"}`}
                                >
                                  {r.likedByMe ? "❤️" : "🤍"} {r.likes}
                                </button>
                              </div>
                            </div>
                          ))}
                          {/* Reply input */}
                          <div className="flex gap-2">
                            <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border border-white/10 bg-dark-2">
                              <Image src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&q=80" alt="You" fill className="object-cover" sizes="28px" />
                            </div>
                            <div className="flex flex-1 gap-2">
                              <input
                                type="text"
                                value={replyText[post.id] ?? ""}
                                onChange={(e) => setReplyText((prev) => ({ ...prev, [post.id]: e.target.value }))}
                                onKeyDown={(e) => { if (e.key === "Enter") submitReply(post.id); }}
                                placeholder="Add a reply…"
                                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-ivory placeholder-ivory/30 focus:border-gold-primary/50 focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => submitReply(post.id)}
                                disabled={!replyText[post.id]?.trim()}
                                className="rounded-xl bg-gold-primary/20 px-3 py-1 text-xs text-gold-light hover:bg-gold-primary/30 disabled:opacity-40"
                              >
                                ↵
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Upload widget */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="mb-4 font-display text-xl text-ivory">Add your photo</h3>
              <PhotoUploadWidget
                onUploaded={(url) => setPhotoUploads((p) => [url, ...p])}
              />
              {photoUploads.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {photoUploads.slice(0, 4).map((url, i) => (
                    <div key={i} className="relative aspect-square overflow-hidden rounded-lg">
                      <Image src={url} alt="" fill className="object-cover" sizes="120px" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Trending destinations */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="mb-4 font-display text-xl text-ivory">Trending now</h3>
              <ul className="space-y-2.5">
                {[
                  { name: "Lalibela", count: "2.1K posts", emoji: "⛪" },
                  { name: "Danakil Depression", count: "847 posts", emoji: "🌋" },
                  { name: "Omo Valley", count: "634 posts", emoji: "🎨" },
                  { name: "Simien Mountains", count: "512 posts", emoji: "🏔️" },
                  { name: "Addis Coffee Culture", count: "489 posts", emoji: "☕" },
                ].map((t) => (
                  <li key={t.name} className="flex items-center justify-between">
                    <span className="text-sm text-ivory/75">{t.emoji} {t.name}</span>
                    <span className="text-xs text-ivory/35">{t.count}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Featured travellers */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="mb-4 font-display text-xl text-ivory">Top contributors</h3>
              <ul className="space-y-3">
                {[
                  { name: "@highland_lens", stat: "284 photos", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&q=80" },
                  { name: "@buna_daily", stat: "198 posts", avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=60&q=80" },
                  { name: "@axum_stories", stat: "156 posts", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&q=80" },
                ].map((c) => (
                  <li key={c.name} className="flex items-center gap-3">
                    <div className="relative h-9 w-9 overflow-hidden rounded-full border border-gold-primary/20">
                      <Image src={c.avatar} alt={c.name} fill className="object-cover" sizes="36px" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gold-light">{c.name}</p>
                      <p className="text-xs text-ivory/40">{c.stat}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Guides CTA */}
            <div className="rounded-2xl border border-gold-primary/20 bg-gold-primary/5 p-5">
              <p className="text-xs uppercase tracking-widest text-gold-primary">Book a local guide</p>
              <h3 className="mt-2 font-display text-xl text-ivory">Travel like a local</h3>
              <p className="mt-1.5 text-xs text-ivory/55">8 verified guides — speak your language, know every trail.</p>
              <GoldButton href="/guides" className="mt-4 w-full justify-center text-sm">
                Meet the guides
              </GoldButton>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
