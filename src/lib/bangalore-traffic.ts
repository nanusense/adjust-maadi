export interface TrafficCorridor {
  name: string;
  kannada: string;
  from: string;
  to: string;
  peakHours: number[][]; // [startHour, endHour] pairs
  severity: "severe" | "heavy" | "moderate";
  tip: string;
  metroAlternative?: string;
  alternateRoute?: string;
}

export interface MetroLine {
  name: string;
  color: string;
  from: string;
  to: string;
  stations: number;
  km: number;
  firstTrain: string;
  lastTrain: string;
  frequency: string;
  fare: string;
  status: "operational" | "partial" | "construction";
  keyStations: string[];
  interchangeAt: string[]; // stations shared with another line
  connects: string; // what it links / why it matters
}

export const TRAFFIC_CORRIDORS: TrafficCorridor[] = [
  {
    name: "Silk Board Junction",
    kannada: "ಸಿಲ್ಕ್ ಬೋರ್ಡ್",
    from: "Koramangala",
    to: "Electronic City",
    peakHours: [[7, 11], [17, 21]],
    severity: "severe",
    tip: "The worst junction in Bangalore. If you must cross it, leave before 7am or after 9pm. Or take the metro to Bommasandra.",
    metroAlternative: "Green Line to Silk Institute",
    alternateRoute: "Hosur Road via Sarjapur Road outer ring",
  },
  {
    name: "Hebbal Flyover",
    kannada: "ಹೆಬ್ಬಾಳ ಫ್ಲೈಓವರ್",
    from: "Outer Ring Road North",
    to: "Airport Road",
    peakHours: [[6, 10], [17, 20]],
    severity: "severe",
    tip: "The gateway to the airport. Leave for the airport at least 90 mins early during peak hours. Bellary Road gets completely locked.",
    alternateRoute: "Thanisandra Main Road or Nagawara via New Airport Road",
  },
  {
    name: "Marathahalli Bridge",
    kannada: "ಮರಾಠಹಳ್ಳಿ ಸೇತುವೆ",
    from: "Whitefield / KR Puram",
    to: "Central Bangalore",
    peakHours: [[7, 11], [17, 21]],
    severity: "severe",
    tip: "The IT corridor's daily nightmare. The bridge itself is the bottleneck. Use Kadubeesanahalli or Sarjapur ORR instead.",
    alternateRoute: "Kadubeesanahalli junction or Tin Factory via ORR",
  },
  {
    name: "KR Puram Bridge",
    kannada: "ಕೆ.ಆರ್. ಪುರ ಸೇತುವೆ",
    from: "Whitefield",
    to: "Tin Factory / Indiranagar",
    peakHours: [[7, 10], [17, 21]],
    severity: "heavy",
    tip: "The old railway bridge creates a permanent bottleneck. Metro Purple Line from Whitefield to Indiranagar is a genuine escape.",
    metroAlternative: "Purple Line: Whitefield to Indiranagar (26 min)",
    alternateRoute: "Hoodi Junction via Budigere Road",
  },
  {
    name: "Tin Factory Junction",
    kannada: "ಟಿನ್ ಫ್ಯಾಕ್ಟರಿ",
    from: "KR Puram",
    to: "Indiranagar / Banaswadi",
    peakHours: [[7, 10], [17, 21]],
    severity: "heavy",
    tip: "Four roads converge here with no proper grade separator. Metro Purple Line runs parallel and is far faster.",
    metroAlternative: "Purple Line: Baiyappanahalli to Indiranagar",
  },
  {
    name: "Bannerghatta Road",
    kannada: "ಬನ್ನೇರಘಟ್ಟ ರಸ್ತೆ",
    from: "JP Nagar",
    to: "BTM Layout / Silk Board",
    peakHours: [[8, 10], [17, 21]],
    severity: "heavy",
    tip: "The Green Line metro along this corridor will transform South Bangalore. Until then, leave early or late.",
    metroAlternative: "Green Line (under construction on this stretch)",
    alternateRoute: "Kanakapura Road or Mysore Road via NICE corridor",
  },
  {
    name: "Hosur Road",
    kannada: "ಹೊಸೂರು ರಸ್ತೆ",
    from: "Silk Board",
    to: "Electronic City",
    peakHours: [[7, 10], [17, 21]],
    severity: "heavy",
    tip: "The 18km stretch from Silk Board to Electronic City can take 2 hours at peak. Metro Green Line (Silk Institute) reaches the end now.",
    metroAlternative: "Green Line to Silk Institute / Bommasandra",
  },
  {
    name: "Mysore Road",
    kannada: "ಮೈಸೂರು ರಸ್ತೆ",
    from: "Sirsi Circle",
    to: "Kengeri",
    peakHours: [[7, 10], [17, 20]],
    severity: "moderate",
    tip: "The Purple Line extension to Kengeri has massively eased this corridor. If you're going west, consider the metro.",
    metroAlternative: "Purple Line to Kengeri or Challaghatta",
  },
  {
    name: "Old Madras Road",
    kannada: "ಹಳೆ ಮದ್ರಾಸ್ ರಸ್ತೆ",
    from: "Tin Factory",
    to: "KR Puram / Hoskote",
    peakHours: [[7, 10], [17, 20]],
    severity: "moderate",
    tip: "Gets congested at railway crossings. The Purple Line extension towards Whitefield has reduced pressure significantly.",
    metroAlternative: "Purple Line: Indiranagar to Whitefield",
  },
  {
    name: "Outer Ring Road (South)",
    kannada: "ಔಟರ್ ರಿಂಗ್ ರೋಡ್",
    from: "Silk Board",
    to: "Marathahalli",
    peakHours: [[7, 10], [17, 21]],
    severity: "severe",
    tip: "The IT corridor ORR is Bangalore's most congested stretch. 6km can take 90 minutes. There is no easy fix — leave early.",
    alternateRoute: "Sarjapur Road inner stretch or Bellandur bypass",
  },
];

