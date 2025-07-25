# CinemaHub - Professional Movie Discovery Platform

A modern, responsive movie discovery platform built with Next.js 15, featuring user authentication, favorites management, and a Netflix-inspired design.

## 🎬 Features

### Core Features
- **Movie Discovery**: Browse trending, popular, and now playing movies
- **Advanced Search**: Real-time search with debounce and auto-suggestions
- **Movie Details**: Comprehensive movie information with cast, crew, and trailers
- **Responsive Design**: Mobile-first, optimized for all screen sizes

### User Features
- **Authentication**: Client-side authentication with form validation
- **Favorites Management**: Add/remove movies from personal favorites with localStorage
- **Dark/Light Mode**: Theme toggle with persistent user preference
- **Personal Dashboard**: Manage favorites with sorting and search functionality

### UI/UX Features
- **Modern Design**: Dark theme with cinematic gold accents
- **Smooth Animations**: Framer Motion animations and transitions
- **Loading States**: Skeleton loaders for better user experience
- **Toast Notifications**: Real-time feedback for user actions
- **Netflix-inspired Cards**: Professional movie cards with hover effects

## 🛠️ Technologies Used

- **Framework**: Next.js 15.3.3 with Turbopack
- **Styling**: Tailwind CSS
- **Authentication**: Client-side authentication with localStorage
- **Data Fetching**: SWR for efficient data management
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Movie Data**: The Movie Database (TMDB) API
- **Language**: JavaScript/JSX

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- TMDB API key (free registration at [themoviedb.org](https://www.themoviedb.org/))

## 🚀 Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/cinemahub.git
cd cinemahub
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables**
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js 15 app directory
│   ├── auth/              # Authentication pages (signin/signup)
│   ├── favorites/         # User favorites page
│   ├── movie/[id]/        # Dynamic movie details page
│   ├── search/            # Search functionality
│   ├── globals.css        # Global styles
│   ├── layout.js          # Root layout
│   ├── page.js            # Home page
│   └── not-found.js       # 404 page
├── components/            # Reusable components
│   ├── MovieCard.js       # Movie card component
│   ├── NavBar.js          # Navigation bar
│   ├── SearchBar.js       # Search component
│   ├── ThemeProvider.js   # Theme context provider
│   ├── LoadingSkeleton.js # Loading components
│   └── ErrorBoundary.js   # Error handling components
└── lib/                   # Utility functions
    └── tmdb.js            # TMDB API integration
```

## 📸 Screenshots

### Home Page
![Home Page](./screenshots/home-page.png)

### Movie Details
![Movie Details](./screenshots/movie-details.png)

### Search Functionality
![Search](./screenshots/search.png)

### Favorites Page
![Favorites](./screenshots/favorites.png)

### Authentication
![Authentication](./screenshots/auth.png)

### Dark/Light Mode
![Theme Toggle](./screenshots/theme-toggle.png)

## 🎯 Key Features Implemented

- ✅ **Responsive Design**: Mobile-first approach with Tailwind CSS
- ✅ **Theme Toggle**: Dark/light mode with localStorage persistence
- ✅ **Authentication**: Client-side auth with form validation
- ✅ **Movie Search**: Debounced search with auto-suggestions
- ✅ **Favorites System**: Add/remove favorites with localStorage
- ✅ **Movie Details**: Dynamic routing with comprehensive movie info
- ✅ **Loading States**: Skeleton loaders and smooth transitions
- ✅ **Error Handling**: Comprehensive error boundaries and fallbacks
- ✅ **SEO Optimization**: Meta tags and Open Graph support
- ✅ **Performance**: Image optimization and code splitting

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Manual Build
```bash
npm run build
npm start
```

## 🔮 Future Improvements

- [ ] **Backend Integration**: Replace localStorage with proper database
- [ ] **User Profiles**: Extended user management and profiles
- [ ] **Movie Reviews**: User rating and review system
- [ ] **Watchlist**: Separate watchlist functionality
- [ ] **Social Features**: Share favorites and reviews
- [ ] **Advanced Filters**: Filter by genre, year, rating
- [ ] **Infinite Scroll**: Enhanced pagination
- [ ] **PWA Support**: Progressive Web App features
- [ ] **Multi-language**: Internationalization support
- [ ] **Movie Recommendations**: AI-powered suggestions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TMDB**: Movie data provided by The Movie Database
- **Next.js Team**: For the amazing React framework
- **Tailwind CSS**: For the utility-first CSS framework
- **Framer Motion**: For smooth animations
- **Vercel**: For hosting and deployment platform

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ using Next.js 15, Tailwind CSS, and modern web technologies**

### 🌟 Star this repository if you found it helpful!