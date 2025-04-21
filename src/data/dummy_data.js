// src/data/dummy_data.js

export const opportunities = [
  {
    id: 1,
    title: "Musical Night",
    company: "Music Club",
    description: "Join us for an enchanting evening of live performances featuring talented student musicians. From classical to contemporary, experience diverse musical genres.",
    category: "Music",
    location: "Auditorium",
    type: "Event",
    tags: ["Live Music", "Performance", "Entertainment"],
    postedDate: "2025-01-15",
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Tech Hackathon 2025",
    company: "Tech Society",
    description: "48-hour coding challenge to build innovative solutions. Great opportunity to showcase your technical skills and win exciting prizes!",
    category: "Technology",
    location: "Computer Lab",
    type: "Competition",
    tags: ["Coding", "Innovation", "Teamwork"],
    postedDate: "2025-01-18",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "Cultural Festival",
    company: "Student Council",
    description: "Annual cultural extravaganza featuring dance, drama, and art exhibitions. Come celebrate diversity and creativity!",
    category: "Cultural",
    location: "Campus Ground",
    type: "Festival",
    tags: ["Culture", "Arts", "Performance"],
    postedDate: "2025-01-20",
    image: "https://images.unsplash.com/photo-1508997449629-303059a039c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  }
];

export const communityGroups = [
  {
    id: 1,
    name: "Music Enthusiasts",
    members: 524,
    postsPerDay: 45,
    description: "A community for music lovers to share their passion and organize events",
    category: "Music",
    avatar: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80"
  },
  {
    id: 2,
    name: "Campus Artists",
    members: 376,
    postsPerDay: 35,
    description: "Share your artwork, get feedback, and collaborate on creative projects",
    category: "Arts",
    avatar: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80"
  },
  {
    id: 3,
    name: "Sports Club",
    members: 632,
    postsPerDay: 52,
    description: "Connect with fellow sports enthusiasts and stay updated on campus tournaments",
    category: "Sports",
    avatar: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80"
  }
];

export const discussions = [
  {
    id: 1,
    title: "Ideas for upcoming Musical Night",
    author: "Sarah Chen",
    timeAgo: "2 hours ago",
    content: "What performances would you like to see at this year's Musical Night?",
    comments: 24,
    likes: 42,
    category: "Music"
  },
  {
    id: 2,
    title: "Basketball Tournament Registration",
    author: "Mike Williams",
    timeAgo: "4 hours ago",
    content: "Looking for players to form a team for the upcoming basketball tournament",
    comments: 18,
    likes: 35,
    category: "Sports"
  },
  {
    id: 3,
    title: "Art Exhibition Theme Suggestions",
    author: "Emma Davis",
    timeAgo: "6 hours ago",
    content: "What theme should we choose for this semester's art exhibition?",
    comments: 31,
    likes: 56,
    category: "Arts"
  }
];