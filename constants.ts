
import { EventData, TicketData } from "./types";

export const IMAGES = {
  // UI Backgrounds & Assets (Updated)
  texture: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjHsNxzsr80CszSE4VQDHQndeU5_4HP-2oE4I6YF19JRTE7l4Lsc7GyAicc14lyg_DTxL3pPps7TFMf3LErqjDxALP0cihgxAHEZGAhqH_SICUodvIgLrH1G1TP1Q_m8rpHc40SdLV-HVctCju7DRIdXazqO_PaRdoFjcju_KWWqWVZadFLhmibWG73993BKoohIUDj9l7CBwuHvyMRKms_DQvQuU-Ehb5YzFqxzGWKfGcsQ1_EA7aSaWhxJzMsmT3oGJQNa48v9s", 
  spotlight: "https://lh3.googleusercontent.com/aida-public/AB6AXuA2Nm6qW1fUdC2Htyf0IOpxxENeJzuifw6ZoHpmxvvl6NDMiwjt7B1kOZ9FdnLItDu4CK9nZCeeYb4xlW6Rko0xneOKy0QwLTTXFaUVf0gDxefKwMHbS0CSKFhXURJjBbFmDhhXXusDKHUvSQYzOcsSCUfbsF889cU7-P_iyKMlVKRmeNNqJOQTJ2bbRMUTxoMsG0vwKGNqp3JB-Ut24kFfcmkflzuzGc5QH8PRBUgqpIwQkUlLZs8zWBE_6kOhHaTms-Bw0CHwaVg", 
  onboarding: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxxmOPgv3VSyjfWypEuwtrmxvGduQvd10ozFjUkVDf6cx99L4api5JIzZKgnsV9V4yilZXEiIoX57MoI6hUxw4se5rnhKzEpfiCQQPS1ScqoSE3HXJ_5zFCa7OntpVN1U0mfQz6GE87nQ7X2VyGmydSlNSl8Kh_5JoiVFnmHUUTou2lNdWlaN7QRBrwX5koLprP4MS8f-3fQhqkCZ7DY2L4zgyD-hl1dUH7Eg_sP935N1fkYIg_cZNIZMZmpXzvJKGktisT6UCSRE", 
  profile: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1600&auto=format&fit=crop", // Profile placeholder
  ad_banner: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=1000&auto=format&fit=crop", // Credit Card / Payment Lifestyle

  // Performance Key Art (Updated to AIDA Public Links & Wikimedia/Unsplash)
  phantom: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-ybED2d55gcGZ_zibev__u3vwYT9CkCntmvCgQjcyCOhTlGFNrwCVcwxRfpxJhGdvt6CKCBxoLcUw_DJLo0FB04tUY3aCViVqBGADDAM5LGAfVV34Ogyv75Q5f3Ht2HZySlk7hQZBTpaEaWgzXg8JlY7BWxgC6jFLZfIA6vTH0ys1qMIAdxv-2s4bHWwN-t8OFXU6-gMyRml1VLcs8XO2ECqZ9UEx2-y88GjFltEq1xfjYR2Zxd70NVtJ_NQEgZZcrPe3c9OMmYA", // Phantom (AIDA)
  chicago: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsuobXasTcDaBg3wncdKA3JMuTEMq4yLOs--X70ieaznJ2box4Clny9TmY4QnZM0WTi7DB4SJZV08YYZkC-xFpWjl97gv8lHAVlb5lgr8EeYLvZEzKkyH7ir3CkcuEylmqe33SPAsvx2YozY3RNhTsKa1v1SyzvQwwODf_r2ZK2758FaV79WwbQdMHT8UFFgXVKHnIdzUICnk_tjLGxoYnLiMxS739zpDqFbWdWJxiiZ-ZtesEZTgpt-0hXGdg_JIqyOwMdE6CFLc", // Midnight Jazz / Chicago (AIDA)
  billyElliot: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?q=80&w=2000&auto=format&fit=crop", // Male Dancer / Passion (Updated)
  swanLake: "https://lh3.googleusercontent.com/aida-public/AB6AXuATCrkN00HybZjvW8KmPX9exnbyzR20OfX20_vI1pHKm4s8yRJegRUdebbKEmw7sU698T660580vurHiuKFlVLOlP4A5abvbGmkX0poV0H4jbTlCVnzISCLcePVQhONOFIXdnimUUudd2cdnHx8DuZBsk_4pG5Qdp7o6srnLraBfTOizRQS2FZwe2gfhEgsCu7vVpd7XpcuLkxRLykcJr3nTVZRhfWe328K-jUmtdEZsaFqCJtlyZJfUZR4rytaXMzAebdCXjhyE0k", // Swan Lake (AIDA)
  
  // Wikimedia Commons (Public Domain / Creative Commons)
  rebecca: "https://koreajoongangdaily.joins.com/data/photo/2023/09/29/eadf8ad5-f3ac-4e5d-b8f0-f4e32904f988.jpg", // Rebecca (Updated)
  lesMis: "https://upload.wikimedia.org/wikipedia/commons/9/99/Eb_Cosette.jpg", // Original Cosette Illustration
  hamlet: "https://upload.wikimedia.org/wikipedia/commons/8/85/Hamlet_poster_for_WPA_production.jpg", // Vintage Hamlet Poster
  
  // Voucher
  lotteCard: "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMzA2MDZfMTM4%2FMDAxNjg1OTgyMDYzNzMx.PlpYRE4BdFYQwB9lk_AyQnBlmecdYiHugNOsvGZH6YAg.45WEKhAOCl8cVZ_DMPQiSUskBPOSIGb1b0NYHBHZ-Fgg.JPEG.alrin00%2FKakaoTalk_20230606_003437425_03.jpg&type=sc960_832", // Premium Gold Ribbon on Dark (Updated)
};

