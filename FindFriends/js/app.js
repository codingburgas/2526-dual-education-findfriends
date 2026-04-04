/* ============================================
   FRIEND CONNECT - MAIN APPLICATION
   ============================================ */

// Global state
let allProfiles = [];
let filteredProfiles = [];
let currentFilters = {
    search: '',
    minAge: '',
    maxAge: '',
    interests: [],
    sortType: 'recent'
};
let isListView = false;

// Messaging state
let conversations = [];
let currentConversation = null;

// ============ INITIALIZATION ============

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    renderProfiles(allProfiles);
});

/**
 * Initialize the application
 * Step 1: Map raw data to profile objects
 * Step 2: Extract interests for filter panel
 * Step 3: Load saved data from localStorage
 */
function initializeApp() {
    // Map raw data to profile objects (MAP phase)
    allProfiles = mapProfilesToObjects(rawUserData);
    filteredProfiles = [...allProfiles];
    
    // Extract unique interests (REDUCE phase)
    const uniqueInterests = extractUniqueInterests(allProfiles);
    
    // Render interest filter buttons
    renderInterestFilters(uniqueInterests);
    
    // Load saved likes and friends from localStorage
    loadSavedData();
    
    console.log('🚀 App initialized with', allProfiles.length, 'profiles');
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Search functionality with debounce
    document.getElementById('search').addEventListener(
        'input',
        debounce((e) => {
            currentFilters.search = e.target.value;
            applyFilters();
        }, 300)
    );
    
    // Filter panel toggle
    document.getElementById('filter-btn').addEventListener('click', () => {
        document.getElementById('filter-panel').classList.add('open');
    });
    
    document.getElementById('close-filter').addEventListener('click', () => {
        document.getElementById('filter-panel').classList.remove('open');
    });
    
    // Age range filters
    document.getElementById('min-age').addEventListener('change', (e) => {
        currentFilters.minAge = e.target.value ? parseInt(e.target.value) : '';
    });
    
    document.getElementById('max-age').addEventListener('change', (e) => {
        currentFilters.maxAge = e.target.value ? parseInt(e.target.value) : '';
    });
    
    // Sort dropdown
    document.getElementById('sort-by').addEventListener('change', (e) => {
        currentFilters.sortType = e.target.value;
        applyFilters();
    });
    
    // Apply filters button
    document.getElementById('apply-filters').addEventListener('click', () => {
        applyFilters();
        document.getElementById('filter-panel').classList.remove('open');
    });
    
    // Reset filters button
    document.getElementById('reset-filters').addEventListener('click', () => {
        resetFilters();
        applyFilters();
    });
    
    // View toggle button
    document.getElementById('toggle-view').addEventListener('click', () => {
        toggleView();
    });
    
    // Messages icon
    const messagesIcon = document.getElementById('messages-icon');
    if (messagesIcon) {
        messagesIcon.addEventListener('click', () => {
            openMessagesModal();
        });
    }
}

// ============ FILTERING & SEARCH ============

/**
 * Apply all filters to profiles
 * This uses the applyAllFilters function from utils.js
 */
function applyFilters() {
    const filters = {
        search: currentFilters.search,
        minAge: currentFilters.minAge || 18,
        maxAge: currentFilters.maxAge || 100,
        interests: currentFilters.interests,
        sortType: currentFilters.sortType
    };
    
    // Apply all filters using the MapReduce pattern function
    filteredProfiles = applyAllFilters(allProfiles, filters);
    
    // Update UI
    updateProfileCount();
    renderProfiles(filteredProfiles);
    
    console.log('✨ Filters applied. Showing', filteredProfiles.length, 'profiles');
}

/**
 * Reset all filters to default state
 */
function resetFilters() {
    currentFilters = {
        search: '',
        minAge: '',
        maxAge: '',
        interests: [],
        sortType: 'recent'
    };
    
    // Reset UI elements
    document.getElementById('search').value = '';
    document.getElementById('min-age').value = '';
    document.getElementById('max-age').value = '';
    document.getElementById('sort-by').value = 'recent';
    
    // Clear selected interests
    document.querySelectorAll('.interest-tag.active').forEach(tag => {
        tag.classList.remove('active');
    });
    
    filteredProfiles = [...allProfiles];
    updateProfileCount();
    renderProfiles(filteredProfiles);
}

// ============ PROFILE RENDERING ============

/**
 * Render all profiles to the DOM
 * Creates profile cards for each profile
 */
