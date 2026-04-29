const candidates = [
    { id: 1, name: 'Jonathan Reeves', party: 'Progressive Alliance', img: './candidate1.png' },
    { id: 2, name: 'Elena Rodriguez', party: 'Unity Democrats', img: './candidate2.png' },
    { id: 3, name: 'Marcus Chen', party: 'Forward Vision', img: './candidate3.png' }
];

let selectedCandidateId = null;
let stream = null;

// DOM Elements
const screens = {
    landing: document.getElementById('landing-screen'),
    scan: document.getElementById('scan-screen'),
    voting: document.getElementById('voting-screen'),
    success: document.getElementById('success-screen')
};

const startBtn = document.getElementById('start-btn');
const verifyBtn = document.getElementById('verify-btn');
const submitVoteBtn = document.getElementById('submit-vote-btn');
const webcam = document.getElementById('webcam');
const scanStatus = document.getElementById('scan-status');
const scanLine = document.querySelector('.scan-line');
const candidatesGrid = document.querySelector('.candidates-grid');

// Navigation
function showScreen(screenKey) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenKey].classList.add('active');
}

// Initialize Landing
startBtn.addEventListener('click', async () => {
    showScreen('scan');
    await startWebcam();
});

// Webcam Logic
async function startWebcam() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: 'user',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            } 
        });
        webcam.srcObject = stream;
        
        scanStatus.textContent = 'Position your face in the center';
        
        // Simulate face detection delay
        setTimeout(() => {
            scanLine.style.display = 'block';
            scanStatus.textContent = 'Scanning face...';
            
            setTimeout(() => {
                scanStatus.textContent = 'Identity Verified';
                scanStatus.style.color = '#10b981';
                verifyBtn.disabled = false;
            }, 3000);
        }, 1000);

    } catch (err) {
        console.error("Webcam Error: ", err);
        scanStatus.textContent = 'Camera access denied. Please enable camera.';
        scanStatus.style.color = '#ef4444';
    }
}

function stopWebcam() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
}

// Verification Complete
verifyBtn.addEventListener('click', () => {
    stopWebcam();
    showScreen('voting');
    renderCandidates();
});

// Rendering Candidates
function renderCandidates() {
    candidatesGrid.innerHTML = '';
    candidates.forEach(candidate => {
        const card = document.createElement('div');
        card.className = 'candidate-card';
        card.innerHTML = `
            <img src="${candidate.img}" alt="${candidate.name}" class="candidate-img">
            <div class="candidate-name">${candidate.name}</div>
            <div class="candidate-party">${candidate.party}</div>
        `;
        
        card.addEventListener('click', () => {
            document.querySelectorAll('.candidate-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedCandidateId = candidate.id;
            submitVoteBtn.disabled = false;
        });
        
        candidatesGrid.appendChild(card);
    });
}

// Submit Vote
submitVoteBtn.addEventListener('click', () => {
    if (!selectedCandidateId) return;
    
    // Final confirmation simulation
    if (confirm("Are you sure you want to cast your vote? This action cannot be undone.")) {
        showScreen('success');
        generateReceipt();
    }
});

function generateReceipt() {
    const receiptId = 'SV-' + Math.random().toString(36).substr(2, 4).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
    const timestamp = new Date().toLocaleString();
    
    document.getElementById('receipt-id').textContent = receiptId;
    document.getElementById('timestamp').textContent = timestamp;
}

// Timer Simulation
let timeLeft = 300; // 5 minutes
const timerDisplay = document.querySelector('.timer');

setInterval(() => {
    if (screens.voting.classList.contains('active') && timeLeft > 0) {
        timeLeft--;
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        
        if (timeLeft === 0) {
            alert("Session expired. Please restart.");
            window.location.reload();
        }
    }
}, 1000);
