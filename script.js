document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("learnflowUser");
  if (!user) window.location.href = "index.html";
  const nameField = document.getElementById("username-display");
  if (nameField) nameField.textContent = user;
});

function logoutUser() {
  localStorage.removeItem("learnflowUser");
  window.location.href = "index.html";
}

let currentSession = null;
let sessionTimer = 0;
let timerInterval = null;
let fatigueLevel = 25;
let fatigueInterval = null;

// Sample data
const topicRecommendations = [
    {
        id: '1',
        title: 'React Hooks Fundamentals',
        category: 'Frontend Development',
        difficulty: 'medium',
        estimatedTime: '45 min',
        mastery: 65,
        priority: 'high',
        reason: 'Based on your current React progress'
    },
    {
        id: '2',
        title: 'CSS Grid Layout',
        category: 'Web Design',
        difficulty: 'easy',
        estimatedTime: '30 min',
        mastery: 40,
        priority: 'high',
        reason: 'Weak area identified - needs improvement'
    },
    {
        id: '3',
        title: 'TypeScript Generics',
        category: 'Programming',
        difficulty: 'hard',
        estimatedTime: '60 min',
        mastery: 25,
        priority: 'medium',
        reason: 'Next logical step in your learning path'
    },
    {
        id: '4',
        title: 'API Integration Patterns',
        category: 'Backend',
        difficulty: 'medium',
        estimatedTime: '40 min',
        mastery: 80,
        priority: 'low',
        reason: 'Quick review to maintain mastery'
    }
];

const learningFlow = [
    {
        id: '1',
        title: 'HTML Fundamentals',
        status: 'completed',
        duration: '2h 30m',
        mastery: 95
    },
    {
        id: '2',
        title: 'CSS Basics',
        status: 'completed',
        duration: '3h 15m',
        mastery: 88
    },
    {
        id: '3',
        title: 'JavaScript Essentials',
        status: 'completed',
        duration: '5h 45m',
        mastery: 82
    },
    {
        id: '4',
        title: 'React Introduction',
        status: 'current',
        duration: '4h 20m',
        mastery: 65
    },
    {
        id: '5',
        title: 'React Hooks',
        status: 'upcoming',
        duration: '3h 30m'
    },
    {
        id: '6',
        title: 'State Management',
        status: 'upcoming',
        duration: '4h 15m'
    },
    {
        id: '7',
        title: 'TypeScript Basics',
        status: 'upcoming',
        duration: '3h 45m'
    },
    {
        id: '8',
        title: 'Advanced React',
        status: 'locked',
        duration: '6h 20m'
    }
];

let recentSessions = [
    {
        id: '1',
        topic: 'JavaScript Fundamentals',
        duration: 2340,
        startTime: new Date(Date.now() - 3600000),
        focusScore: 87
    },
    {
        id: '2',
        topic: 'React Components',
        duration: 1890,
        startTime: new Date(Date.now() - 7200000),
        focusScore: 92
    },
    {
        id: '3',
        topic: 'CSS Grid Layout',
        duration: 1560,
        startTime: new Date(Date.now() - 10800000),
        focusScore: 78
    }
];

// Utility functions
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function getPriorityIcon(priority) {
    switch (priority) {
        case 'high': return 'fas fa-bolt';
        case 'medium': return 'fas fa-star';
        case 'low': return 'fas fa-clock';
        default: return 'fas fa-brain';
    }
}

function getFlowIcon(status) {
    switch (status) {
        case 'completed': return 'fas fa-check-circle';
        case 'current': return 'fas fa-play-circle';
        case 'upcoming': return 'far fa-circle';
        case 'locked': return 'fas fa-lock';
        default: return 'far fa-circle';
    }
}

// Topic Recommendations
function renderRecommendations() {
    const container = document.getElementById('recommendations-list');
    container.innerHTML = '';

    topicRecommendations.forEach(topic => {
        const item = document.createElement('div');
        item.className = 'recommendation-item';
        item.innerHTML = `
            <div class="recommendation-header">
                <i class="${getPriorityIcon(topic.priority)} priority-icon ${topic.priority}"></i>
                <div class="recommendation-title">${topic.title}</div>
                <span class="difficulty-badge ${topic.difficulty}">${topic.difficulty.charAt(0).toUpperCase() + topic.difficulty.slice(1)}</span>
            </div>
            <div class="recommendation-category">${topic.category}</div>
            <div class="recommendation-reason">${topic.reason}</div>
            <div class="recommendation-footer">
                <div class="recommendation-meta">
                    <div class="meta-item">
                        <i class="fas fa-clock"></i>
                        <span>${topic.estimatedTime}</span>
                    </div>
                    <div class="mastery-display">
                        <span>Mastery: ${topic.mastery}%</span>
                        <div class="mastery-bar">
                            <div class="mastery-progress" style="width: ${topic.mastery}%"></div>
                        </div>
                    </div>
                </div>
                <button class="start-learning-btn" onclick="startLearningTopic('${topic.id}')">
                    <span>Start Learning</span>
                    <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        `;
        container.appendChild(item);
    });
}

