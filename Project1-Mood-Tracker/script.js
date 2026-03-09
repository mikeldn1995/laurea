// ========================================
// MoodFlow — Script
// Mood & Activity Tracker
// ========================================

// --- DOM References ---
const form = document.getElementById('mood-form')
const moodButtons = document.querySelectorAll('.mood-btn')
const activitiesInput = document.getElementById('activities')
const charCount = document.getElementById('char-count')
const saveBtn = document.getElementById('save-btn')
const moodError = document.getElementById('mood-error')
const historyList = document.getElementById('history-list')
const emptyState = document.getElementById('empty-state')
const moodFilter = document.getElementById('mood-filter')
const searchInput = document.getElementById('search-input')
const clearAllBtn = document.getElementById('clear-all-btn')
const darkModeToggle = document.getElementById('dark-mode-toggle')

// Stats DOM
const totalEntriesEl = document.getElementById('total-entries')
const topMoodEl = document.getElementById('top-mood')
const weeklyAvgEl = document.getElementById('weekly-avg')
const currentStreakEl = document.getElementById('current-streak')
const chartBars = document.getElementById('chart-bars')

// --- State ---
let selectedMood = null
let entries = []

// --- Valid moods (allow-list for security) ---
const VALID_MOODS = ['amazing', 'happy', 'neutral', 'sad', 'awful']

// --- Mood icon map for Lucide ---
const moodIcons = {
    amazing: 'sparkles',
    happy: 'smile',
    neutral: 'meh',
    sad: 'frown',
    awful: 'cloud-rain'
}

// --- Initialise ---
function init() {
    loadEntries()
    initDarkMode()
    renderHistory()
    updateStats()
    lucide.createIcons()
}

// ========================================
// LOCAL STORAGE — Safe Read/Write
// ========================================

// Load entries from localStorage with error handling
function loadEntries() {
    try {
        const raw = localStorage.getItem('moodflow-entries')
        if (raw) {
            const parsed = JSON.parse(raw)
            // Validate data shape
            if (Array.isArray(parsed)) {
                entries = parsed.filter(entry =>
                    entry &&
                    typeof entry.mood === 'string' &&
                    VALID_MOODS.includes(entry.mood) &&
                    typeof entry.date === 'string' &&
                    Array.isArray(entry.activities)
                )
            }
        }
    } catch (error) {
        console.error('Failed to load entries:', error)
        entries = []
    }
}

// Save entries to localStorage safely
function saveEntries() {
    try {
        localStorage.setItem('moodflow-entries', JSON.stringify(entries))
    } catch (error) {
        console.error('Failed to save entries:', error)
    }
}

// ========================================
// DARK MODE
// ========================================

function initDarkMode() {
    // Check saved preference first, then system preference
    const saved = localStorage.getItem('moodflow-darkmode')
    if (saved !== null) {
        toggleDarkClass(saved === 'true')
    } else {
        // Auto-detect system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        toggleDarkClass(prefersDark)
    }
}

function toggleDarkClass(isDark) {
    document.documentElement.classList.toggle('dark', isDark)
}

darkModeToggle.addEventListener('click', function () {
    const isDark = document.documentElement.classList.toggle('dark')
    localStorage.setItem('moodflow-darkmode', isDark)
})

// Listen for system preference changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    // Only auto-switch if user has no saved preference
    if (localStorage.getItem('moodflow-darkmode') === null) {
        toggleDarkClass(e.matches)
    }
})

// ========================================
// MOOD SELECTION
// ========================================

moodButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
        // Deselect all
        moodButtons.forEach(function (b) {
            b.classList.remove('selected')
            b.setAttribute('aria-pressed', 'false')
        })
        // Select clicked
        btn.classList.add('selected')
        btn.setAttribute('aria-pressed', 'true')
        selectedMood = btn.dataset.mood
        moodError.hidden = true
    })
})

// ========================================
// CHARACTER COUNT
// ========================================

activitiesInput.addEventListener('input', function () {
    charCount.textContent = activitiesInput.value.length
})

