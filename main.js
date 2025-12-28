// Linux-Style Portfolio JavaScript
// Main functionality for terminal, windows, and interactions

// Global state
let currentMode = 'terminal';
let activeWindow = 'terminal';
let commandHistory = [];
let historyIndex = -1;
let windows = {
    terminal: { minimized: false, maximized: false },
    about: { minimized: false, maximized: false },
    skills: { minimized: false, maximized: false },
    projects: { minimized: false, maximized: false },
    experience: { minimized: false, maximized: false },
    contact: { minimized: false, maximized: false }
};

// Particle system for background
let particles = [];
let particleSystem;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTerminal();
    initializeWindows();
    initializeParticleSystem();
    initializeClock();
    initializeAnimations();
    initializeSkillsAnimation();
});

// Terminal functionality
function initializeTerminal() {
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    
    if (!terminalInput || !terminalOutput) return;
    
    terminalInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            processCommand(this.value);
            commandHistory.push(this.value);
            historyIndex = commandHistory.length;
            this.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                this.value = commandHistory[historyIndex] || '';
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                this.value = commandHistory[historyIndex] || '';
            } else {
                historyIndex = commandHistory.length;
                this.value = '';
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            // Auto-complete functionality
            handleAutoComplete(this.value);
        }
    });
    
    // Focus terminal input by default
    terminalInput.focus();
}