export const EVENTS: EventData[] = [
  {
    id: '1',
    category: 'performance',
    title: 'The Phantom of the Opera',
    location: 'Majestic Theatre',
    date: 'Tonight',
    time: '20:00',
    price: 110000,
    originalPrice: 150000,
    image: IMAGES.phantom,
    tags: ['Musical', 'Bestseller'],
    description: 'Experience the legendary musical in its most spectacular production ever. A haunting love story that has captivated millions around the world.',
    curatorNote: "The Phantom of the Opera is not just a musical; it's a cultural phenomenon. This production features the newly designed chandelier and an intensified orchestral arrangement that elevates Webber's masterpiece to new heights. The emotional depth of the 'Music of the Night' sequence is simply unparalleled.",
    highlights: [
      { title: 'Global Phenomenon', desc: 'Seen by over 140 million people worldwide', icon: 'public' },
      { title: 'Spectacular Set', desc: 'Featuring the iconic 1-ton falling chandelier', icon: 'theater_comedy' },
      { title: 'Award Winning', desc: 'Winner of 7 Tony Awards including Best Musical', icon: 'emoji_events' }
    ],
    notice: "Latecomers will not be seated until a suitable break in the performance. Please arrive 30 minutes prior to curtain time."
  },
  {
    id: '2',
    category: 'performance',
    title: 'Chicago',
    location: 'Ambassador Theatre',
    date: 'Oct 15',
    time: '19:30',
    price: 90000,
    image: IMAGES.chicago,
    tags: ['Musical', 'Jazz'],
    description: 'A universal tale of fame, fortune, and all that jazz. One of the most phenomenal musicals of our time.',
    curatorNote: "Sultry, sophisticated, and sharper than ever. 'Chicago' delivers the quintessential Broadway experience with its Fosse-style choreography and biting satire on celebrity culture. It's a masterclass in style and substance.",
    highlights: [
      { title: 'Fosse Style', desc: 'Legendary choreography by Bob Fosse', icon: 'accessibility_new' },
      { title: 'Jazz Age', desc: 'Immersive 1920s jazz club atmosphere', icon: 'nightlife' },
      { title: 'Longest Running', desc: 'The longest-running American musical on Broadway', icon: 'history' }
    ]
  },
  {
    id: '3',
    category: 'voucher',
    title: 'Lotte Gift Certificate',
    location: 'All Branches',
    date: 'Valid for 5 Years',
    price: 500000,
    image: IMAGES.lotteCard,
    tags: ['Voucher', 'Premium'],
    status: 'new-arrival',
    description: 'The ultimate gift of luxury. Use this premium digital certificate at all Lotte Department Stores, Lotte Marts, and affiliated luxury boutiques nationwide.',
    curatorNote: "The perfect gift when you want to offer choice without compromising on elegance. Accepted at over 80 locations nationwide, this digital voucher represents the pinnacle of convenient luxury gifting.",
    highlights: [
      { title: 'Nationwide Use', desc: 'Valid at all Lotte Department Stores & Affiliates', icon: 'store' },
      { title: 'Instant Delivery', desc: 'Send via mobile immediately after purchase', icon: 'send_to_mobile' },
      { title: 'Flexible Balance', desc: 'Use partially and keep the remaining balance', icon: 'account_balance_wallet' }
    ]
  },
  {
    id: '5',
    category: 'performance',
    title: 'Rebecca',
    location: 'Blue Square Hall',
    date: 'Nov 10',
    time: '19:00',
    price: 130000,
    image: IMAGES.rebecca,
    tags: ['Musical', 'Thriller'],
    description: 'A suspenseful masterpiece based on the classic novel. Romance and dark secrets intertwine in the shadowy halls of Manderley.',
    curatorNote: "A Gothic romance thriller that keeps you on the edge of your seat. The set design of Manderley burning is a theatrical marvel, and the character of Mrs. Danvers is chillingly unforgettable.",
    highlights: [
      { title: 'Gothic Thriller', desc: 'Based on Daphne du Maurier’s classic novel', icon: 'auto_stories' },
      { title: 'Visual Spectacle', desc: 'Stunning stage effects including the fire scene', icon: 'local_fire_department' },
      { title: 'Powerful Score', desc: 'Haunting melodies by Sylvester Levay', icon: 'music_note' }
    ]
  },
  {
    id: '7',
    category: 'performance',
    title: 'Billy Elliot',
    location: 'LG Arts Center',
    date: 'Dec 05',
    time: '19:30',
    price: 110000,
    image: IMAGES.billyElliot,
    tags: ['Musical', 'Inspirational'],
    description: 'An inspirational story of a young boy’s struggle against the odds to make his dream come true. A celebration of community and the power of dance.',
    curatorNote: "Heartwarming and electrically charged with energy. Billy Elliot reminds us of the power of art to transform lives. The choreography blends ballet and tap in a way that is both storytelling and spectacle.",
    highlights: [
      { title: 'Elton John Music', desc: 'Music by the legendary Elton John', icon: 'piano' },
      { title: 'Inspirational', desc: 'Winner of 10 Tony Awards', icon: 'emoji_events' },
      { title: 'Dynamic Dance', desc: 'Breathtaking ballet and tap sequences', icon: 'directions_run' }
    ]
  },
  {
    id: '8',
    category: 'performance',
    title: 'Swan Lake',
    location: 'Royal Opera House',
    date: 'Dec 20',
    time: '19:00',
    price: 140000,
    image: IMAGES.swanLake,
    tags: ['Ballet', 'Masterpiece'],
    description: 'Tchaikovsky’s first ballet is a tragic fairy tale where a princess turned into a swan by an evil curse awaits her true love.',
    curatorNote: "The definition of classical ballet. From the synchronized corps de ballet to the technical mastery required for the dual role of Odette/Odile, this production captures the ethereal beauty and tragic romance perfectly.",
    highlights: [
      { title: 'Classical Masterpiece', desc: 'The world’s most famous ballet', icon: 'diamond' },
      { title: 'Tchaikovsky Score', desc: 'Performed by a live full orchestra', icon: 'queue_music' },
      { title: 'Visual Poetry', desc: 'Exquisite costumes and set design', icon: 'palette' }
    ]
  },
];

export const MY_TICKETS: TicketData[] = [
  {
    id: 't1',
    eventId: '1',
    category: 'performance',
    title: 'The Phantom of the Opera',
    location: 'Charlotte Theater',
    date: '2023. 10. 24',
    fullDate: '2023. 10. 24 (Fri)',
    time: '19:30',
    seats: '1st Floor, Zone B, 12',
    image: IMAGES.phantom,
    status: 'live',
    type: 'VIP Seat'
  },
  {
    id: 't2',
    eventId: '3',
    category: 'performance',
    title: 'Les Misérables',
    location: 'Blue Square Shinhan Hall',
    date: 'Dec 15',
    fullDate: '2023. 12. 15 (Fri)',
    time: '20:00',
    seats: 'R Seat · 2 Tickets',
    image: IMAGES.lesMis,
    status: 'upcoming',
    type: 'R Seat'
  },
  {
    id: 'v1',
    eventId: '101',
    category: 'voucher',
    title: 'Lotte Gift Certificate',
    location: 'Lotte Dept. Store',
    fullDate: 'Valid until 2028.12.31',
    balance: 150000,
    image: IMAGES.lotteCard,
    status: 'active',
    type: 'Digital Voucher'
  }
];
