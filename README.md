# FitCommunity

FitCommunity is a platform designed for fitness enthusiasts to track workouts, participate in challenges, and stay motivated between weekly meetups. It helps workout groups maintain accountability and motivation throughout the week by providing tools for workout verification, challenges, and community engagement.

## Features

- **Verified Workouts**: Log workouts with photo/video verification so your group knows you're staying consistent.
- **Group Challenges**: Create one-on-one or group challenges with your workout buddies to maintain motivation.
- **Workout Reminders**: Set custom reminders to keep your workout schedule on track between group sessions.
- **Tips & Tricks**: Exchange fitness advice, nutrition tips, and motivation with your community.
- **Leaderboards**: Climb challenge-specific and global leaderboards to fuel friendly competition.
- **Community Support**: Build accountability and support through a close-knit community of friends.

## Technology Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router v6
- **State Management**: React Context API
- **Authentication & Backend**: Supabase
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository

```sh
git clone https://github.com/yourusername/fitness-forge-community.git
cd fitness-forge-community
```

2. Install dependencies

```sh
npm install
# or
yarn install
```

3. Set up environment variables
   Create a `.env` file in the root directory and add your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server

```sh
npm run dev
# or
yarn dev
```

## Application Structure

- `/src/components`: Reusable UI components
- `/src/pages`: Page components for different routes
- `/src/lib`: Utility functions, API clients, and context providers
- `/src/hooks`: Custom React hooks

## Key Components

### Authentication

The application uses Supabase Authentication with email/password login. Authentication state is managed through the AuthContext provider.

### Protected Routes

Routes under the `/app` path are protected and require authentication.

### Main Sections

- **Dashboard**: Overview of activity, challenges, and progress
- **Workouts**: Log and verify workout activities
- **Challenges**: Join or create fitness challenges
- **Leaderboard**: Track user rankings and progress
- **Tips & Tricks**: Share and discover fitness advice
- **Community**: Connect with other users and groups
- **Reminders**: Set up workout and challenge reminders

## Deployment

The application can be built for production using:

```sh
npm run build
# or
yarn build
```

The build output will be in the `dist` directory, which can be deployed to any static hosting service like Netlify, Vercel, or GitHub Pages.

## Contributing

Contributions to FitCommunity are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Images from [Adobe Stock](https://stock.adobe.com/)
- UI Components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
