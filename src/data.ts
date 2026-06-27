/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Review, FAQItem, GatewaySettings } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'netflix-shared-1m',
    name: 'Netflix Premium Ultra HD (Shared Screen)',
    category: 'streaming',
    subcategory: 'Netflix',
    price: 2.99,
    originalPrice: 15.49,
    rating: 4.8,
    reviewsCount: 342,
    stockStatus: 'in_stock',
    description: 'Get Netflix Premium access on a shared high-quality account. Enjoy 4K HDR streaming with your own separate profile, personal PIN, and customized recommendations.',
    features: [
      '4K Ultra HD + HDR resolution',
      'Personal profile with custom PIN lock',
      'Works on Phone, Tablet, PC, and Smart TV',
      'Full 30-day warranty coverage',
      'Instant automated login delivery'
    ],
    deliveryTime: 'Instant Email Delivery (1-5 seconds)',
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8edd86?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    duration: '1 Month',
    instructions: [
      'You will receive login details (Email & Password) plus your Profile Name and PIN immediately after purchase.',
      'Go to netflix.com or open the Netflix app.',
      'Enter the provided credentials to log in.',
      'Select the profile assigned to you and enter your PIN.',
      'Do not modify the account email, password, or billing settings.'
    ],
    specs: {
      'Streaming Quality': 'Ultra HD (4K) + HDR',
      'Screens Allowed': '1 Screen at a time',
      'Device Support': 'All platforms',
      'Language Support': 'Multilingual',
      'Warranty': '30 Days Full Replacement'
    }
  },
  {
    id: 'netflix-private-1m',
    name: 'Netflix Premium Ultra HD (Private Account)',
    category: 'streaming',
    subcategory: 'Netflix',
    price: 11.99,
    originalPrice: 22.99,
    rating: 4.9,
    reviewsCount: 188,
    stockStatus: 'low_stock',
    description: 'A completely private, brand-new Netflix Premium account. Customize all 5 profiles, change the password, and host up to 4 concurrent Ultra HD streams.',
    features: [
      'Full private account (5 profiles yours to customize)',
      '4 concurrent screens streaming at once',
      '4K Ultra HD + Dolby Atmos audio',
      'Change email and password to your own',
      '100% stable & continuous service'
    ],
    deliveryTime: 'Instant Email Delivery (1-5 seconds)',
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    duration: '1 Month',
    instructions: [
      'You will receive the login credentials for a freshly created Netflix premium account.',
      'Login at netflix.com.',
      'Go to Account Settings and update the email and password to your secure private details.',
      'Set up your personal profiles, pins, and custom layouts as desired.',
      'Enjoy unrestricted, ad-free streaming.'
    ],
    specs: {
      'Streaming Quality': 'Ultra HD (4K) + Dolby Vision',
      'Screens Allowed': '4 Screens simultaneously',
      'Device Support': 'All platforms supported',
      'Warranty': '30 Days Full Replacement',
      'Account Type': 'Full Ownership (Can change password)'
    }
  },
  {
    id: 'prime-private-3m',
    name: 'Amazon Prime Video (Private Account)',
    category: 'streaming',
    subcategory: 'Amazon Prime',
    price: 5.99,
    originalPrice: 14.99,
    rating: 4.7,
    reviewsCount: 95,
    stockStatus: 'in_stock',
    description: 'Get access to Amazon Prime Video original shows, hit movies, and live sports on a private 3-month account. Rest assured with 100% secure personal profiles.',
    features: [
      'Ad-free high-definition 4K streaming',
      'Full private account with customizable profiles',
      'Supports Prime Gaming rewards',
      'Offline downloads on mobile devices',
      'Full 90-day warranty and support'
    ],
    deliveryTime: 'Instant Email Delivery (1-5 seconds)',
    image: 'https://images.unsplash.com/photo-1524311545634-1175653b4759?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    duration: '3 Months',
    instructions: [
      'Your order delivers a pre-activated Amazon Prime email & password credentials.',
      'Go to primevideo.com and log in.',
      'You can customize the profiles and watch content from any supported device.',
      'Avoid modifying the subscription billing details to ensure continuity.'
    ],
    specs: {
      'Streaming Quality': '4K UHD + HDR',
      'Screens Allowed': '3 screens simultaneously',
      'Downloads': 'Supported offline',
      'Warranty': '90 Days Guarantee',
      'Region': 'Global / Region-Free'
    }
  },
  {
    id: 'prime-private-1y',
    name: 'Amazon Prime Video (1-Year Subscription)',
    category: 'streaming',
    subcategory: 'Amazon Prime',
    price: 19.99,
    originalPrice: 139.00,
    rating: 4.9,
    reviewsCount: 154,
    stockStatus: 'low_stock',
    description: 'Annual premium access to Amazon Prime Video. Stream all Prime Originals, thousands of blockbuster movies, TV shows, and access Prime music and cloud benefits.',
    features: [
      'Full 1 Year uninterrupted service',
      '4K Ultra HD with HDR10+ and Dolby Atmos',
      'Up to 3 devices streaming simultaneously',
      'Offline video downloads via Android/iOS',
      '365-day technical warranty'
    ],
    deliveryTime: 'Instant Email Delivery (1-5 seconds)',
    image: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    duration: '1 Year',
    instructions: [
      'You will receive login details for a 1-year activated premium account.',
      'Login on primevideo.com or via your smart device.',
      'Create and name your private profiles.',
      'Do not change the billing information. Changing email/passwords can void the 1-year guarantee.'
    ],
    specs: {
      'Duration': '1 Year (365 days)',
      'Streaming Quality': '4K UHD + Dolby Vision',
      'Screens Allowed': '3 screens simultaneously',
      'Warranty': '1 Year Support & Guarantee'
    }
  },
  {
    id: 'nordvpn-1y',
    name: 'NordVPN Premium (1 Year Subscription)',
    category: 'vpn',
    subcategory: 'VPN',
    price: 12.99,
    originalPrice: 59.88,
    rating: 4.8,
    reviewsCount: 412,
    stockStatus: 'in_stock',
    description: 'Protect your digital privacy with the fastest VPN on the planet. Safely bypass geo-restrictions, stream your favorite global libraries, and block malware.',
    features: [
      '6,400+ ultra-fast servers in 111 countries',
      'Threat protection, ad-blocker, and malware scanner',
      'Double VPN encryption & strict no-logs policy',
      'Support for up to 6 devices simultaneously',
      'Seamless Netflix / Prime geo-unblocking'
    ],
    deliveryTime: 'Instant Email Delivery (1-5 seconds)',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    duration: '1 Year',
    instructions: [
      'Receive a pre-paid active account login.',
      'Download and install the official NordVPN application on your PC, smartphone, or tablet.',
      'Open the application and select Log In.',
      'Input the delivered credentials.',
      'Click "Quick Connect" or choose a secure server in your preferred country.',
      'Do not attempt to change the password or account settings.'
    ],
    specs: {
      'Servers': '6,400+ globally',
      'Countries': '111 countries',
      'Concurrent Devices': 'Up to 6 devices',
      'Encryption': 'AES-256 military-grade',
      'Speed': 'NordLynx Protocol (Up to 6700+ Mbps)'
    }
  },
  {
    id: 'surfshark-2y',
    name: 'Surfshark VPN Premium (2 Years Subscription)',
    category: 'vpn',
    subcategory: 'VPN',
    price: 24.99,
    originalPrice: 119.50,
    rating: 4.9,
    reviewsCount: 228,
    stockStatus: 'in_stock',
    description: 'Keep your web presence completely secure. Surfshark features unlimited simultaneous connections, clean web ad-blocking, and dedicated bypass tools.',
    features: [
      'Unlimited simultaneous device connections',
      '3,200+ servers in 100 countries',
      'CleanWeb ad and cookie pop-up blocker',
      'Bypasser split-tunneling feature',
      'No logs verified by independent audits'
    ],
    deliveryTime: 'Instant Email Delivery (1-5 seconds)',
    image: 'https://images.unsplash.com/photo-1601597111158-2fceff270190?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    duration: '2 Years',
    instructions: [
      'Receive a Surfshark Premium active login immediately after purchase.',
      'Install Surfshark on any device (Windows, Mac, iOS, Android, Linux).',
      'Log in using the provided email and security password.',
      'Enjoy encrypted internet routing. Feel free to connect all your household devices.'
    ],
    specs: {
      'Duration': '2 Years (24 Months)',
      'Devices': 'Unlimited connections',
      'Servers': '3,200+ servers',
      'Countries': '100 countries',
      'Special Features': 'Adblocker, Bypasser, Kill Switch'
    }
  },
  {
    id: 'elden-ring-steam',
    name: 'Elden Ring (Steam Key - Global)',
    category: 'games',
    subcategory: 'Games',
    price: 29.99,
    originalPrice: 59.99,
    rating: 4.9,
    reviewsCount: 618,
    stockStatus: 'in_stock',
    description: 'Unlock FromSoftware’s masterpiece. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.',
    features: [
      '100% official Steam CD-Key',
      'Global, Region-Free activation',
      'Complete singleplayer and multiplayer co-op',
      'Direct permanent ownership inside your Steam Library',
      'Full game updates and achievements support'
    ],
    deliveryTime: 'Instant Email Delivery (1-5 seconds)',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    duration: 'Lifetime',
    instructions: [
      'You will receive a unique 15-character official CD-key (e.g., A1B2C-D3E4F-G5H6I).',
      'Launch the Steam client on your computer and log into your account.',
      'Click on the "Games" menu at the top of the window.',
      'Select "Activate a Product on Steam...".',
      'Follow the on-screen prompts and enter your delivered CD-Key.',
      'The game will be added to your library and will begin downloading immediately.'
    ],
    specs: {
      'Platform': 'Steam (PC)',
      'Region': 'Global (Region-Free)',
      'Developer': 'FromSoftware',
      'Publisher': 'Bandai Namco',
      'Release Date': 'February 25, 2022'
    }
  },
  {
    id: 'cyberpunk-bundle-steam',
    name: 'Cyberpunk 2077 + Phantom Liberty Bundle (Steam Key)',
    category: 'games',
    subcategory: 'Games',
    price: 34.99,
    originalPrice: 79.99,
    rating: 4.8,
    reviewsCount: 489,
    stockStatus: 'in_stock',
    description: 'Get the definitive Night City adventure. Includes the critically-acclaimed sci-fi RPG base game and the dark-future spy-thriller expansion Phantom Liberty.',
    features: [
      'Official Steam activation key (Region-Free)',
      'Includes Cyberpunk 2077 base game (v2.1+ updated)',
      'Includes Phantom Liberty Spy-Thriller DLC expansion',
      'Unlock path-tracing and DLSS 3.5 graphics',
      'Permanent ownership on your Steam account'
    ],
    deliveryTime: 'Instant Email Delivery (1-5 seconds)',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    duration: 'Lifetime',
    instructions: [
      'Receive your global product key directly on screen and via email.',
      'Open the Steam application.',
      'Navigate to Games > Activate a Product on Steam.',
      'Enter the key and confirm.',
      'Install the base game and DLC from your library and start exploring Night City.'
    ],
    specs: {
      'Platform': 'Steam (PC)',
      'Included Items': 'Base Game + Phantom Liberty Expansion',
      'Region': 'Global / All Regions',
      'Developer': 'CD PROJEKT RED',
      'Genre': 'Action RPG, Sci-Fi'
    }
  },
  {
    id: 'minecraft-ms',
    name: 'Minecraft Java & Bedrock Edition (Microsoft Key)',
    category: 'games',
    subcategory: 'Games',
    price: 14.99,
    originalPrice: 29.99,
    rating: 4.9,
    reviewsCount: 812,
    stockStatus: 'in_stock',
    description: 'Get both legendary editions in a single purchase! Play Minecraft Java Edition (for PC, Mac, Linux) and Bedrock Edition (for Windows) to build, create, and survive with friends.',
    features: [
      'Official Microsoft/Mojang digital activation key',
      'Access both Java and Bedrock editions on PC',
      'Custom character skins, texture packs, and mods',
      'Cross-play multiplayer with millions of players',
      'Fully transferrable to your personal Microsoft account'
    ],
    deliveryTime: 'Instant Email Delivery (1-5 seconds)',
    image: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    duration: 'Lifetime',
    instructions: [
      'You will receive a 25-character Minecraft redeem code.',
      'Visit redeem.microsoft.com or log into your Microsoft Account on your Windows PC.',
      'Enter the 25-character key in the form.',
      'Confirm the redemption to bind Minecraft permanently to your profile.',
      'Open the Minecraft Launcher on your PC to download and play.'
    ],
    specs: {
      'Platform': 'Microsoft Store / PC',
      'Region': 'Global (Region-Free)',
      'Publisher': 'Mojang Studios',
      'Editions': 'Java & Bedrock Bundle'
    }
  },
  {
    id: 'gta-v-premium',
    name: 'Grand Theft Auto V: Premium Edition (Rockstar Key)',
    category: 'games',
    subcategory: 'Games',
    price: 8.99,
    originalPrice: 29.99,
    rating: 4.7,
    reviewsCount: 310,
    stockStatus: 'in_stock',
    description: 'Includes the complete Grand Theft Auto V story experience, free access to the ever-evolving Grand Theft Auto Online, and the Criminal Enterprise Starter Pack to kickstart your empire.',
    features: [
      'Official Rockstar Games Launcher activation key',
      'Includes Criminal Enterprise Starter Pack ($10,000,000+ value)',
      'Full, unrestricted GTA Online access',
      'Highly optimized PC performance up to 4K resolution',
      'Guaranteed permanent game activation'
    ],
    deliveryTime: 'Instant Email Delivery (1-5 seconds)',
    image: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    duration: 'Lifetime',
    instructions: [
      'Receive your Rockstar Launcher CD-Key.',
      'Download and install the official Rockstar Games Launcher.',
      'Log into or register your Rockstar Social Club account.',
      'Click your profile icon in the top right corner and select "Redeem Code".',
      'Enter your unique key to permanently add GTA V to your account.'
    ],
    specs: {
      'Platform': 'Rockstar Games Launcher (PC)',
      'Included DLC': 'Criminal Enterprise Starter Pack + $1,000,000 GTA Online Bonus Cash',
      'Region': 'Global / Worldwide',
      'Developer': 'Rockstar North'
    }
  },
  {
    id: 'steam-50-gift',
    name: 'Steam Wallet $50 USD Gift Card (Global Key)',
    category: 'gift',
    subcategory: 'Gift Cards',
    price: 49.99,
    originalPrice: 55.00,
    rating: 4.9,
    reviewsCount: 142,
    stockStatus: 'in_stock',
    description: 'Add $50 USD directly to your Steam Wallet instantly. Use it to purchase your favorite PC games, downloadable content, software, and community market items.',
    features: [
      'Official Steam Wallet code delivered instantly',
      'Redeemable globally on any region account (converted to store currency)',
      'No expiration date - use whenever you want',
      'Perfect gift for gamers and creators'
    ],
    deliveryTime: 'Instant Email Delivery (1-5 seconds)',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    duration: 'Lifetime',
    instructions: [
      'Receive your Steam Wallet 15-character digital code.',
      'Log into your Steam account in the client or web browser.',
      'Go to your profile or store page and select "Redeem a Steam Wallet Code".',
      'Enter the code and press "Redeem" to add $50 USD to your balance.'
    ],
    specs: {
      'Card Type': 'Steam Wallet Gift Code',
      'Value': '$50 USD',
      'Region': 'Global / Worldwide',
      'Platform': 'Steam (PC/Mac/Linux)'
    }
  },
  {
    id: 'canva-pro-edu',
    name: 'Canva Pro 1-Year Educational Access',
    category: 'educational',
    subcategory: 'Educational Tools',
    price: 14.99,
    originalPrice: 119.99,
    rating: 4.8,
    reviewsCount: 88,
    stockStatus: 'in_stock',
    description: 'Get full Canva Pro features for an entire year. Create professional-grade graphics, access millions of premium stock photos, elements, and brand-kit capabilities.',
    features: [
      'Premium access to 100M+ stock photos, videos, and graphics',
      'Brand Kit integration with custom logos, colors, and fonts',
      'One-click background remover tool',
      '1TB cloud storage for all your creative templates'
    ],
    deliveryTime: 'Instant Email Delivery (1-5 seconds)',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    duration: '1 Year',
    instructions: [
      'Receive your Canva invitation code or pre-activated premium credential.',
      'Go to Canva.com and sign up or log in.',
      'Use the link provided to join our verified Educational Pro group instantly.',
      'Enjoy unlimited access to premium design elements!'
    ],
    specs: {
      'Access Duration': '12 Months (1 Year)',
      'Platform': 'Canva Web & App',
      'Warranty': 'Full 365 Days Warranty',
      'Region': 'Global / Worldwide'
    }
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    username: 'alex_cyber99',
    rating: 5,
    comment: 'Was skeptical at first, but the Netflix Shared account came in 2 seconds. Screen has its own lock PIN. Works perfectly on my Apple TV and iPad. Outstanding price!',
    date: 'June 24, 2026',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'rev-2',
    username: 'emily_reads',
    rating: 5,
    comment: 'Purchased NordVPN 1 Year. Got a premium login instantly. Setup took less than a minute. Netflix US is fully unblocked on my side. Thank you Synapse Labs!',
    date: 'June 21, 2026',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'rev-3',
    username: 'pixel_warrior',
    rating: 5,
    comment: 'Elden Ring key was activated on Steam in seconds. Global region works flawlessly, downloading in Germany with full speeds. Synapse is now my go-to keyshop.',
    date: 'June 18, 2026',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'rev-4',
    username: 'lucas_k',
    rating: 4,
    comment: 'Super solid Amazon Prime account. Only slight delay of 10 seconds before email arrived, but support was already responsive when I opened chat. Very good price.',
    date: 'June 15, 2026',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80'
  }
];