function startLearningTopic(topicId) {
    const topic = topicRecommendations.find(t => t.id === topicId);
    if (topic) {
        startSession(topic.title);
    }
}

function refreshRecommendations() {
    // Simulate refreshing recommendations
    const button = document.querySelector('.refresh-btn');
    const originalText = button.textContent;
    button.innerHTML = '<i class="loading-spinner"></i> Refreshing...';
    
    setTimeout(() => {
        button.textContent = originalText;
        // Shuffle recommendations for demo
        topicRecommendations.sort(() => Math.random() - 0.5);
        renderRecommendations();
    }, 2000);
}

// Learning Flow Chart
function renderLearningFlow() {
    const container = document.getElementById('flow-chart');
    container.innerHTML = '';

    learningFlow.forEach((node, index) => {
        const item = document.createElement('div');
        item.className = `flow-node ${node.status}`;
        
        let masterySection = '';
        if (node.mastery !== undefined) {
            masterySection = `
                <div class="flow-mastery">
                    <div class="flow-mastery-header">
                        <span>Mastery</span>
                        <span>${node.mastery}%</span>
                    </div>
                    <div class="flow-mastery-bar">
                        <div class="flow-mastery-progress ${node.status}" style="width: ${node.mastery}%"></div>
                    </div>
                </div>
            `;
        }

        let actionButton = '';
        if (node.status === 'current') {
            actionButton = '<button class="continue-btn">Continue</button>';
        }

        item.innerHTML = `
            <i class="${getFlowIcon(node.status)} flow-icon ${node.status}"></i>
            <div class="flow-content">
                <div class="flow-title">${node.title}</div>
                <div class="flow-duration">
                    <i class="fas fa-clock"></i>
                    <span>${node.duration}</span>
                </div>
                ${masterySection}
            </div>
            ${actionButton}
        `;
        
        container.appendChild(item);
    });
}

// Fatigue Monitor
function updateFatigueMonitor() {
    const icon = document.getElementById('fatigue-icon');
    const state = document.getElementById('fatigue-state');
    const progress = document.getElementById('fatigue-progress');
    const message = document.getElementById('fatigue-message');
    const action = document.getElementById('fatigue-action');

    let status, config;
    
    if (fatigueLevel < 30) {
        status = 'optimal';
        config = {
            state: 'Optimal',
            message: 'Perfect focus level - continue learning',
            action: 'Keep going!'
        };
    } else if (fatigueLevel < 60) {
        status = 'moderate';
        config = {
            state: 'Moderate',
            message: 'Good focus - consider easier topics',
            action: 'Switch to review'
        };
    } else if (fatigueLevel < 80) {
        status = 'high';
        config = {
            state: 'High',
            message: 'Fatigue detected - take a short break',
            action: 'Break recommended'
        };
    } else {
        status = 'critical';
        config = {
            state: 'Critical',
            message: 'High fatigue - rest is needed',
            action: 'Take a break!'
        };
    }

    // Update icon
    icon.className = `fatigue-icon ${status}`;
    icon.innerHTML = status === 'optimal' ? '<i class="fas fa-check-circle"></i>' :
                     status === 'moderate' ? '<i class="fas fa-battery-half"></i>' :
                     status === 'high' ? '<i class="fas fa-exclamation-triangle"></i>' :
                     '<i class="fas fa-coffee"></i>';

    // Update state
    state.textContent = config.state;
    state.className = `state-${status}`;

    // Update progress bar
    progress.style.width = `${fatigueLevel}%`;
    progress.className = `fatigue-progress ${status}`;

    // Update message and action
    message.textContent = config.message;
    action.textContent = config.action;
    action.className = `action-btn ${status}`;
}

function simulateFatigueChanges() {
    fatigueInterval = setInterval(() => {
        fatigueLevel += (Math.random() * 4) - 2;
        fatigueLevel = Math.max(0, Math.min(100, fatigueLevel));
        updateFatigueMonitor();
    }, 3000);
}

// Session Logger
function startSession(topicName = 'New Learning Session') {
    if (currentSession) return;

    currentSession = {
        id: Date.now().toString(),
        topic: topicName,
        startTime: new Date(),
        status: 'recording'
    };

    sessionTimer = 0;
    updateSessionDisplay();
    
    document.getElementById('no-session').style.display = 'none';
    document.getElementById('active-session').style.display = 'block';
    
    startTimer();
}

