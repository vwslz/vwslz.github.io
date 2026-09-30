// Shared memory collection for the timeline, map, and reusable event pages.
// Timeline visibility is limited to milestones and records with showOnTimeline: true.
window.WEDDING_EVENTS = [
  {
    id: "we-met", date: "2020-12-20", dateLabel: "December 20, 2020", year: 2020,
    title: "你好", location: "Instagram",
    shortDescription: "A message on Instagram began our story.", milestone: "meeting", category: "highlight",
    story: "Our story began with a hello on Instagram. We kept talking, sharing little pieces of our lives, and slowly became part of each other’s days."
  },
  {
    id: "great-neck-dinner", date: "2021-06", dateLabel: "June 2021", year: 2021,
    title: "A dinner in Great Neck", location: "Peter Luger Steak House · Great Neck, New York", coordinates: [-73.7263, 40.8007],
    shortDescription: "An early dinner together on Long Island.", category: "travel", cover: "img/history-docx/image25.webp",
    story: "One of our earliest in-person memories: dinner in Great Neck, with the evening stretching on over a meal and conversation.",
    gallery: ["img/history-docx/image74.webp", "img/history-docx/image70.webp", "img/history-docx/image10.webp"]
  },
  {
    id: "yuhe-birthday", date: "2022-03", dateLabel: "March 2022", year: 2022,
    title: "A birthday dinner", location: "Cajun Seafood Restaurant · Ronkonkoma, New York", coordinates: [-73.1228, 40.8154],
    shortDescription: "Celebrating Yuhe over seafood.", category: "travel", cover: "img/history-docx/image68.webp",
    story: "We celebrated Yuhe’s birthday with a seafood dinner in Ronkonkoma.", gallery: []
  },
  {
    id: "hanfu-spring-2023", date: "2023-04", dateLabel: "April 2023", year: 2023,
    title: "Hanfu among the blossoms", location: "Branch Brook Park · Newark, New Jersey", coordinates: [-74.1763, 40.7681],
    shortDescription: "A spring outing in traditional dress.", category: "travel", cover: "img/history-docx/image42.webp",
    story: "We welcomed spring at Branch Brook Park in Hanfu, surrounded by flowering trees and friends.", gallery: []
  },
  {
    id: "new-jersey-weekend-2023", date: "2023-08", dateLabel: "August 2023", year: 2023,
    title: "A high-speed New Jersey weekend", location: "New Jersey", shortDescription: "Laser tag, karting, and a playful weekend away.", category: "travel", cover: "img/history-docx/image83.webp",
    story: "We made a weekend of laser tag and go-karting in New Jersey. A little friendly competition made for a lot of laughter.", gallery: ["img/history-docx/image14.webp"]
  },
  {
    id: "east-coast-road-trip-2023", date: "2023-12", dateLabel: "December 2023", year: 2023,
    title: "An East Coast road trip", location: "Cape May · Williamsburg · West Virginia · Washington, DC", coordinates: [-74.9227, 38.9351],
    shortDescription: "A winding drive south, with small-town stops and mountain views.", category: "travel", cover: "img/history-docx/image43.webp",
    story: "We set out from New Jersey for a December road trip down the East Coast. Along the way we stopped in Cape May and Colonial Williamsburg, visited Pretty Place, crossed New River Gorge, and ended with the Washington Monument.",
    gallery: ["img/history-docx/image7.webp", "img/history-docx/image69.webp", "img/history-docx/image82.webp", "img/history-docx/image76.webp"]
  },
  {
    id: "spring-stony-brook-2024", date: "2024-04-27", dateLabel: "April 27, 2024", year: 2024,
    title: "A spring day at Stony Brook", location: "Wang Center · Stony Brook, New York", coordinates: [-73.1234, 40.9126],
    shortDescription: "A bright spring outing close to home.", category: "travel", cover: "img/history-docx/image41.webp",
    story: "We spent a spring day around Stony Brook and the Wang Center, taking in the blossoms and enjoying an unhurried outing.", gallery: []
  },
  {
    id: "skydiving-2024", date: "2024-08", dateLabel: "August 2024", year: 2024,
    title: "A leap from the sky", location: "Long Island Skydiving Center · Shirley, New York", coordinates: [-72.8615, 40.8009],
    shortDescription: "An unforgettable skydiving day on Long Island.", category: "travel", cover: "img/history-docx/image93.webp",
    story: "We tried skydiving at the Long Island Skydiving Center. It was a big, brave, exhilarating day to share.", gallery: []
  },
  {
    id: "cosplay-2024", date: "2024-09", dateLabel: "September 2024", year: 2024,
    title: "Cosplay by Roth Pond", location: "Stony Brook University · New York", coordinates: [-73.1234, 40.9126],
    shortDescription: "A playful cosplay afternoon on campus.", category: "travel", cover: "img/history-docx/image18.webp",
    story: "We dressed up for a cosplay afternoon near Roth Pond, turning an ordinary campus day into a little adventure.", gallery: []
  },
  {
    id: "idle-concert-2024", date: "2024-09", dateLabel: "September 2024", year: 2024,
    title: "A night at the concert", location: "UBS Arena · Elmont, New York", coordinates: [-73.7126, 40.7009],
    shortDescription: "Seeing i-dle live together.", category: "travel", cover: "img/history-docx/image94.webp",
    story: "We went to see i-dle at UBS Arena in Elmont and shared the energy of a concert night together.", gallery: ["img/history-docx/image16.webp"]
  },
  {
    id: "winter-outing-2024", date: "2024-11", dateLabel: "November 2024", year: 2024,
    title: "A winter day in the city", location: "New York City & New Jersey", coordinates: [-73.9851, 40.7589],
    shortDescription: "Dinner, the American Dream mall, and bubble tea.", category: "travel", cover: "img/history-docx/image65.webp",
    story: "We spent a winter day between New York City and New Jersey, sharing a meal at Mari Vanna, wandering the American Dream mall, and stopping for bubble tea.",
    gallery: ["img/history-docx/image81.webp", "img/history-docx/image30.webp", "img/history-docx/image38.webp"]
  },
  {
    id: "hanfu-nyc-2024", date: "2024-12", dateLabel: "December 2024", year: 2024,
    title: "A Hanfu anniversary", location: "Flushing · Queens, New York", coordinates: [-73.833, 40.7668],
    shortDescription: "A Hanfu community’s tenth anniversary celebration.", category: "travel",
    story: "We attended a tenth-anniversary Hanfu ceremony in Flushing and celebrated a community and tradition we both enjoy."
  },
  {
    id: "dc-road-trip-2025", date: "2025-03", dateLabel: "March 2025", year: 2025,
    title: "A drive to the fireworks", location: "Washington, DC & College Park, Maryland", coordinates: [-77.0369, 38.9072],
    shortDescription: "A road trip to DC, with a University of Maryland stop.", category: "travel", cover: "img/history-docx/image72.webp",
    story: "We drove down to Washington, DC for the fireworks and visited the University of Maryland at College Park along the way.",
    gallery: ["img/history-docx/image48.webp", "img/history-docx/image39.webp"]
  },
  {
    id: "quebec-road-trip-2025", date: "2025-07", dateLabel: "July 2025", year: 2025,
    title: "Summer in Québec City", location: "Québec City, Canada", coordinates: [-71.208, 46.8139],
    shortDescription: "A summer road trip north to Québec.", category: "travel", cover: "img/history-docx/image84.webp",
    story: "We took a summer road trip to Québec City, exploring its historic streets and enjoying a few days away together.", gallery: ["img/history-docx/image8.webp"]
  },
  {
    id: "austin-road-trip-2025", date: "2025-08", dateLabel: "August 2025", year: 2025,
    title: "The long drive to Austin", location: "New Orleans · Vacherie · Houston · Austin", coordinates: [-97.7431, 30.2672],
    shortDescription: "A cross-country drive with stops in Louisiana and Texas.", category: "travel", cover: "img/history-docx/image11.webp",
    story: "We drove from New Jersey to Austin, stopping in New Orleans, Oak Alley in Vacherie, and Houston before reaching Austin and the University of Texas.",
    gallery: ["img/history-docx/image88.webp", "img/history-docx/image95.webp", "img/history-docx/image35.webp"]
  },
  {
    id: "relationship", date: "2025-08-05", dateLabel: "August 5, 2025", year: 2025,
    title: "恋爱", location: "Stony Brook, New York", coordinates: [-73.1234, 40.9126],
    shortDescription: "We began our relationship at Stony Brook.", milestone: "relationship", category: "highlight",
    story: "On August 5, 2025, at Stony Brook, we began our relationship. A new chapter began with a familiar place and a very clear yes from both of us."
  },
  {
    id: "blue-blaze-2025", date: "2025-09", dateLabel: "September 2025", year: 2025,
    title: "A September visit", location: "Blue Blaze Trail · New Jersey & Flushing, New York", coordinates: [-74.1724, 40.8365],
    shortDescription: "A trail hike, karaoke, and time together in New York.", category: "travel", cover: "img/history-docx/image96.webp",
    story: "Yimin came to New York to visit Hui. We hiked the Blue Blaze Trail in New Jersey, sang karaoke in Flushing, and made the most of our time together.",
    gallery: ["img/history-docx/image23.webp"]
  },
  {
    id: "smokies-2025", date: "2025-10", dateLabel: "October 2025", year: 2025,
    title: "An autumn in the Smokies", location: "Great Smoky Mountains · Tennessee & North Carolina", coordinates: [-83.4985, 35.5629],
    shortDescription: "Clingmans Dome and Alum Cave Bluffs in fall color.", category: "travel", cover: "img/history-docx/image79.webp",
    story: "We met in Atlanta and continued to the Great Smoky Mountains, hiking to Clingmans Dome and Alum Cave Bluffs together.", gallery: ["img/history-docx/image92.webp"]
  },
  {
    id: "austin-veterans-weekend-2025", date: "2025-11", dateLabel: "November 2025", year: 2025,
    title: "A Veterans Day weekend in Austin", location: "Austin, Texas", coordinates: [-97.7431, 30.2672],
    shortDescription: "Hui visited Yimin for a cozy weekend in Austin.", category: "travel", cover: "img/history-docx/image15.webp",
    story: "Hui visited Yimin for Veterans Day weekend. We explored downtown Austin and spent time together at Nido.", gallery: ["img/history-docx/image52.webp"]
  },
  {
    id: "early-winter-2025", date: "2025-12-01", dateLabel: "December 2025", year: 2025,
    title: "A little winter visit", location: "Stony Brook, New York", coordinates: [-73.1234, 40.9126],
    shortDescription: "A Kyoto-exclusive Pikachu, and Zootopia 2.", category: "travel", cover: "img/history-docx/image90.webp",
    story: "Yimin visited Hui in Stony Brook. There were thoughtful gifts, including a Kyoto-exclusive Pikachu, and a movie date to see Zootopia 2.", gallery: ["img/history-docx/image29.webp"]
  },
  {
    id: "christmas-2025", date: "2025-12-25", dateLabel: "December 2025", year: 2025,
    title: "Christmas together", location: "New York", coordinates: [-73.9851, 40.7589],
    shortDescription: "Roses, cake, and a holiday visit.", category: "travel", cover: "img/history-docx/image22.webp",
    story: "We spent Christmas together in New York, with pink roses, cake, and a holiday visit to remember.", gallery: ["img/history-docx/image61.webp"]
  },
  {
    id: "austin-mlk-2026", date: "2026-01", dateLabel: "January 2026", year: 2026,
    title: "A long weekend in Austin", location: "Texas Capitol & Lake Travis · Austin, Texas", coordinates: [-97.7431, 30.2672],
    shortDescription: "A Capitol visit and sunset by Lake Travis.", category: "travel", cover: "img/history-docx/image36.webp",
    story: "We spent MLK weekend in Austin, visiting the Texas Capitol and taking in the view at the Oasis on Lake Travis.", gallery: ["img/history-docx/image45.webp"]
  },
  {
    id: "valentines-2026", date: "2026-02", dateLabel: "February 2026", year: 2026,
    title: "A Valentine’s lunch", location: "Baci · New York", coordinates: [-73.9851, 40.7589],
    shortDescription: "A Valentine’s visit and lunch at Baci.", category: "travel", cover: "img/history-docx/image62.webp",
    story: "We celebrated Valentine’s Day together with a visit and lunch at Baci."
  },
  {
    id: "wedding-prep-2026", date: "2026-03", dateLabel: "March 2026", year: 2026,
    title: "A garden day and wedding rings", location: "Flushing & Untermyer Gardens · New York", coordinates: [-73.8987, 40.9312],
    shortDescription: "Wedding preparations, then a walk through Untermyer Gardens.", category: "travel", cover: "img/history-docx/image60.webp",
    story: "In March, we took care of wedding preparations in Flushing and visited Untermyer Gardens in Yonkers. The rings made the future feel wonderfully close.", gallery: ["img/history-docx/image49.webp"]
  },
  {
    id: "engaged", date: "2026-04-11", dateLabel: "April 11, 2026", year: 2026,
    title: "求婚", location: "Sunset Cliffs Natural Park · San Diego, California", coordinates: [-117.2543, 32.7191],
    shortDescription: "A sunset proposal by the Pacific.", milestone: "engagement", category: "highlight", cover: "img/history-docx/img_1119.webp",
    story: "On April 11, 2026, at Sunset Cliffs Natural Park in San Diego, we got engaged. The proposal was part of a California trip filled with coastlines, gardens, and time together.\n\nWe explored Balboa Park, La Jolla, Scripps Pier, Torrey Pines, Annie’s Canyon, Sea Cliff Coastal Bluff Trail, and Mount Soledad, with a celebratory king crab dinner after the proposal.",
    gallery: ["img/history-docx/image24.webp", "img/history-docx/image28.webp", "img/history-docx/image57.webp", "img/history-docx/image47.webp", "img/history-docx/image89.webp", "img/history-docx/image12.webp", "img/history-docx/image85.webp", "img/history-docx/image20.webp"]
  },
  {
    id: "brookcon-2026", date: "2026-05-01", dateLabel: "May 2026", year: 2026,
    title: "Brookcon together", location: "Stony Brook, New York", coordinates: [-73.1234, 40.9126],
    shortDescription: "A spring visit and a campus convention.", category: "travel", cover: "img/history-docx/image77.webp",
    story: "Yimin visited Hui in May, and we went to Brookcon together at Stony Brook."
  },
  {
    id: "wedding-road-trip-before", date: "2026-05", sortDate: "2026-05-19", dateLabel: "May 2026 · Before the wedding", year: 2026,
    title: "The road to Las Vegas", location: "Zion · Bryce Canyon · Antelope Canyon · Grand Canyon", coordinates: [-112.9874, 37.2982],
    shortDescription: "A national parks road trip just before our wedding.", category: "travel", cover: "img/history-docx/image32.webp",
    story: "Before the ceremony, we made a road trip through Zion, Bryce Canyon, Antelope Canyon, and the Grand Canyon. We also visited the Marriage Certificate Office the day before the wedding.",
    gallery: ["img/history-docx/image91.webp", "img/history-docx/image46.webp", "img/history-docx/image63.webp", "img/history-docx/image80.webp"]
  },
  {
    id: "married", date: "2026-05-20", dateLabel: "May 20, 2026", year: 2026,
    title: "囍", location: "Little White Wedding Chapel · Las Vegas, Nevada", coordinates: [-115.149554, 36.1551905],
    shortDescription: "We got married in Las Vegas.", milestone: "marriage", category: "highlight", cover: "img/history-docx/dsc01058.webp",
    story: "On May 20, 2026, we were married at the Little White Wedding Chapel in Las Vegas. A day we had dreamed about became the beginning of our life as a family.",
    gallery: ["img/history-docx/image31.webp", "img/history-docx/image13.webp", "img/history-docx/image19.webp", "img/history-docx/image80.webp"]
  },
  {
    id: "southwest-honeymoon-2026", date: "2026-05", sortDate: "2026-05-21", dateLabel: "May 2026 · After the wedding", year: 2026,
    title: "West through the desert", location: "Sedona · Saguaro National Park · White Sands", coordinates: [-111.761, 34.8697],
    shortDescription: "A newlywed road trip from Las Vegas toward Austin.", category: "travel", cover: "img/history-docx/image75.webp",
    story: "After the wedding, we drove from Las Vegas toward Austin, with memorable stops in Sedona, Saguaro National Park, and White Sands.",
    gallery: ["img/history-docx/image58.webp", "img/history-docx/image44.webp"]
  },
  {
    id: "brooklyn-festival-2026", date: "2026-07", dateLabel: "July 2026", year: 2026,
    title: "A summer festival", location: "Brooklyn, New York", coordinates: [-73.9442, 40.6782],
    shortDescription: "Anitomo Festival during summer break.", category: "travel", cover: "img/history-docx/image59.webp",
    story: "We spent part of summer break together at Anitomo Festival in Brooklyn."
  },
  {
    id: "hui-birthday-2026", date: "2026-08", dateLabel: "August 2026", year: 2026,
    title: "Hui’s birthday in Las Vegas", location: "Las Vegas, Nevada", coordinates: [-115.149554, 36.1551905],
    shortDescription: "Golden Tiki, Awakening, Meow Wolf, and birthday cake.", category: "travel", cover: "img/history-docx/image2.webp",
    story: "We celebrated Hui’s birthday in Las Vegas with dinner at Golden Tiki, the Awakening show, Meow Wolf, and cake.",
    gallery: ["img/history-docx/image21.webp", "img/history-docx/image52.webp", "img/history-docx/image56.webp"]
  },
  {
    id: "yimin-birthday-2026", date: "2026-08", dateLabel: "August 2026", year: 2026,
    title: "Yimin’s birthday in Austin", location: "Austin, Texas", coordinates: [-97.7431, 30.2672],
    shortDescription: "Cake, bubble tea, and roses for Yimin.", category: "travel", cover: "img/history-docx/image1.webp",
    story: "We celebrated Yimin’s birthday in Austin with cake, bubble tea, and roses.", gallery: ["img/history-docx/image61.webp"]
  }
];