export const FAQS: FAQItem[] = [
  {
    question: 'How do I receive my products?',
    answer: 'All deliveries are fully automated. Immediately upon successful payment, your account credentials or game CD-Keys will appear on the success page, and a backup copy is instantly sent to your provided email address. You can also view them anytime in the "My Deliveries" tab.',
    category: 'Delivery'
  },
  {
    question: 'Are these digital keys and accounts legal?',
    answer: 'Absolutely. We source our game keys directly from authorized game publishers and promotional distributors. Our premium streaming and VPN accounts are fully activated with legitimate payment methods under corporate licensing plans, which allows us to offer bulk discounts to you.',
    category: 'Legality & Source'
  },
  {
    question: 'What is the warranty policy?',
    answer: 'We provide a full-duration warranty on all subscriptions (e.g., 30 days for 1-month plans, 365 days for 1-year plans). If you encounter any login or activation issues, our support team will instantly issue a replacement account or key.',
    category: 'Warranty & Refund'
  },
  {
    question: 'Can I change the password on Shared Accounts?',
    answer: 'No. For "Shared Screen" products, modifying the login email, password, or master settings is strictly forbidden and violates our terms of service, which will terminate your warranty. If you want full customization and ownership, please purchase our "Private Account" editions.',
    category: 'Usage Rules'
  },
  {
    question: 'Which payment methods do you accept?',
    answer: 'We accept standard credit/debit cards, Google Pay, and major cryptocurrencies (Bitcoin, Litecoin, Ethereum, and USDT). Cryptocurrencies receive an automatic 5% additional discount at checkout.',
    category: 'Billing'
  }
];

export const DEFAULT_GATEWAY_SETTINGS: GatewaySettings = {
  bkashNumber: '01784-912834',
  nagadNumber: '01955-483294',
  whatsappNumber: '+8801784912834',
  discordLink: 'https://discord.gg/synapselabs',
  facebookUrl: 'https://facebook.com/synapselabs'
};