// ========================================
// FORM SUBMISSION
// ========================================

form.addEventListener('submit', function (event) {
    event.preventDefault()

    // Validate mood selection
    if (!selectedMood) {
        moodError.hidden = false
        moodButtons[0].focus()
        return
    }

    // Parse activities (one per line, max 3, trim and filter empty)
    const rawLines = activitiesInput.value.split('\n')
    const activities = rawLines
        .map(function (line) { return sanitise(line.trim()) })
        .filter(function (line) { return line.length > 0 })
        .slice(0, 3)

    // Create entry
    const entry = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        mood: selectedMood,
        activities: activities,
        date: new Date().toISOString()
    }

    // Add to beginning of array (newest first)
    entries.unshift(entry)
    saveEntries()

    // Reset form
    selectedMood = null
    moodButtons.forEach(function (b) {
        b.classList.remove('selected')
        b.setAttribute('aria-pressed', 'false')
    })
    activitiesInput.value = ''
    charCount.textContent = '0'

    // Button success feedback
    saveBtn.classList.add('saved')
    saveBtn.querySelector('span').textContent = 'Saved!'
    setTimeout(function () {
        saveBtn.classList.remove('saved')
        saveBtn.querySelector('span').textContent = 'Save Entry'
    }, 1500)

    // Update UI
    renderHistory()
    updateStats()
})

// ========================================
// SANITISE — Prevent XSS
// ========================================

function sanitise(str) {
    const div = document.createElement('div')
    div.textContent = str
    return div.innerHTML
}

// ========================================
// RENDER HISTORY
// ========================================

function renderHistory() {
    const filterMood = moodFilter.value
    const searchTerm = searchInput.value.toLowerCase().trim()

    // Filter entries
    const filtered = entries.filter(function (entry) {
        const matchesMood = filterMood === 'all' || entry.mood === filterMood
        const matchesSearch = searchTerm === '' || entry.activities.some(function (act) {
            return act.toLowerCase().includes(searchTerm)
        })
        return matchesMood && matchesSearch
    })

    // Clear list
    historyList.innerHTML = ''

    if (filtered.length === 0) {
        // Show empty state
        const emptyDiv = document.createElement('div')
        emptyDiv.className = 'empty-state'
        emptyDiv.innerHTML = '<p>' + (entries.length === 0 ? 'No entries yet. Start tracking your mood!' : 'No matching entries found.') + '</p>'
        historyList.appendChild(emptyDiv)
        lucide.createIcons({ nodes: [historyList] })
        return
    }

    // Render each entry
    filtered.forEach(function (entry) {
        const item = createEntryElement(entry)
        historyList.appendChild(item)
    })

    // Initialise Lucide icons in new elements
    lucide.createIcons({ nodes: [historyList] })
}

function createEntryElement(entry) {
    const item = document.createElement('div')
    item.className = 'entry-item'
    item.setAttribute('role', 'listitem')
    item.dataset.id = entry.id

    const dateObj = new Date(entry.date)
    const dateStr = dateObj.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
    const timeStr = dateObj.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
    })

    const iconName = moodIcons[entry.mood] || 'meh'

    const activitiesHtml = entry.activities.length > 0
        ? entry.activities.map(function (act) { return '<span>' + act + '</span>' }).join('')
        : '<span class="no-activities">No activities recorded</span>'

    item.innerHTML =
        '<div class="entry-mood-icon" data-mood="' + entry.mood + '">' +
            '<i data-lucide="' + iconName + '"></i>' +
        '</div>' +
        '<div class="entry-body">' +
            '<div class="entry-meta">' +
                '<span class="entry-mood-label">' + entry.mood + '</span>' +
                '<span class="entry-date">' + dateStr + ' at ' + timeStr + '</span>' +
            '</div>' +
            '<div class="entry-activities">' + activitiesHtml + '</div>' +
        '</div>' +
        '<button class="entry-delete" aria-label="Delete entry from ' + dateStr + '" title="Delete entry">' +
            '<i data-lucide="x"></i>' +
        '</button>'

    return item
}

