document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const canvas = document.getElementById('whiteboard');
    const clearBtn = document.getElementById('clearBtn');
    const sessionLinkInput = document.getElementById('sessionLink');
    const copyBtn = document.getElementById('copyBtn');

    // Set up canvas
    const ctx = canvas.getContext('2d');
    let isDrawing = false;

    // Set canvas size to match container
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    // Initial resize and add event listener for window resize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Extract session ID from URL
    const pathParts = window.location.pathname.split('/');
    let sessionId = pathParts[pathParts.length - 1];

    // If we're at /board/ with no session ID, redirect to home
    if (pathParts.length >= 2 && pathParts[pathParts.length - 2] === 'board' && !sessionId) {
        window.location.href = window.location.origin;
        return;
    }

    // Set and display session link with the full session ID
    const sessionLink = `${window.location.origin}/board/${sessionId}`;
    sessionLinkInput.value = sessionLink;

    // Initialize Socket.IO connection
    const socket = io({
        transports: ['polling', 'websocket'],
        upgrade: true,
        rememberUpgrade: true,
        forceNew: true
    });

  // Debug connection status
  socket.on('connect', () => {
    console.log('Connected to server');
  });
  
  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });
  
  socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
  });

  // Join the session
  socket.emit('joinSession', sessionId);

    // Drawing functions
    function startDrawing(e) {
        isDrawing = true;
        // Reset previous position when starting a new line
        prevX = null;
        prevY = null;
        draw(e);
    }

    function stopDrawing() {
        isDrawing = false;
        prevX = null;
        prevY = null;
        ctx.beginPath(); // Reset the path
    }

    // Track previous position for smoother lines
    let prevX = null;
    let prevY = null;

    function draw(e) {
        if (!isDrawing) return;

        // Get mouse position relative to canvas
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        // Draw line
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#000';

        if (prevX !== null && prevY !== null) {
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(x, y);
            ctx.stroke();
        } else {
            // For the first point in a stroke
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // Throttle the emit rate to avoid overwhelming the server
        const now = Date.now();
        if (now - lastEmitTime > emitThrottle) {
            // Send drawing data to server
            socket.emit('draw', {
                x,
                y,
                prevX,
                prevY,
                drawing: true
            });
            lastEmitTime = now;
        }

        prevX = x;
        prevY = y;
    }

    // Event listeners for drawing
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Touch support for mobile devices
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startDrawing(e);
    });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        draw(e);
    });

    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        stopDrawing();
    });

    // Clear canvas button
    clearBtn.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        socket.emit('clearCanvas');
    });

    // Copy session link button
    copyBtn.addEventListener('click', () => {
        sessionLinkInput.select();
        document.execCommand('copy');
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = 'Copy';
        }, 2000);
    });

    // Socket.IO event handlers
    // Store drawing data from other users
    const userPaths = new Map();

    socket.on('draw', (data) => {
        if (!data.drawing) return;

        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#000';

        if (data.prevX !== null && data.prevY !== null) {
            ctx.beginPath();
            ctx.moveTo(data.prevX, data.prevY);
            ctx.lineTo(data.x, data.y);
            ctx.stroke();
        } else {
            // For single points (start of a line)
            ctx.beginPath();
            ctx.arc(data.x, data.y, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    // Handle mousemove events more frequently for smoother lines
    let lastEmitTime = 0;
    const emitThrottle = 10; // ms between emissions

    socket.on('clearCanvas', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
});