function pauseSession() {
    if (!currentSession) return;
    
    currentSession.status = 'paused';
    stopTimer();
    updateSessionDisplay();
}

function resumeSession() {
    if (!currentSession) return;
    
    currentSession.status = 'recording';
    startTimer();
    updateSessionDisplay();
}

function stopSession() {
    if (!currentSession) return;

    const completedSession = {
        id: currentSession.id,
        topic: currentSession.topic,
        duration: sessionTimer,
        startTime: currentSession.startTime,
        focusScore: Math.floor(Math.random() * 30) + 70
    };

    recentSessions.unshift(completedSession);
    recentSessions = recentSessions.slice(0, 5);

    currentSession = null;
    sessionTimer = 0;
    stopTimer();

    document.getElementById('active-session').style.display = 'none';
    document.getElementById('no-session').style.display = 'block';
    
    renderRecentSessions();
}

function startTimer() {
    timerInterval = setInterval(() => {
        sessionTimer++;
        updateTimerDisplay();
        updateSessionDuration();
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateTimerDisplay() {
    document.getElementById('timer').textContent = formatTime(sessionTimer);
}

function updateSessionDuration() {
    const hours = Math.floor(sessionTimer / 3600);
    const minutes = Math.floor((sessionTimer % 3600) / 60);
    let duration = '';
    
    if (hours > 0) {
        duration = `${hours}h ${minutes}m`;
    } else {
        duration = `${minutes}m`;
    }
    
    document.getElementById('session-duration').textContent = duration;
}

function updateSessionDisplay() {
    if (!currentSession) return;

    document.getElementById('current-topic').textContent = currentSession.topic;
    document.getElementById('start-time').textContent = currentSession.startTime.toLocaleTimeString();
    
    const statusElement = document.getElementById('session-status');
    statusElement.textContent = currentSession.status === 'recording' ? 'Recording' : 'Paused';
    statusElement.className = `session-status ${currentSession.status}`;

    const pauseBtn = document.getElementById('pause-btn');
    if (currentSession.status === 'recording') {
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i><span>Pause</span>';
        pauseBtn.className = 'control-btn pause';
        pauseBtn.onclick = pauseSession;
    } else {
        pauseBtn.innerHTML = '<i class="fas fa-play"></i><span>Resume</span>';
        pauseBtn.className = 'control-btn resume';
        pauseBtn.onclick = resumeSession;
    }
}

function renderRecentSessions() {
    const container = document.getElementById('recent-sessions-list');
    container.innerHTML = '';

    recentSessions.forEach(session => {
        const item = document.createElement('div');
        item.className = 'session-item';
        item.innerHTML = `
            <div class="session-item-content">
                <h5>${session.topic}</h5>
                <p>${session.startTime.toLocaleDateString()} at ${session.startTime.toLocaleTimeString()}</p>
            </div>
            <div class="session-item-stats">
                <div class="session-duration">${formatTime(session.duration)}</div>
                <div class="session-focus">
                    <i class="fas fa-trending-up"></i>
                    <span>${session.focusScore}%</span>
                </div>
            </div>
        `;
        container.appendChild(item);
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    renderRecommendations();
    renderLearningFlow();
    renderRecentSessions();
    updateFatigueMonitor();
    simulateFatigueChanges();

    // Session logger event listeners
    document.getElementById('start-session-btn').addEventListener('click', () => {
        startSession('React Hooks Deep Dive');
    });

    document.getElementById('stop-btn').addEventListener('click', stopSession);

    // Simulate real-time updates
    setInterval(() => {
        // Update study time
        const studyTimeElement = document.getElementById('study-time');
        const currentTime = studyTimeElement.textContent;
        const [hours, minutes] = currentTime.split('h ');
        const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
        const newTotalMinutes = totalMinutes + 1;
        const newHours = Math.floor(newTotalMinutes / 60);
        const newMinutes = newTotalMinutes % 60;
        studyTimeElement.textContent = `${newHours}h ${newMinutes}m`;
    }, 60000); // Update every minute

    // Simulate focus score changes
    setInterval(() => {
        const focusElement = document.getElementById('focus-score');
        const currentScore = parseInt(focusElement.textContent);
        const change = Math.floor(Math.random() * 6) - 3; // -3 to +3
        const newScore = Math.max(0, Math.min(100, currentScore + change));
        focusElement.textContent = `${newScore}%`;
    }, 30000); // Update every 30 seconds
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (fatigueInterval) {
        clearInterval(fatigueInterval);
    }
    if (timerInterval) {
        clearInterval(timerInterval);
    }
});