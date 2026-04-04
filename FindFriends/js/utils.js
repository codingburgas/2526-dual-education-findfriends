/* ============================================
   FRIEND CONNECT - UTILITY & MAPREDUCE FUNCTIONS
   ============================================ */

// ============ MAP-REDUCE OPERATIONS ============

/**
 * MAP Phase: Transform raw user data into profile objects
 * Each user's interests string is split into an array
 */
function mapProfilesToObjects(rawUsers) {
    return rawUsers.map(user => ({
        id: user.id,
        name: user.name,
        age: user.age,
        location: user.location,
        bio: user.bio,
        interests: user.interests.split(", "), // Convert string to array
        image: user.image,
        online: user.online,
        joinDate: new Date(user.joinDate),
        liked: false,
        friendAdded: false
    }));
}

/**
 * FILTER Phase: Extract all unique interests from profiles
 * Using reduce to create a unique set of interests
 */
function extractUniqueInterests(profiles) {
    return profiles.reduce((uniqueInterests, profile) => {
        profile.interests.forEach(interest => {
            if (!uniqueInterests.includes(interest)) {
                uniqueInterests.push(interest);
            }
        });
        return uniqueInterests;
    }, []).sort();
}

/**
 * REDUCE Phase: Filter profiles by age range
 * Using reduce and custom comparator
 */
function filterByAgeRange(profiles, minAge, maxAge) {
    return profiles.filter(profile => 
        profile.age >= minAge && profile.age <= maxAge
    );
}

/**
 * REDUCE Phase: Filter profiles by selected interests
 * A profile matches if it contains ANY of the selected interests
 */
function filterByInterests(profiles, selectedInterests) {
    if (selectedInterests.length === 0) return profiles;
    
    return profiles.filter(profile => {
        return profile.interests.some(interest => 
            selectedInterests.includes(interest)
        );
    });
}

/**
 * REDUCE Phase: Filter profiles by search query
 * Searches in name, bio, location, and interests
 */
function searchProfiles(profiles, query) {
    if (!query || query.trim() === "") return profiles;
    
    const lowerQuery = query.toLowerCase();
    
    return profiles.filter(profile => {
        const matchName = profile.name.toLowerCase().includes(lowerQuery);
        const matchBio = profile.bio.toLowerCase().includes(lowerQuery);
        const matchLocation = profile.location.toLowerCase().includes(lowerQuery);
        const matchInterest = profile.interests.some(interest =>
            interest.toLowerCase().includes(lowerQuery)
        );
        
        return matchName || matchBio || matchLocation || matchInterest;
    });
}

/**
 * SORT Phase: Sort profiles by various criteria
 * Using reduce pattern for complex sorting logic
 */
function sortProfiles(profiles, sortType) {
    const sorted = [...profiles]; // Create a copy to avoid mutation
    
    switch(sortType) {
        case 'age-asc':
            return sorted.sort((a, b) => a.age - b.age);
        
        case 'age-desc':
            return sorted.sort((a, b) => b.age - a.age);
        
        case 'name':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        
        case 'recent':
        default:
            return sorted.sort((a, b) => b.joinDate - a.joinDate);
    }
}

/**
 * REDUCE Phase: Calculate statistics about profiles
 * Using reduce to compute aggregate data
 */
function calculateProfileStats(profiles) {
    return profiles.reduce((stats, profile) => {
        return {
            totalProfiles: stats.totalProfiles + 1,
            averageAge: stats.averageAge + profile.age,
            onlineCount: stats.onlineCount + (profile.online ? 1 : 0),
            offlineCount: stats.offlineCount + (profile.online ? 0 : 1),
            locations: [...new Set([...stats.locations, profile.location])],
            interestFrequency: updateInterestFrequency(stats.interestFrequency, profile.interests)
        };
    }, {
        totalProfiles: 0,
        averageAge: 0,
        onlineCount: 0,
        offlineCount: 0,
        locations: [],
        interestFrequency: {}
    });
}

/**
 * Helper function to track interest frequency
 */
function updateInterestFrequency(frequency, interests) {
    interests.forEach(interest => {
        frequency[interest] = (frequency[interest] || 0) + 1;
    });
    return frequency;
}

/**
 * Combined filtering function using MapReduce pattern
 * Applies all filters and sorting in sequence
 */
function applyAllFilters(profiles, filters) {
    let result = [...profiles];
    
    // Apply age filter
    if (filters.minAge && filters.maxAge) {
        result = filterByAgeRange(result, filters.minAge, filters.maxAge);
    }
    
    // Apply interests filter
    if (filters.interests && filters.interests.length > 0) {
        result = filterByInterests(result, filters.interests);
    }
    
    // Apply search filter
    if (filters.search) {
        result = searchProfiles(result, filters.search);
    }
    
    // Apply sorting
    result = sortProfiles(result, filters.sortType || 'recent');
    
    return result;
}

/**
 * GROUP BY function using Reduce pattern
 * Groups profiles by a specific criterion
 */
function groupProfilesBy(profiles, criterion) {
    return profiles.reduce((groups, profile) => {
        const key = criterion === 'location' ? profile.location :
                    criterion === 'age-range' ? getAgeRange(profile.age) :
                    criterion === 'online' ? (profile.online ? 'Online' : 'Offline') :
                    'Other';
        
        if (!groups[key]) groups[key] = [];
        groups[key].push(profile);
        return groups;
    }, {});
}

/**
 * Helper function to categorize age into ranges
 */
function getAgeRange(age) {
    if (age < 20) return "Under 20";
    if (age < 25) return "20-24";
    if (age < 30) return "25-29";
    return "30+";
}

/**
 * Advanced: Find profiles with most matching interests
 * Using reduce to calculate match scores
 */
function findBestMatches(profiles, userInterests, limit = 5) {
    const scored = profiles.reduce((acc, profile) => {
        const matchCount = profile.interests.filter(interest =>
            userInterests.includes(interest)
        ).length;
        
        if (matchCount > 0) {
            acc.push({
                ...profile,
                matchScore: matchCount,
                matchPercentage: (matchCount / userInterests.length) * 100
            });
        }
        return acc;
    }, []);
    
    return scored
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit);
}

// ============ DOM UTILITY FUNCTIONS ============

/**
 * Format date to readable string
 */
function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Get online status text
 */
function getOnlineStatus(isOnline) {
    return isOnline ? '🟢 Online' : '⚪ Offline';
}

/**
 * Debounce function for search input
 */
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

/**
 * Local storage helper for saving favorites
 */
const StorageHelper = {
    save: (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error('Storage error:', e);
        }
    },
    
    load: (key, defaultValue = []) => {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.error('Storage error:', e);
            return defaultValue;
        }
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Storage error:', e);
        }
    }
};