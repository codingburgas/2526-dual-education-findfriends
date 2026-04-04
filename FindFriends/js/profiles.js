/* ============================================
   FRIEND CONNECT - RAW PROFILE DATA
   ============================================ */

// Raw user data that will be transformed using MapReduce
const rawUserData = [
    {
        id: 1,
        name: "Sarah Johnson",
        age: 26,
        location: "New York",
        bio: "Adventurous spirit with a passion for photography and travel",
        interests: "Photography, Travel, Hiking",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=500&q=60",
        online: true,
        joinDate: "2023-01-15"
    },
    {
        id: 2,
        name: "Emily Chen",
        age: 24,
        location: "Los Angeles",
        bio: "Artist and coffee lover, always seeking creative inspiration",
        interests: "Art, Coffee, Music, Design",
        image: "https://thumbs.dreamstime.com/b/terra6-707617.jpg?w=576",
        online: true,
        joinDate: "2023-02-20"
    },
    {
        id: 3,
        name: "Jessica Martinez",
        age: 28,
        location: "Chicago",
        bio: "Fitness enthusiast and foodie, exploring the best restaurants in town",
        interests: "Fitness, Cooking, Food, Health",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=500&q=60",
        online: false,
        joinDate: "2023-03-10"
    },
    {
        id: 4,
        name: "Amanda White",
        age: 25,
        location: "Miami",
        bio: "Beach lover and book enthusiast with a tropical vibe",
        interests: "Reading, Beach, Travel, Yoga",
        image: "https://thumbs.dreamstime.com/b/happy-sports-woman-tanned-fit-body-sport-wear-sits-sand-city-beach-training-sea-background-against-blue-151050424.jpg?w=576",
        online: true,
        joinDate: "2023-01-25"
    },
    {
        id: 5,
        name: "Lisa Anderson",
        age: 27,
        location: "Seattle",
        bio: "Tech enthusiast and startup founder, always up for a challenge",
        interests: "Technology, Startups, Coding, Business",
        image: "https://images.unsplash.com/photo-1517331156700-3c241d2b4d83?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=500&q=60",
        online: true,
        joinDate: "2023-02-05"
    },
    {
        id: 6,
        name: "Rachel Green",
        age: 23,
        location: "Boston",
        bio: "Psychology student with a love for meditation and wellness",
        interests: "Psychology, Meditation, Wellness, Self-improvement",
        image: "https://thumbs.dreamstime.com/b/portrait-successful-psychologist-businesswoman-portrait-successful-psychologist-businesswoman-beautiful-woman-112813538.jpg?w=576",
        online: false,
        joinDate: "2023-03-15"
    },
    {
        id: 7,
        name: "Victoria Lee",
        age: 29,
        location: "San Francisco",
        bio: "Entrepreneur and adventure junkie, living life to the fullest",
        interests: "Adventure, Business, Climbing, Travel",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=500&q=60",
        online: true,
        joinDate: "2023-01-08"
    },
    {
        id: 8,
        name: "Michelle Thompson",
        age: 26,
        location: "Austin",
        bio: "Music producer and festival enthusiast looking for like-minded people",
        interests: "Music, Festivals, Concerts, DJing",
        image: "https://thumbs.dreamstime.com/b/handsome-music-lover-listens-to-headphones-mobile-phone-media-large-speakers-man-modern-interior-against-93741767.jpg?w=576",
        online: true,
        joinDate: "2023-02-28"
    },
    {
        id: 9,
        name: "Grace Kim",
        age: 24,
        location: "Denver",
        bio: "Nature photographer capturing the beauty of the great outdoors",
        interests: "Photography, Nature, Hiking, Camping",
        image: "https://thumbs.dreamstime.com/b/young-asian-woman-taking-photograph-5398052.jpg?w=576",
        online: false,
        joinDate: "2023-03-22"
    },
    {
        id: 10,
        name: "Sophie Harris",
        age: 27,
        location: "Portland",
        bio: "Writer and storyteller, passionate about community and connection",
        interests: "Writing, Community, Books, Art",
        image: "https://thumbs.dreamstime.com/b/woman-laptop-hay-stack-20725403.jpg?w=992",
        online: true,
        joinDate: "2023-01-30"
    },
    {
        id: 11,
        name: "Nicole Scott",
        age: 28,
        location: "Miami",
        bio: "Yoga instructor spreading positivity and wellness vibes",
        interests: "Yoga, Wellness, Meditation, Fitness",
        image: "https://thumbs.dreamstime.com/b/woman-doing-yoga-outdoor-super-fit-attractive-young-wearing-fashionable-outfit-working-out-being-active-outside-sunny-145298908.jpg?w=992",
        online: true,
        joinDate: "2023-02-12"
    },
    {
        id: 12,
        name: "Olivia Brown",
        age: 25,
        location: "Brooklyn",
        bio: "Designer and creative thinker with an eye for aesthetics",
        interests: "Design, Art, Fashion, Photography",
        image: "https://thumbs.dreamstime.com/b/young-teacher-writing-whiteboard-classroom-174038626.jpg?w=992",
        online: false,
        joinDate: "2023-03-05"
    }
];

// All unique interests for filtering
const allInterests = [
    "Photography", "Travel", "Hiking", "Art", "Coffee", "Music", "Design",
    "Fitness", "Cooking", "Food", "Health", "Reading", "Beach", "Yoga",
    "Technology", "Startups", "Coding", "Business", "Psychology", "Meditation",
    "Wellness", "Self-improvement", "Adventure", "Climbing", "Concerts",
    "DJing", "Festivals", "Nature", "Camping", "Writing", "Community",
    "Books", "Fashion"
];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { rawUserData, allInterests };
}