function renderProfiles(profiles) {
    const profileList = document.getElementById('profile-list');
    const noResults = document.getElementById('no-results');
    
    // Show/hide no results message
    if (profiles.length === 0) {
        profileList.innerHTML = '';
        noResults.classList.remove('hidden');
        return;
    }
    
    noResults.classList.add('hidden');
    profileList.innerHTML = profiles.map(profile => createProfileCard(profile)).join('');
    
    // Add event listeners to action buttons
    attachProfileCardListeners();
}

/**
 * Create HTML for a single profile card
 * MAP: Transform profile object to HTML string
 */
function createProfileCard(profile) {
    const interestBadges = profile.interests
        .map(interest => `<span class="interest-badge">${interest}</span>`)
        .join('');
    
    const onlineClass = profile.online ? '' : 'offline';
    
    return `
        <div class="profile-card" data-id="${profile.id}">
            <div class="profile-image-container">
                <img src="${profile.image}" alt="${profile.name}" class="profile-image" onerror="this.src='https://via.placeholder.com/400x500?text=${profile.name}'">
                <div class="online-status ${onlineClass}"></div>
            </div>
            
            <div class="profile-content">
                <div class="profile-header">
                    <h3 class="profile-name">${profile.name}</h3>
                    <p class="profile-meta">
                        ${profile.age} • ${profile.location}
                    </p>
                </div>
                
                <p class="profile-bio">${profile.bio}</p>
                
                <div class="profile-interests">
                    <span class="interests-label">Interests</span>
                    <div class="interest-badges">
                        ${interestBadges}
                    </div>
                </div>
                
                <div class="profile-actions">
                    <button class="action-btn like-btn" data-action="like" title="Like this profile">
                        ❤️ <span>Like</span>
                    </button>
                    <button class="action-btn friend-btn" data-action="friend" title="Add as friend">
                        👥 <span>Add Friend</span>
                    </button>
                    <button class="action-btn message-btn" data-action="message" title="Send message">
                        💬 <span>Message</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render interest filter tags
 */
function renderInterestFilters(interests) {
    const container = document.getElementById('interests-filter');
    container.innerHTML = interests
        .map(interest => `<button class="interest-tag" data-interest="${interest}">${interest}</button>`)
        .join('');
    
    // Add click listeners to interest tags
    container.querySelectorAll('.interest-tag').forEach(tag => {
        tag.addEventListener('click', (e) => {
            const interest = e.target.dataset.interest;
            e.target.classList.toggle('active');
            
            // Update filter state
            if (e.target.classList.contains('active')) {
                if (!currentFilters.interests.includes(interest)) {
                    currentFilters.interests.push(interest);
                }
            } else {
                currentFilters.interests = currentFilters.interests.filter(i => i !== interest);
            }
        });
    });
}

/**
 * Attach event listeners to profile action buttons
 */
function attachProfileCardListeners() {
    document.querySelectorAll('.profile-card').forEach(card => {
        const profileId = parseInt(card.dataset.id);
        const profile = allProfiles.find(p => p.id === profileId);
        
        // Like button
        const likeBtn = card.querySelector('.like-btn');
        if (profile.liked) likeBtn.classList.add('liked');
        
        likeBtn.addEventListener('click', () => {
            profile.liked = !profile.liked;
            likeBtn.classList.toggle('liked');
            saveLike(profileId, profile.liked);
            showFeedback('❤️ Added to likes!');
        });
        
        // Friend button
        const friendBtn = card.querySelector('.friend-btn');
        if (profile.friendAdded) friendBtn.classList.add('added');
        
        friendBtn.addEventListener('click', () => {
            profile.friendAdded = !profile.friendAdded;
            friendBtn.classList.toggle('added');
            saveFriend(profileId, profile.friendAdded);
            showFeedback('👥 Friend request sent!');
        });
        
        // Message button
        const messageBtn = card.querySelector('.message-btn');
        messageBtn.addEventListener('click', () => {
            openMessageWithProfile(profile);
        });
    });
}

/**
 * Update profile count display
 */
function updateProfileCount() {
    const count = filteredProfiles.length;
    document.getElementById('profile-count').innerHTML = 
        `Showing <strong>${count}</strong> ${count === 1 ? 'profile' : 'profiles'}`;
}

// ============ VIEW MANAGEMENT ============

/**
 * Toggle between grid and list view
 */
function toggleView() {
    const profileList = document.getElementById('profile-list');
    const toggleBtn = document.getElementById('toggle-view');
    
    isListView = !isListView;
    
    if (isListView) {
        profileList.classList.add('list-view');
        toggleBtn.textContent = '≡ List View';
    } else {
        profileList.classList.remove('list-view');
        toggleBtn.textContent = '⊞ Grid View';
    }
}

// ============ DATA PERSISTENCE ============

/**
 * Save liked profile to localStorage
 */
function saveLike(profileId, isLiked) {
    const likes = StorageHelper.load('friend-connect-likes', []);
    
    if (isLiked) {
        if (!likes.includes(profileId)) {
            likes.push(profileId);
        }
    } else {
        likes = likes.filter(id => id !== profileId);
    }
    
    StorageHelper.save('friend-connect-likes', likes);
}

/**
 * Save friend request to localStorage
 */
function saveFriend(profileId, isAdded) {
    const friends = StorageHelper.load('friend-connect-friends', []);
    
    if (isAdded) {
        if (!friends.includes(profileId)) {
            friends.push(profileId);
        }
    } else {
        friends = friends.filter(id => id !== profileId);
    }
    
    StorageHelper.save('friend-connect-friends', friends);
}

/**
 * Load saved likes and friends from localStorage
 */
function loadSavedData() {
    const likes = StorageHelper.load('friend-connect-likes', []);
    const friends = StorageHelper.load('friend-connect-friends', []);
    
    allProfiles.forEach(profile => {
        profile.liked = likes.includes(profile.id);
        profile.friendAdded = friends.includes(profile.id);
    });
}

// ============ FEEDBACK & UX ============

/**
 * Show temporary feedback message
 */
function showFeedback(message) {
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #6366f1, #ec4899);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideUp 0.3s ease;
        font-weight: 600;
    `;
    feedback.textContent = message;
    
    document.body.appendChild(feedback);
    
    // Remove after 3 seconds
    setTimeout(() => {
        feedback.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => feedback.remove(), 300);
    }, 3000);
}

