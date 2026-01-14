# Currency Swap Application

A modern, responsive cryptocurrency swap interface built with React and Vite. This application allows users to swap between different cryptocurrency tokens with real-time exchange rates and an intuitive user interface.

## Features

- 🔄 **Token Swapping**: Swap between multiple cryptocurrency tokens
- 💱 **Real-time Exchange Rates**: Fetches live token prices from Switcheo API
- 🎨 **Modern UI**: Clean black and white theme with smooth animations
- 🔍 **Searchable Dropdowns**: React-select dropdowns with token icons and search functionality
- ✅ **Input Validation**: Comprehensive form validation with error messages
- 📱 **Mobile Responsive**: Fully responsive design that works on all devices
- 🔔 **Toast Notifications**: Success notifications using SweetAlert2
- ⚡ **Fast Performance**: Optimized with React hooks and memoization

## Tech Stack

- **React** - UI library
- **Vite** - Build tool and dev server
- **React Select** - Advanced select component with search
- **Axios** - HTTP client for API requests
- **SweetAlert2** - Beautiful toast notifications
- **CSS3** - Custom styling with modern features

## Getting Started

### Prerequisites

- Node.js (version 20.19+ or 22.12+)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory:
```bash
cd currency-swap
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

### Build for Production

```bash
npm run build
```

The production build will be created in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
currency-swap/
├── src/
│   ├── components/
│   │   └── ToastAlert.jsx      # Toast notification utilities
│   ├── utils/
│   │   └── api.js              # API utility functions
│   ├── App.jsx                 # Main application component
│   ├── App.css                 # Application styles
│   ├── index.css               # Global styles
│   └── main.jsx                # Application entry point
├── public/                     # Static assets
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## API Integration

The application fetches token prices from:
- **Prices API**: `https://interview.switcheo.com/prices.json`
- **Token Icons**: `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/{TOKEN}.svg`

## Usage

1. **Select From Token**: Choose the token you want to swap from the "From" dropdown
2. **Enter Amount**: Type the amount you want to swap
3. **Select To Token**: Choose the token you want to receive from the "To" dropdown
4. **View Exchange Rate**: The exchange rate is automatically calculated and displayed
5. **Swap Tokens**: Click the swap button (↕️) to quickly swap the from/to tokens
6. **Submit**: Click "Swap Tokens" to execute the swap

The application will show a success notification when the swap is completed.

## Features in Detail

### Token Selection
- Searchable dropdowns powered by React Select
- Token icons displayed next to each token
- Real-time price display for selected tokens

### Exchange Rate Calculation
- Automatically calculates exchange rates based on token prices
- Updates in real-time as you change tokens or amounts
- Bidirectional calculation (enter amount in either field)

### Input Validation
- Validates token selection
- Ensures positive amounts
- Prevents swapping the same token
- Clear error messages for invalid inputs

### Responsive Design
- Optimized for mobile, tablet, and desktop
- Touch-friendly interface
- Adaptive layouts for different screen sizes

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is created as part of a technical assessment.

## Author

**William Thomas**

---

Built with ❤️ using React and Vite