function processCommand(command) {
    const terminalOutput = document.getElementById('terminal-output');
    const cleanCommand = command.trim().toLowerCase();
    
    // Add command to output
    const commandLine = document.createElement('div');
    commandLine.className = 'terminal-line';
    commandLine.innerHTML = `<span class="terminal-prompt">kelly@portfolio:~$ </span>${command}`;
    terminalOutput.appendChild(commandLine);
    
    // Process command
    let response = '';
    
    switch(cleanCommand) {
        case '':
            break;
            
        case 'help':
        case '--help':
            response = getHelpText();
            break;
            
        case 'whoami':
            response = 'Kelly Mbeyah - Systems Thinker | Full-Stack Developer | Strategic Leader';
            break;
            
        case 'ls':
            response = 'about/  skills/  projects/  experience/  contact/  resume.pdf';
            break;
            
        case 'ls projects':
        case 'ls /var/projects':
            response = 'twitter-sentiment/  sales-dashboard/  crm-optimization/  qa-framework/';
            break;
            
        case 'ls skills':
        case 'ls /bin/skills':
            response = 'python  r-programming  html5  css3  django  git  aws  powerbi  zoho  postgresql  mysql';
            break;
            
        case 'cat about.txt':
        case 'cat /home/about':
            response = 'Professional with technical expertise and business acumen. Currently pursuing MBA in Strategic Management. Career spans technical roles, sales operations, quality assurance, and communications leadership.';
            break;
            
        case 'open about':
        case 'cd about':
            openWindow('about');
            response = 'Opening About window...';
            break;
            
        case 'open skills':
        case 'cd skills':
            openWindow('skills');
            response = 'Opening Skills window...';
            break;
            
        case 'open projects':
        case 'cd projects':
            openWindow('projects');
            response = 'Opening Projects window...';
            break;
            
        case 'open experience':
        case 'cd experience':
            openWindow('experience');
            response = 'Opening Experience window...';
            break;
            
        case 'open contact':
        case 'cd contact':
            openWindow('contact');
            response = 'Opening Contact window...';
            break;
            
        case 'nano resume.pdf':
        case 'open resume.pdf':
            response = 'Resume download initiated. Check your downloads folder.';
            // Simulate resume download
            setTimeout(() => {
                const link = document.createElement('a');
                link.href = '#';
                link.download = 'Kelly_Mbeyah_Resume.pdf';
                link.click();
            }, 1000);
            break;
            
        case 'sudo hire':
            response = 'Opening hiring contact form...';
            openWindow('contact');
            break;
            
        case 'man experience':
            response = 'EXPERIENCE(1)          User Commands          EXPERIENCE(1)\n\nNAME\n       experience - Display professional experience timeline\n\nSYNOPSIS\n       experience [options]\n\nDESCRIPTION\n       Shows detailed work history with achievements and metrics.\n       Includes roles at Network International, Youth Agenda, Tradco Agency, and Oigetit.';
            break;
            
        case 'clear':
        case 'cls':
            terminalOutput.innerHTML = '';
            return;
            
        case 'history':
            response = commandHistory.map((cmd, i) => `${i + 1}  ${cmd}`).join('\n');
            break;
            
        case 'date':
            response = new Date().toString();
            break;
            
        case 'pwd':
            response = '/home/kelly';
            break;
            
        case 'uname -a':
            response = 'Linux portfolio 5.15.0-generic #1 SMP Professional Portfolio x86_64 GNU/Linux';
            break;
            
        // AI Assistant commands
        case command.match(/^assistant ask/)?.input:
            const question = command.replace(/^assistant ask\s+/i, '');
            response = getAIResponse(question);
            break;
            
        case 'assistant skills':
            response = 'My key strengths include: Systems thinking, technical proficiency in Python and data analysis, business acumen from MBA studies, leadership experience, and a proven track record of delivering measurable results (88% efficiency improvement, 30% engagement boost).';
            break;
            
        case 'assistant why hire':
            response = 'I bring a unique combination of technical expertise and business strategy. With proven results in sales operations (88% efficiency gain), quality assurance, and communications (30% engagement increase), plus strong technical skills in Python, data analysis, and full-stack development, I can deliver both technical solutions and business impact.';
            break;
            
        case 'assistant experience':
            response = 'I have diverse experience across technical and business roles: Currently at Network International as Sales Operations and QA Officer, previously Communications Associate at Youth Agenda, Sales Executive at Tradco Agency, and Communications Lead at Oigetit Fake News Filter. This spans sales operations, quality assurance, communications, and technical project management.';
            break;
            
        default:
            // Natural language processing fallback
            if (cleanCommand.includes('project') || cleanCommand.includes('work')) {
                response = 'Type "open projects" to see my project portfolio, or "open experience" to view my work history.';
            } else if (cleanCommand.includes('skill') || cleanCommand.includes('ability')) {
                response = 'Type "open skills" to see my technical skills and proficiency levels.';
            } else if (cleanCommand.includes('contact') || cleanCommand.includes('hire')) {
                response = 'Type "sudo hire" or "open contact" to access my contact information.';
            } else if (cleanCommand.includes('education') || cleanCommand.includes('school')) {
                response = 'I hold a Bachelor of Science in Computer Science from University of Eldoret and am currently pursuing an MBA in Strategic Management at USIU.';
            } else {
                response = `Command not found: ${command}. Type 'help' for available commands.`;
            }
    }
    
    if (response) {
        const responseLines = response.split('\n');
        responseLines.forEach(line => {
            const responseLine = document.createElement('div');
            responseLine.className = 'terminal-line';
            responseLine.textContent = line;
            terminalOutput.appendChild(responseLine);
        });
    }
    
    // Scroll to bottom
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function getHelpText() {
    return `Available commands:

System Commands:
  help, --help     Show this help message
  whoami           Display user information
  ls               List directory contents
  ls projects      List projects
  ls skills        List technical skills
  cat about.txt    Display about information
  open [module]    Open a module window
  nano resume.pdf  Download resume
  sudo hire        Contact for hiring
  man [command]    Show manual for command
  clear            Clear terminal
  history          Show command history
  date             Show current date
  pwd              Print working directory
  uname -a         System information

AI Assistant:
  assistant ask "question"   Ask a question about me
  assistant skills          Show key strengths
  assistant why hire        Why you should hire me
  assistant experience      Summarize work experience

Navigation:
  open about       Open About window
  open skills      Open Skills window
  open projects    Open Projects window
  open experience  Open Experience window
  open contact     Open Contact window`;
}

function getAIResponse(question) {
    const responses = {
        'strengths': 'My key strengths include: Systems thinking, technical proficiency in Python and data analysis, business acumen from MBA studies, leadership experience, and a proven track record of delivering measurable results.',
        'experience': 'I have diverse experience across Network International (Sales Operations & QA), Youth Agenda (Communications), Tradco Agency (Sales), and Oigetit (Communications Lead).',
        'technical skills': 'I specialize in Python, R, HTML5, CSS3, Django, Git, AWS, Power BI, Zoho CRM, PostgreSQL, and MySQL with expertise in data analysis, machine learning, and full-stack development.',
        'projects': 'My key projects include Twitter Sentiment Analysis (Python/ML), Sales Dashboard Systems (Power BI), CRM Optimization (Zoho), and QA Automation Frameworks.',
        'education': 'I hold a Bachelor of Science in Computer Science from University of Eldoret and am currently pursuing an MBA in Strategic Management at USIU.',
        'hire': 'I bring unique value through my combination of technical expertise and business strategy, with proven results including 88% efficiency improvement and 30% engagement boost.'
    };
    
    // Simple keyword matching for demo
    for (const [key, response] of Object.entries(responses)) {
        if (question.toLowerCase().includes(key)) {
            return response;
        }
    }
    
    return "I'm a professional with expertise in full-stack development, data analysis, sales operations, and strategic management. Feel free to ask about my specific skills, experience, or projects.";
}

function handleAutoComplete(partialCommand) {
    const commands = ['help', 'whoami', 'ls', 'cat', 'open', 'nano', 'sudo', 'man', 'clear', 'history', 'date', 'pwd', 'uname'];
    const matches = commands.filter(cmd => cmd.startsWith(partialCommand));
    
    if (matches.length === 1) {
        document.getElementById('terminal-input').value = matches[0];
    } else if (matches.length > 1) {
        const terminalOutput = document.getElementById('terminal-output');
        const suggestionsLine = document.createElement('div');
        suggestionsLine.className = 'terminal-line';
        suggestionsLine.textContent = matches.join('  ');
        terminalOutput.appendChild(suggestionsLine);
    }
}

// Window management
function initializeWindows() {
    // Make windows draggable
    const windowHeaders = document.querySelectorAll('.window-header');
    windowHeaders.forEach(header => {
        let isDragging = false;
        let currentWindow = header.parentElement;
        let offset = { x: 0, y: 0 };
        
        header.addEventListener('mousedown', function(e) {
            if (e.target.classList.contains('window-control')) return;
            
            isDragging = true;
            currentWindow.style.zIndex = 1000;
            
            const rect = currentWindow.getBoundingClientRect();
            offset.x = e.clientX - rect.left;
            offset.y = e.clientY - rect.top;
            
            header.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            
            const x = e.clientX - offset.x;
            const y = e.clientY - offset.y;
            
            currentWindow.style.left = Math.max(0, Math.min(x, window.innerWidth - currentWindow.offsetWidth)) + 'px';
            currentWindow.style.top = Math.max(0, Math.min(y, window.innerHeight - currentWindow.offsetHeight - 48)) + 'px';
        });
        
        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                header.style.cursor = 'move';
            }
        });
    });
}