// Add animation styles for feedback
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideDown {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(20px);
        }
    }
`;
document.head.appendChild(style);

// Log app statistics on load
console.log('📊 Friend Connect App Loaded Successfully');
console.log('💾 Total profiles:', allProfiles.length);
const stats = calculateProfileStats(allProfiles);
console.log('📈 Statistics:', stats);

// ============================================
// MESSAGING SYSTEM
// ============================================

/**
 * Initialize messaging system
 */
function initializeMessaging() {
    conversations = StorageHelper.load('friend-connect-conversations', []);
}

/**
 * Open message modal or create new conversation
 */
function openMessageWithProfile(profile) {
    let conversation = conversations.find(c => c.profileId === profile.id);
    
    if (!conversation) {
        conversation = {
            id: Date.now(),
            profileId: profile.id,
            profileName: profile.name,
            profileImage: profile.image,
            messages: [],
            unread: 0
        };
        conversations.push(conversation);
        saveConversations();
    }
    
    currentConversation = conversation;
    openMessagesModal();
    showConversation(conversation);
}

/**
 * Open messages modal
 */
function openMessagesModal() {
    // Create modal if doesn't exist
    let modal = document.getElementById('message-modal-overlay');
    
    if (!modal) {
        modal = createMessageModal();
        document.body.appendChild(modal);
    }
    
    modal.classList.add('active');
    if (conversations.length > 0) {
        renderConversationList();
    }
}

/**
 * Create message modal HTML
 */
function createMessageModal() {
    const overlay = document.createElement('div');
    overlay.id = 'message-modal-overlay';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
        <div class="message-modal">
            <div class="message-modal-header">
                <h2>💬 Messages</h2>
                <button class="message-modal-close">✕</button>
            </div>
            
            <div class="message-list" id="message-list">
                <!-- Conversations will be rendered here -->
            </div>
            
            <div class="message-conversation" id="message-conversation">
                <div class="conversation-header">
                    <button class="conversation-back">← Back</button>
                    <h3 id="conversation-name"></h3>
                </div>
                <div class="messages-container" id="messages-container"></div>
                <div class="message-input-area">
                    <textarea class="message-input" id="message-input" placeholder="Type your message..." rows="1"></textarea>
                    <button class="message-send-btn" id="message-send-btn">Send</button>
                </div>
            </div>
        </div>
    `;
    
    // Event listeners
    overlay.querySelector('.message-modal-close').addEventListener('click', () => {
        overlay.classList.remove('active');
        currentConversation = null;
    });
    
    overlay.querySelector('.conversation-back').addEventListener('click', () => {
        document.getElementById('message-conversation').classList.remove('active');
        document.getElementById('message-list').classList.remove('hidden');
        renderConversationList();
    });
    
    overlay.querySelector('#message-send-btn').addEventListener('click', () => {
        sendMessage();
    });
    
    document.getElementById('message-input')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Close on background click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
            currentConversation = null;
        }
    });
    
    return overlay;
}