// ========================================
// DELETE ENTRY (Event Delegation)
// ========================================

historyList.addEventListener('click', function (event) {
    const deleteBtn = event.target.closest('.entry-delete')
    if (!deleteBtn) return

    const item = deleteBtn.closest('.entry-item')
    const id = item.dataset.id

    // Animate out
    item.classList.add('removing')
    item.addEventListener('animationend', function () {
        // Remove from data
        entries = entries.filter(function (e) { return e.id !== id })
        saveEntries()
        renderHistory()
        updateStats()
    })
})

// ========================================
// FILTER & SEARCH
// ========================================

moodFilter.addEventListener('change', function () {
    renderHistory()
})

// Debounce search for performance
let searchTimeout = null
searchInput.addEventListener('input', function () {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(function () {
        renderHistory()
    }, 200)
})

// ========================================
// CLEAR ALL (Page 2 Extension)
// ========================================

clearAllBtn.addEventListener('click', function () {
    if (entries.length === 0) return

    const confirmed = confirm('Are you sure you want to delete all ' + entries.length + ' entries? This cannot be undone.')
    if (!confirmed) return

    entries = []
    saveEntries()
    renderHistory()
    updateStats()
})

// ========================================
// STATS
// ========================================

function updateStats() {
    // Total entries
    totalEntriesEl.textContent = entries.length

    // Most frequent mood
    if (entries.length > 0) {
        const moodCounts = countMoods()
        const topMood = Object.keys(moodCounts).reduce(function (a, b) {
            return moodCounts[a] > moodCounts[b] ? a : b
        })
        topMoodEl.textContent = capitalise(topMood)
    } else {
        topMoodEl.textContent = '—'
    }

    // Weekly average (entries per week over last 30 days)
    weeklyAvgEl.textContent = calcWeeklyAvg()

    // Current streak
    currentStreakEl.textContent = calcStreak()

    // Update chart
    renderChart()
}

function countMoods() {
    const counts = { amazing: 0, happy: 0, neutral: 0, sad: 0, awful: 0 }
    entries.forEach(function (entry) {
        if (counts.hasOwnProperty(entry.mood)) {
            counts[entry.mood]++
        }
    })
    return counts
}

function calcWeeklyAvg() {
    if (entries.length === 0) return '—'

    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const recentCount = entries.filter(function (e) {
        return new Date(e.date) >= sevenDaysAgo
    }).length

    return recentCount > 0 ? recentCount.toFixed(1) : '0'
}

function calcStreak() {
    if (entries.length === 0) return 0

    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Check each day going backwards
    for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today)
        checkDate.setDate(checkDate.getDate() - i)
        const dateStr = checkDate.toISOString().slice(0, 10)

        const hasEntry = entries.some(function (e) {
            return e.date.slice(0, 10) === dateStr
        })

        if (hasEntry) {
            streak++
        } else if (i === 0) {
            // If no entry today, that's OK — check yesterday
            continue
        } else {
            break
        }
    }

    return streak
}

// ========================================
// MOOD CHART (Bar Chart)
// ========================================

function renderChart() {
    const counts = countMoods()
    const maxCount = Math.max(1, ...Object.values(counts))

    chartBars.innerHTML = ''

    const moods = ['amazing', 'happy', 'neutral', 'sad', 'awful']

    moods.forEach(function (mood) {
        const count = counts[mood]
        const pct = (count / maxCount) * 100

        const row = document.createElement('div')
        row.className = 'chart-row'
        row.innerHTML =
            '<span class="chart-label">' + capitalise(mood) + '</span>' +
            '<div class="chart-bar-bg">' +
                '<div class="chart-bar-fill" data-mood="' + mood + '" style="width: ' + pct + '%"></div>' +
            '</div>' +
            '<span class="chart-count">' + count + '</span>'

        chartBars.appendChild(row)
    })
}

// ========================================
// HELPERS
// ========================================

function capitalise(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

// ========================================
// START
// ========================================

init()
