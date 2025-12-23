const CANDIDATES = {
    democrats: [
        { id: "newsom", name: "Gavin Newsom", home: "CA", cash: 1.2, poll_boost: 0.0 },
        { id: "whitmer", name: "Gretchen Whitmer", home: "MI", cash: 1.0, poll_boost: 1.0 }, // +Polls
        { id: "harris", name: "Kamala Harris", home: "CA", cash: 1.3, poll_boost: 0.0 }
    ],
    republicans: [
        { id: "vance", name: "JD Vance", home: "OH", cash: 1.3, poll_boost: 0.5 },
        { id: "desantis", name: "Ron DeSantis", home: "FL", cash: 1.1, poll_boost: 0.8 },
        { id: "ramaswamy", name: "Vivek Ramaswamy", home: "OH", cash: 1.5, poll_boost: -0.5 }
    ]
};

const VPS = [
    { name: "Wes Moore", home: "MD", type: "D", effect: "Youth Vote (+Cash)" },
    { name: "Mark Kelly", home: "AZ", type: "D", effect: "Border Hawk (+AZ Polling)" },
    { name: "Josh Shapiro", home: "PA", type: "D", effect: "Rust Belt King (+PA Polling)" },
    { name: "Sarah Huckabee", home: "AR", type: "R", effect: "Base Turnout (+South Polling)" },
    { name: "Tim Scott", home: "SC", type: "R", effect: "Unity Ticket (+Cash)" },
    { name: "Tulsi Gabbard", home: "HI", type: "R", effect: "Maverick (Wildcard)" }
];

// Expanded State List (Top 15 key states for gameplay balance)
const STATES_DATA = [
    { id: "CA", name: "California", ev: 54, polling: 65, cost: 90000 },
    { id: "TX", name: "Texas", ev: 40, polling: 42, cost: 85000 },
    { id: "FL", name: "Florida", ev: 30, polling: 44, cost: 75000 },
    { id: "NY", name: "New York", ev: 28, polling: 62, cost: 70000 },
    { id: "PA", name: "Pennsylvania", ev: 19, polling: 50, cost: 60000 }, // Swing
    { id: "IL", name: "Illinois", ev: 19, polling: 58, cost: 55000 },
    { id: "OH", name: "Ohio", ev: 17, polling: 45, cost: 50000 },
    { id: "GA", name: "Georgia", ev: 16, polling: 49, cost: 48000 },     // Swing
    { id: "NC", name: "North Carolina", ev: 16, polling: 48, cost: 48000 }, // Swing
    { id: "MI", name: "Michigan", ev: 15, polling: 51, cost: 45000 },     // Swing
    { id: "AZ", name: "Arizona", ev: 11, polling: 49, cost: 40000 },      // Swing
    { id: "WI", name: "Wisconsin", ev: 10, polling: 50, cost: 38000 },    // Swing
    { id: "NV", name: "Nevada", ev: 6, polling: 50, cost: 25000 },        // Swing
    { id: "MN", name: "Minnesota", ev: 10, polling: 53, cost: 35000 },
    { id: "VA", name: "Virginia", ev: 13, polling: 54, cost: 42000 }
];