/**
 * Render conversation list
 */
function renderConversationList() {
    const messageList = document.getElementById('message-list');
    if (!messageList) return;
    
    messageList.classList.remove('hidden');
    document.getElementById('message-conversation').classList.remove('active');
    
    if (conversations.length === 0) {
        messageList.innerHTML = '<p style="padding: 2rem; text-align: center; color: var(--text-muted);">No conversations yet. Start messaging to begin!</p>';
        return;
    }
    
    messageList.innerHTML = conversations.map(conv => {
        const lastMessage = conv.messages.length > 0 ? conv.messages[conv.messages.length - 1] : null;
        const preview = lastMessage ? (lastMessage.sent ? 'You: ' : '') + lastMessage.text.substring(0, 40) : 'No messages yet';
        const unreadClass = conv.unread > 0 ? 'unread' : '';
        
        return `
            <div class="message-item ${unreadClass}" data-conversation-id="${conv.id}">
                <div class="message-item-header">
                    <span class="message-sender">${conv.profileName}</span>
                    <span class="message-time">${lastMessage ? formatMessageTime(lastMessage.timestamp) : ''}</span>
                </div>
                <div class="message-preview">${preview}</div>
            </div>
        `;
    }).join('');
    
    // Add click listeners
    messageList.querySelectorAll('.message-item').forEach(item => {
        item.addEventListener('click', () => {
            const convId = parseInt(item.dataset.conversationId);
            const conv = conversations.find(c => c.id === convId);
            if (conv) {
                currentConversation = conv;
                conv.unread = 0;
                showConversation(conv);
            }
        });
    });
    
    updateMessageBadge();
}

/**
 * Show specific conversation
 */
function showConversation(conversation) {
    document.getElementById('message-list').classList.add('hidden');
    document.getElementById('message-conversation').classList.add('active');
    
    document.getElementById('conversation-name').textContent = conversation.profileName;
    
    const container = document.getElementById('messages-container');
    container.innerHTML = conversation.messages.map(msg => `
        <div class="message-bubble ${msg.sent ? 'sent' : 'received'}">
            <div class="message-content">
                ${escapeHtml(msg.text)}
                <div class="message-timestamp">${formatMessageTime(msg.timestamp)}</div>
            </div>
        </div>
    `).join('');
    
    // Scroll to bottom
    setTimeout(() => {
        container.scrollTop = container.scrollHeight;
    }, 0);
    
    // Focus input
    document.getElementById('message-input').focus();
}

/**
 * Send message
 */
function sendMessage() {
    if (!currentConversation) return;
    
    const input = document.getElementById('message-input');
    const text = input.value.trim();
    
    if (text === '') return;
    
    const message = {
        text: text,
        sent: true,
        timestamp: new Date().toISOString()
    };
    
    currentConversation.messages.push(message);
    
    // Simulate received response after a short delay
    setTimeout(() => {
        const responses = [
            'That sounds great! 😊',
            'I totally agree! 👍',
            'Tell me more about that!',
            'That\'s awesome! 🎉',
            'I\'d love to do that sometime!',
            'You\'re right! 💯',
            'Haha, funny! 😂',
            'That\'s so cool!'
        ];
        
        const receivedMessage = {
            text: responses[Math.floor(Math.random() * responses.length)],
            sent: false,
            timestamp: new Date().toISOString()
        };
        
        currentConversation.messages.push(receivedMessage);
        showConversation(currentConversation);
    }, 500 + Math.random() * 1500);
    
    input.value = '';
    input.style.height = 'auto';
    saveConversations();
    showConversation(currentConversation);
}

/**
 * Save conversations to localStorage
 */
function saveConversations() {
    StorageHelper.save('friend-connect-conversations', conversations);
}

/**
 * Update message badge count
 */
function updateMessageBadge() {
    const unreadCount = conversations.reduce((sum, conv) => sum + conv.unread, 0);
    const badge = document.querySelector('.message-badge');
    
    if (badge) {
        if (unreadCount > 0) {
            badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }
}

/**
 * Format message timestamp
 */
function formatMessageTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize messaging on page load
initializeMessaging();