function openWindow(windowName) {
    // Close all windows
    Object.keys(windows).forEach(name => {
        const window = document.getElementById(`${name}-window`);
        if (window) {
            window.classList.remove('active');
            window.style.display = 'none';
        }
    });
    
    // Open selected window
    const targetWindow = document.getElementById(`${windowName}-window`);
    if (targetWindow) {
        targetWindow.classList.add('active');
        targetWindow.style.display = 'block';
        targetWindow.style.zIndex = 1000;
        activeWindow = windowName;
    }
    
    // Update taskbar
    updateTaskbar();
    
    // Animate skill bars if opening skills window
    if (windowName === 'skills') {
        setTimeout(animateSkillBars, 100);
    }
}

function closeWindow(windowName) {
    const window = document.getElementById(`${windowName}-window`);
    if (window) {
        window.classList.remove('active');
        window.style.display = 'none';
    }
    
    // If closing active window, switch to terminal
    if (activeWindow === windowName) {
        openWindow('terminal');
    }
    
    updateTaskbar();
}

function minimizeWindow(windowName) {
    const window = document.getElementById(`${windowName}-window`);
    if (window) {
        window.style.display = 'none';
        windows[windowName].minimized = true;
    }
    updateTaskbar();
}

function maximizeWindow(windowName) {
    const window = document.getElementById(`${windowName}-window`);
    if (window) {
        if (windows[windowName].maximized) {
            // Restore
            window.style.width = '';
            window.style.height = '';
            window.style.top = '';
            window.style.left = '';
            windows[windowName].maximized = false;
        } else {
            // Maximize
            window.style.width = '100%';
            window.style.height = 'calc(100vh - 48px)';
            window.style.top = '0';
            window.style.left = '0';
            windows[windowName].maximized = true;
        }
    }
}

