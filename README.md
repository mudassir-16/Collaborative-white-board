# Collaborative Whiteboard

A real-time collaborative whiteboard application that allows multiple users to draw together on a shared canvas.

## Features

- **Shared Session**: All users joining the same session see updates instantly
- **Auto-generated Session Links**: Each board has a unique URL (e.g., `/board/abc123`)
- **Basic Drawing Tools**: Simple pencil tool for drawing
- **Real-Time Sync**: Actions are broadcast instantly to all connected users
- **Multi-User Support**: 2-10 people can collaborate simultaneously

## Architecture

### Frontend
- HTML Canvas API for drawing
- Event listeners to capture drawing actions
- Socket.IO for WebSocket communication

### Backend
- Node.js with Express for the web server
- Socket.IO for real-time communication
- In-memory session management (no database for MVP)

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm start
   ```
4. Open your browser and navigate to `http://localhost:3000`

## Usage

1. When you open the application, a new board session is automatically created
2. Share the generated link with others to collaborate
3. Draw on the canvas using your mouse or touch device
4. Use the "Clear Canvas" button to erase everything

## Tech Stack

- **Transport**: Socket.IO
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express

## Future Enhancements

- Multiple colors & brush sizes
- Persistent storage (Firebase, MongoDB)
- Real-time text editor mode
- User cursors & avatars
- Undo/redo actions