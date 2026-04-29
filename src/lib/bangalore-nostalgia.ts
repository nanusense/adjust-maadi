export interface NostalgiaPhoto {
  id: string;
  thenName: string;
  nowName: string;
  era: string;
  description: string;
  photo: string;
  credit: string; // Wikimedia Commons source
}

export const NOSTALGIA_PHOTOS: NostalgiaPhoto[] = [
  {
    id: "south-parade",
    thenName: "South Parade",
    nowName: "Mahatma Gandhi Road (MG Road)",
    era: "circa 1880",
    description:
      "The grand promenade of British Bangalore. Horse carriages, colonial bungalows, and the crisp air of the Cantonment. Today it is the city's most famous commercial street.",
    photo:
      "https://upload.wikimedia.org/wikipedia/commons/6/68/South_Parade%2C_Bangalore.jpg",
    credit: "Wikimedia Commons / Public Domain",
  },
  {
    id: "cubbon-park-colonial",
    thenName: "Cubbon Park",
    nowName: "Sri Chamarajendra Park (Cubbon Park)",
    era: "circa 1870",
    description:
      "Laid out by Richard Sankey in 1870 as a public recreation ground for the residents of Bangalore. The same canopy of trees, 150 years on, still shades the city's morning walkers.",
    photo:
      "https://upload.wikimedia.org/wikipedia/commons/f/ff/Cubbon_Park%2C_Bangalore_-_Colonial_India.jpg",
    credit: "Wikimedia Commons / Public Domain",
  },
  {
    id: "cubbon-park-postcard",
    thenName: "Cubbon Park",
    nowName: "Sri Chamarajendra Park (Cubbon Park)",
    era: "early 1900s",
    description:
      "A vintage picture postcard of Cubbon Park from the turn of the century. The park's grand iron railings, lamp posts, and gravel paths made it Bangalore's most civilised address.",
    photo:
      "https://upload.wikimedia.org/wikipedia/commons/d/dd/Cubbon_Park%2C_Bangalore_%28TuckDB_Postcard%29.jpg",
    credit: "TuckDB Postcards / Wikimedia Commons / Public Domain",
  },
  {
    id: "lalbagh-1794",
    thenName: "Lalbagh Gardens",
    nowName: "Lalbagh Botanical Garden",
    era: "1794",
    description:
      "One of the oldest depictions of Lalbagh, drawn just decades after Hyder Ali founded the garden in 1760. The cypress avenues and rose beds were already legendary across the Deccan.",
    photo:
      "https://upload.wikimedia.org/wikipedia/commons/9/94/Lal_bagh_gardens1794.jpg",
    credit: "Wikimedia Commons / Public Domain",
  },
  {
    id: "lalbagh-gate",
    thenName: "Gateway of Lalbagh",
    nowName: "Lalbagh Botanical Garden East Gate",
    era: "1860s",
    description:
      "The ornate gateway to Lalbagh photographed in the 1860s. Built under Tipu Sultan, the gate's arched stonework is one of the oldest surviving structures in Bangalore.",
    photo:
      "https://upload.wikimedia.org/wikipedia/commons/e/ec/Gateway_of_Lalbaug_garden.jpg",
    credit: "Wikimedia Commons / Public Domain",
  },
  {
    id: "glass-house-lalbagh",
    thenName: "Glass House, Lalbagh",
    nowName: "Lalbagh Glass House",
    era: "19th century",
    description:
      "The iconic Glass House, modelled on the Crystal Palace in London, was built in 1889 for the Mysore Industrial and Agricultural Exhibition. It still hosts the legendary Republic Day and Independence Day flower shows.",
    photo:
      "https://upload.wikimedia.org/wikipedia/commons/1/16/Glass_House%2C_Lalbough%2C_Bangalore.jpg",
    credit: "Wikimedia Commons / Public Domain",
  },
  {
    id: "mysore-govt-offices",
    thenName: "Mysore Government Offices",
    nowName: "High Court of Karnataka",
    era: "19th century",
    description:
      "The grand Indo-Saracenic buildings that housed the Government of Mysore. Today they form the sprawling High Court campus on the edge of Cubbon Park, still one of Bangalore's most imposing landmarks.",
    photo:
      "https://upload.wikimedia.org/wikipedia/commons/b/b4/Mysore_Government_Offices%2C_Cubbon_Park%2C_Bangalore.jpg",
    credit: "Wikimedia Commons / Public Domain",
  },
  {
    id: "new-market",
    thenName: "New Market",
    nowName: "KR Market (Krishna Rajendra Market)",
    era: "19th century",
    description:
      "The bustling New Market of colonial Bangalore, opened in 1874. Today KR Market is Asia's largest wholesale flower market: a riot of marigolds, roses, and jasmine every single morning.",
    photo:
      "https://upload.wikimedia.org/wikipedia/commons/f/f4/New_Market%2C_Bangalore.jpg",
    credit: "Wikimedia Commons / Public Domain",
  },
  {
    id: "queen-victoria",
    thenName: "Queen Victoria's Statue",
    nowName: "Cubbon Park (statue relocated)",
    era: "19th century",
    description:
      "The Queen Victoria statue that once stood at the heart of Bangalore Cantonment. A symbol of the colonial era that shaped the city's distinct dual identity: the old Pete and the new Cantonment.",
    photo:
      "https://upload.wikimedia.org/wikipedia/commons/5/51/Queen_Victoria%27s_Statue%2C_Bangalore.jpg",
    credit: "Wikimedia Commons / Public Domain",
  },
  {
    id: "st-marks-church",
    thenName: "St. Mark's Church",
    nowName: "St. Mark's Cathedral",
    era: "19th century",
    description:
      "St. Mark's Church photographed in the 1800s. Consecrated in 1816, it is one of the oldest churches in Bangalore. The building looks almost identical today, a quiet island in the middle of a roaring city.",
    photo:
      "https://upload.wikimedia.org/wikipedia/commons/7/71/St._Mark%27s_Church%2C_Bangalore.jpg",
    credit: "Wikimedia Commons / Public Domain",
  },
  {
    id: "hussars-barracks",
    thenName: "Hussars Barracks",
    nowName: "Indiranagar / Defence Colony area",
    era: "19th century",
    description:
      "The cantonment barracks that housed British cavalry regiments. The grid streets of today's Indiranagar and Defence Colony still follow the precise military geometry laid out in this era.",
    photo:
      "https://upload.wikimedia.org/wikipedia/commons/b/b4/Hussars_Barracks%2C_Bangalore.jpg",
    credit: "Wikimedia Commons / Public Domain",
  },
  {
    id: "bowring-institute",
    thenName: "Bowring Institute",
    nowName: "Bowring Institute (still standing)",
    era: "19th century",
    description:
      "The Bowring Institute, founded in 1868 and named after Chief Commissioner Lewin Bowring. One of Bangalore's oldest clubs, it still stands on St. Mark's Road, largely unchanged, serving as a quiet anchor to the colonial era.",
    photo:
      "https://upload.wikimedia.org/wikipedia/commons/c/c8/Bowring_Institute%2C_Bangalore.jpg",
    credit: "Wikimedia Commons / Public Domain",
  },
];