export const METRO_LINES: MetroLine[] = [
  {
    name: "Purple Line",
    color: "#7C3AED",
    from: "Whitefield (Kadugodi)",
    to: "Challaghatta",
    stations: 37,
    km: 56.1,
    firstTrain: "5:00 AM",
    lastTrain: "11:00 PM",
    frequency: "5–10 min (peak) / 10–15 min (off-peak)",
    fare: "₹10 – ₹60",
    status: "operational",
    interchangeAt: ["Majestic"],
    connects: "East Bangalore (Whitefield, IT corridor) to West (Kengeri, Mysore Road). The city's spine.",
    keyStations: [
      "Whitefield", "Hoodi", "KR Puram", "Baiyappanahalli", "Indiranagar",
      "Halasuru", "Trinity", "MG Road", "Cubbon Park", "Majestic",
      "City Railway Station", "Hosahalli", "Mysore Road", "Kengeri", "Challaghatta"
    ],
  },
  {
    name: "Green Line",
    color: "#16a34a",
    from: "Nagasandra",
    to: "Silk Institute",
    stations: 30,
    km: 42.3,
    firstTrain: "5:00 AM",
    lastTrain: "11:00 PM",
    frequency: "5–10 min (peak) / 10–15 min (off-peak)",
    fare: "₹10 – ₹55",
    status: "operational",
    interchangeAt: ["Majestic"],
    connects: "Peenya industrial zone (North) through the old city centre to Electronic City (South).",
    keyStations: [
      "Nagasandra", "Dasarahalli", "Peenya", "Rajajinagar", "Mahalakshmi",
      "Sandal Soap Factory", "Yeshwanthpur", "Srirampura", "Majestic",
      "Chickpete", "KR Market", "National College", "Lalbagh", "Jayanagar",
      "Banashankari", "Gottigere", "Silk Institute"
    ],
  },
  {
    name: "Yellow Line",
    color: "#D4A843",
    from: "RV Road",
    to: "Bommasandra",
    stations: 18,
    km: 18.8,
    firstTrain: "—",
    lastTrain: "—",
    frequency: "Expected: 10 min",
    fare: "₹10 – ₹50 (est.)",
    status: "construction",
    interchangeAt: [],
    connects: "When complete, will link South Bangalore's residential belt to Electronic City's tech parks.",
    keyStations: [
      "RV Road", "Jayanagar 4th Block", "Dairy Circle", "Langford Town",
      "Central Silk Board", "HSR Layout", "Agara", "Bellandur",
      "Kadubeesanahalli", "Doddakannalli", "Bommasandra"
    ],
  },
  {
    name: "Pink Line",
    color: "#EC4899",
    from: "Kalena Agrahara",
    to: "Nagawara",
    stations: 16,
    km: 21.4,
    firstTrain: "—",
    lastTrain: "—",
    frequency: "Expected: 10 min",
    fare: "₹10 – ₹50 (est.)",
    status: "construction",
    interchangeAt: [],
    connects: "Will link Gottigere in South to Nagawara in North via BTM, Koramangala and Shivajinagar.",
    keyStations: [
      "Kalena Agrahara", "Gottigere", "Hulimavu", "Banashankari", "JP Nagar",
      "Jayanagar", "Lakkasandra", "BTM Layout", "Agara", "Koramangala",
      "Indiranagar", "Halasuru", "Ulsoor", "Shivajinagar", "Pottery Town", "Nagawara"
    ],
  },
];

export const TRAFFIC_TIPS = [
  { time: "Before 7am", icon: "🌅", label: "Golden Window", tip: "The only time Bangalore roads truly breathe. Early risers own the city." },
  { time: "7am – 10am", icon: "🔴", label: "Peak Chaos", tip: "All major corridors are jammed. Add 60–120 minutes to any journey." },
  { time: "10am – 12pm", icon: "🟡", label: "Easing Off", tip: "Traffic clears after 10am. Central routes are manageable." },
  { time: "12pm – 4pm", icon: "🟢", label: "Midday Relief", tip: "The sweet spot. Most routes are free-flowing." },
  { time: "4pm – 9pm", icon: "🔴", label: "Evening Rush", tip: "Worse than morning. Silk Board and ORR can be 90+ minute ordeals." },
  { time: "After 9pm", icon: "🌙", label: "Night Freedom", tip: "Bangalore at night is a different city. Roads are clear, the air is cool." },
];
