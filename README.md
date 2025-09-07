# 🚀 Crypto Horizon Dashboard

A modern, responsive cryptocurrency trading dashboard built with React, TypeScript, and cutting-edge web technologies. This application provides a comprehensive platform for cryptocurrency market analysis, trading, and portfolio management.

![Crypto Horizon Dashboard](https://img.shields.io/badge/status-active-brightgreen.svg)
![React](https://img.shields.io/badge/React-18.3.1-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)
![Vite](https://img.shields.io/badge/Vite-5.4.1-646CFF.svg)

## ✨ Features

### 🔐 Authentication & Security
- **Secure Login System**: User authentication with protected routes
- **Session Management**: Persistent user sessions with secure logout
- **Protected Routes**: Role-based access control for different sections

### 📊 Dashboard Overview
- **Real-time Market Data**: Live cryptocurrency prices and market metrics
- **Portfolio Analytics**: Comprehensive portfolio performance tracking
- **Interactive Charts**: Advanced charting with multiple timeframes
- **Market Trends**: Visual representation of market movements

### 💹 Trading Platform
- **Live Trading Interface**: Buy/sell cryptocurrencies with real-time pricing
- **Order Management**: Place, track, and manage trading orders
- **Market Analysis**: Technical analysis tools and indicators
- **Price Alerts**: Customizable price notifications

### 💼 Wallet Management
- **Multi-Currency Support**: Manage multiple cryptocurrency wallets
- **Transaction History**: Detailed transaction logs and analytics
- **Balance Tracking**: Real-time balance updates across all holdings
- **Transfer Management**: Send and receive cryptocurrencies

### 🏪 Market Analysis
- **Market Overview**: Comprehensive market data and statistics
- **Cryptocurrency Rankings**: Top performing coins and market leaders
- **Price Comparison**: Compare multiple cryptocurrencies
- **Market Sentiment**: Analysis of market trends and sentiment

## 🛠️ Tech Stack

### Frontend Framework
- **React 18.3.1**: Modern React with hooks and concurrent features
- **TypeScript 5.5.3**: Type-safe development with enhanced IDE support
- **Vite 5.4.1**: Fast build tool and development server

### UI Components & Styling
- **shadcn/ui**: Modern, accessible UI component library
- **Radix UI**: Unstyled, accessible components for complex UI
- **Tailwind CSS 3.4.11**: Utility-first CSS framework
- **Lucide React**: Beautiful, customizable icons

### State Management & Data Fetching
- **React Context API**: Global state management for auth and crypto data
- **TanStack Query 5.56.2**: Powerful data synchronization for React
- **React Hook Form 7.53.0**: Performant forms with easy validation

### Routing & Navigation
- **React Router DOM 6.26.2**: Declarative routing for React applications
- **Protected Routes**: Authentication-based route protection

### Data Visualization
- **Recharts 2.12.7**: Composable charting library for React
- **Interactive Charts**: Real-time data visualization

### Development Tools
- **ESLint**: Code linting and quality enforcement
- **TypeScript ESLint**: TypeScript-specific linting rules
- **Autoprefixer**: Automatic CSS vendor prefixing

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vishalgir007/cryprocurrency-trading.git
   cd cryprocurrency-trading
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080` to view the application

### Build for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## 📁 Project Structure

```
crypto-horizon-dash/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── DashboardLayout.tsx
│   │   └── ProtectedRoute.tsx
│   ├── contexts/         # React context providers
│   │   ├── AuthContext.tsx
│   │   └── CryptoDataContext.tsx
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and configurations
│   ├── pages/            # Application pages/routes
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── Market.tsx
│   │   ├── Trade.tsx
│   │   └── Wallet.tsx
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── package.json          # Project dependencies and scripts
├── vercel.json           # Vercel deployment configuration
└── README.md            # Project documentation
```

## 🚀 Deployment

### Deploy to Vercel

This project is optimized for deployment on Vercel. Follow these steps:

#### Option 1: Deploy via Vercel Dashboard
1. Fork or clone this repository
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your repository
5. Vercel will automatically detect it's a Vite project
6. Click "Deploy"

#### Option 2: Deploy via Vercel CLI
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy the project
vercel

# For production deployment
vercel --prod
```

#### Option 3: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vishalgir007/cryprocurrency-trading)

### Environment Variables
For production deployment, make sure to set up the following environment variables in your Vercel dashboard:
- `VITE_APP_NAME`: Crypto Horizon Dashboard
- `VITE_APP_VERSION`: 1.0.0
- `VITE_NODE_ENV`: production

### Build Optimization
The project includes several optimizations for production:
- **Code Splitting**: Automatically splits vendor, UI, and chart libraries
- **Minification**: Uses Terser for optimal compression
- **Tree Shaking**: Removes unused code
- **Gzip Compression**: Enabled by default on Vercel
- **Source Maps**: Disabled in production for smaller builds

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview the production build locally
- `npm run vercel-build` - Optimized build command for Vercel deployment

## 🌟 Key Features Explained

### Authentication System
The application includes a robust authentication system with:
- User login/logout functionality
- Protected routes that require authentication
- Session persistence across browser refreshes
- Secure context-based state management

### Real-time Data Integration
- Live cryptocurrency price feeds
- Real-time portfolio updates
- Market data synchronization
- Efficient data caching and invalidation

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Adaptive layouts for all screen sizes
- Touch-friendly interface for mobile devices
- Optimized performance across devices

### Modern Development Practices
- TypeScript for type safety and better development experience
- Component-based architecture for maintainability
- Custom hooks for reusable logic
- Comprehensive error handling and loading states

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Radix UI](https://www.radix-ui.com/) for accessible component primitives
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [React](https://reactjs.org/) team for the amazing framework
- [Vite](https://vitejs.dev/) for the blazing fast build tool

## 📞 Support

If you have any questions or need help with setup, please:
- Open an issue on GitHub
- Check existing issues for similar problems
- Provide detailed information about your environment and the issue

---

**Built with ❤️ by [Aniket Yadav](https://github.com/Aniketyadav77)**