function updateTaskbar() {
    const taskbarItems = document.querySelectorAll('.taskbar-item');
    taskbarItems.forEach(item => {
        item.classList.remove('active');
    });
    
    const activeTaskbarItem = document.querySelector(`.taskbar-item[onclick="openWindow('${activeWindow}')"]`);
    if (activeTaskbarItem) {
        activeTaskbarItem.classList.add('active');
    }
}

function toggleStartMenu() {
    // Simple start menu toggle - could be expanded
    const terminal = document.getElementById('terminal-window');
    if (terminal) {
        terminal.classList.add('active');
        terminal.style.display = 'block';
        terminal.style.zIndex = 1000;
        document.getElementById('terminal-input').focus();
    }
}

// Mode switching
function setMode(mode) {
    currentMode = mode;
    
    const modeButtons = document.querySelectorAll('.mode-btn');
    modeButtons.forEach(btn => btn.classList.remove('active'));
    
    if (mode === 'terminal') {
        document.querySelector('.mode-btn[onclick="setMode(\'terminal\')"]').classList.add('active');
        // Show terminal, hide other windows
        Object.keys(windows).forEach(name => {
            if (name !== 'terminal') {
                const window = document.getElementById(`${name}-window`);
                if (window) window.style.display = 'none';
            }
        });
        openWindow('terminal');
    } else {
        document.querySelector('.mode-btn[onclick="setMode(\'gui\')"]').classList.add('active');
        // Show desktop icons and allow window management
        const desktopIcons = document.querySelector('.desktop-icons');
        if (desktopIcons) desktopIcons.style.display = 'flex';
    }
}

// Particle system
function initializeParticleSystem() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    // p5.js sketch for particle system
    new p5(function(p) {
        let particles = [];
        
        p.setup = function() {
            p.createCanvas(p.windowWidth, p.windowHeight);
            p.colorMode(p.HSB, 360, 100, 100, 100);
            
            // Create particles
            for (let i = 0; i < 50; i++) {
                particles.push({
                    x: p.random(p.width),
                    y: p.random(p.height),
                    vx: p.random(-0.5, 0.5),
                    vy: p.random(-0.5, 0.5),
                    size: p.random(2, 6),
                    hue: p.random(200, 240),
                    alpha: p.random(10, 30)
                });
            }
        };
        
        p.draw = function() {
            p.clear();
            
            // Update and draw particles
            particles.forEach(particle => {
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Wrap around edges
                if (particle.x < 0) particle.x = p.width;
                if (particle.x > p.width) particle.x = 0;
                if (particle.y < 0) particle.y = p.height;
                if (particle.y > p.height) particle.y = 0;
                
                // Mouse interaction
                const distance = p.dist(p.mouseX, p.mouseY, particle.x, particle.y);
                if (distance < 100) {
                    particle.vx += (particle.x - p.mouseX) * 0.0001;
                    particle.vy += (particle.y - p.mouseY) * 0.0001;
                }
                
                // Draw particle
                p.fill(particle.hue, 60, 80, particle.alpha);
                p.noStroke();
                p.ellipse(particle.x, particle.y, particle.size);
            });
            
            // Draw connections
            particles.forEach((p1, i) => {
                particles.slice(i + 1).forEach(p2 => {
                    const distance = p.dist(p1.x, p1.y, p2.x, p2.y);
                    if (distance < 150) {
                        p.stroke(220, 30, 60, 20 - distance / 7.5);
                        p.strokeWeight(0.5);
                        p.line(p1.x, p1.y, p2.x, p2.y);
                    }
                });
            });
        };
        
        p.windowResized = function() {
            p.resizeCanvas(p.windowWidth, p.windowHeight);
        };
    }, canvas);
}

// Clock functionality
function initializeClock() {
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const timeElement = document.getElementById('current-time');
        if (timeElement) {
            timeElement.textContent = timeString;
        }
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

// Animations
function initializeAnimations() {
    // Animate elements on scroll or when windows open
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    });
    
    document.querySelectorAll('.window-content').forEach(el => {
        observer.observe(el);
    });
}

