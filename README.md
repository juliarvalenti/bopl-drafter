# Real-time Bopl Battle Drafting System

This repository contains a real-time drafting system for Bopl Battle built with Socket.IO, Express, and React. The project is split into two main parts:

- **Server:** An Express server (written in TypeScript) using Socket.IO to manage real-time events and enforce a snake-draft sequence for banning and picking abilities.
- **Client:** A React application (built with Vite and TypeScript) that provides the user interface for joining drafting rooms and interacting in real time.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher)
- npm (comes with Node.js) or Yarn

### Running the Server

1. Open a terminal and navigate to the `server` directory:

   ```bash
   cd server
   ```

````

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   npm start
   ```

   By default, the server runs on port `3000` (or the port specified by the `PORT` environment variable).

### Running the Client

1. Open a terminal and navigate to the `client` directory:

   ```bash
   cd client
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   The client application will open in your browser (typically at [http://localhost:3000](http://localhost:3000)).
   **Note:** In the client code (specifically in `draft-room.tsx`), ensure you update `SOCKET_SERVER_URL` with your actual server URL if it’s different from the default.

### Building for Production

#### Server

For the server, you can compile the TypeScript code if necessary (using `tsc` or `ts-node`) or deploy directly with a tool like Heroku that supports TypeScript via `ts-node`.

#### Client

To build the client for production:

```bash
npm run build
```

Then preview the build with:

```bash
npm run preview
```

## Project Overview

This project implements a snake-draft system for real-time drafting. The key features include:

- **Room Management:**
  - Players can join a drafting room using a room ID.
  - The server assigns player roles (e.g., `player1` and `player2`), with a two-player limit.
- **Drafting Logic:**
  - A snake-draft sequence is enforced using a predefined series of phases (bans and picks).
  - The server validates draft actions (ensuring the correct action type and that the correct player is acting) and updates the room state.
- **Real-time Updates:**
  - The server emits room state updates over Socket.IO.
  - The client listens for these updates and renders the current draft state (e.g., banned abilities and picks).
- **User Interface:**
  - A simple lobby for joining/creating rooms.
  - A drafting room view with forms to submit draft actions and a list of available abilities.

## Configuration

- **Server Port:**
  The server listens on port `3000` by default. You can change this by setting the `PORT` environment variable.
- **Socket.IO Server URL:**
  In the client’s `draft-room.tsx`, update `SOCKET_SERVER_URL` to reflect your actual deployment URL (for example, your Heroku app URL).

## Future Improvements

- **Error Handling:** Provide user feedback if a draft action is rejected or if errors occur.
- **User Management:** Define stricter interfaces for user data and handle user reconnections.
- **Persistence:** Consider persisting room states in a database for scalability.
- **Styling:** Enhance the UI with a better design.

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Socket.IO](https://socket.io/)
- [Express](https://expressjs.com/)
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)

```

```
````