function initializeSkillsAnimation() {
    // Initialize skill bars to 0 width
    document.querySelectorAll('.skill-progress').forEach(bar => {
        bar.style.width = '0%';
    });
}

function animateSkillBars() {
    document.querySelectorAll('.skill-progress').forEach(bar => {
        const targetWidth = bar.getAttribute('data-width');
        if (targetWidth) {
            anime({
                targets: bar,
                width: targetWidth + '%',
                duration: 1500,
                easing: 'easeOutQuart',
                delay: anime.stagger(100)
            });
        }
    });
}

// Skills filtering
function filterSkills(category) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
            item.style.display = 'block';
            anime({
                targets: item,
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 300,
                easing: 'easeOutQuart'
            });
        } else {
            anime({
                targets: item,
                opacity: 0,
                translateY: -20,
                duration: 200,
                easing: 'easeInQuart',
                complete: () => {
                    item.style.display = 'none';
                }
            });
        }
    });
    
    // Re-animate visible skill bars
    setTimeout(animateSkillBars, 300);
}

// Project interactions
function openProject(projectId) {
    const projects = {
        sentiment: {
            title: 'Twitter Sentiment Analysis',
            description: 'A comprehensive machine learning system for analyzing Twitter sentiment in real-time.',
            technologies: ['Python', 'Scikit-learn', 'NLTK', 'Twitter API', 'Pandas', 'NumPy'],
            achievements: [
                'Real-time tweet processing and sentiment classification',
                'Achieved 85% accuracy in sentiment prediction',
                'Integrated with Twitter API for live data streaming',
                'Built interactive dashboard for results visualization'
            ]
        },
        dashboard: {
            title: 'Sales Dashboard System',
            description: 'Dynamic sales performance dashboard with forecasting and analytics capabilities.',
            technologies: ['Power BI', 'SQL', 'Excel', 'Data Analysis', 'Forecasting'],
            achievements: [
                '88% improvement in operational efficiency',
                'Real-time sales performance tracking',
                'Automated forecasting models',
                'Enhanced team performance visibility'
            ]
        }
    };
    
    const project = projects[projectId];
    if (project) {
        alert(`${project.title}\n\n${project.description}\n\nTechnologies: ${project.technologies.join(', ')}\n\nKey Achievements:\n${project.achievements.map(a => `• ${a}`).join('\n')}`);
    }
}

// Contact form
function submitContact(event) {
    event.preventDefault();
    
    // Simulate form submission
    const formData = new FormData(event.target);
    const submitBtn = event.target.querySelector('.form-submit');
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        alert('Thank you for your message! I will get back to you soon.');
        event.target.reset();
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
    }, 2000);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl+T: Focus terminal
    if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        const terminalInput = document.getElementById('terminal-input');
        if (terminalInput) {
            terminalInput.focus();
            openWindow('terminal');
        }
    }
    
    // Ctrl+L: Clear terminal
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        const terminalOutput = document.getElementById('terminal-output');
        if (terminalOutput) {
            terminalOutput.innerHTML = '';
        }
    }
    
    // Escape: Close current window
    if (e.key === 'Escape') {
        if (activeWindow !== 'terminal') {
            closeWindow(activeWindow);
        }
    }
});

// Responsive handling
window.addEventListener('resize', function() {
    // Adjust window positions on resize
    Object.keys(windows).forEach(name => {
        const window = document.getElementById(`${name}-window`);
        if (window && window.classList.contains('active')) {
            // Keep windows within viewport
            const rect = window.getBoundingClientRect();
            if (rect.right > window.innerWidth) {
                window.style.left = (window.innerWidth - rect.width) + 'px';
            }
            if (rect.bottom > window.innerHeight - 48) {
                window.style.top = (window.innerHeight - rect.height - 48) + 'px';
            }
        }
    });
});

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add smooth scrolling and performance optimizations
const debouncedResize = debounce(() => {
    // Handle resize events efficiently
}, 250);

window.addEventListener('resize', debouncedResize);

// Initialize everything on load
window.addEventListener('load', function() {
    // Final initialization after all resources load
    console.log('Linux Portfolio v1.0 - Fully Loaded');
    console.log('Type "help" in the terminal for available commands');
});