// data.js

const SCENARIO_TEXT = "The year is 2028. The nation is at a crossroads. Following a tumultuous decade, the electorate is fractured. The Rust Belt is trending right, the Sun Belt is trending left, and new coalitions are forming. You must navigate the primaries, select a VP to balance your ticket, and manage your resources to win 270 Electoral Votes.";

const PARTIES = {
    D: { name: "Democratic Party", color: "#00AEF3", chair: "Jaime Harrison", chair_img: "images/dem_chair.jpg", desc: "Platform: Climate Action, Healthcare Expansion, Social Equality." },
    R: { name: "Republican Party", color: "#E81B23", chair: "Michael Whatley", chair_img: "images/gop_chair.jpg", desc: "Platform: Border Security, Economic Deregulation, Traditional Values." },
    I: { name: "Independent", color: "#F2C75C", chair: "N/A", chair_img: "images/scenario.jpg", desc: "Platform: Electoral Reform, Anti-Corruption, Centrist Solutions." }
};

const CANDIDATES = [
    // DEMOCRATS
    { id: "newsom", name: "Gavin Newsom", party: "D", home: "CA", desc: "Media-savvy Governor of California.", buff: "Fundraising Machine (Cash x1.2)", img: "images/newsom.jpg" },
    { id: "harris", name: "Kamala Harris", party: "D", home: "CA", desc: "Former Vice President.", buff: "Base Turnout (+Safe D States)", img: "images/harris.jpg" },
    { id: "whitmer", name: "Gretchen Whitmer", party: "D", home: "MI", desc: "Governor of Michigan.", buff: "Rust Belt Appeal (+MI/WI/PA)", img: "images/whitmer.jpg" }, // Use placeholder if file missing
    { id: "shapiro", name: "Josh Shapiro", party: "D", home: "PA", desc: "Popular PA Governor.", buff: "Swing State King (+PA)", img: "images/shapiro.jpg" },
    { id: "buttigieg", name: "Pete Buttigieg", party: "D", home: "MI", desc: "Transportation Secretary.", buff: "Media Darling (+Global Polls)", img: "images/buttigieg.jpg" },
    
    // REPUBLICANS
    { id: "vance", name: "JD Vance", party: "R", home: "OH", desc: "The populist standard-bearer.", buff: "Rust Belt Appeal (+OH/PA)", img: "images/vance.jpg" },
    { id: "desantis", name: "Ron DeSantis", party: "R", home: "FL", desc: "Governor of Florida.", buff: "Culture Warrior (+FL/TX)", img: "images/desantis.jpg" },
    { id: "haley", name: "Nikki Haley", party: "R", home: "SC", desc: "Former UN Ambassador.", buff: "Suburban Appeal (+VA/CO)", img: "images/haley.jpg" },
    { id: "ramaswamy", name: "Vivek Ramaswamy", party: "R", home: "OH", desc: "Tech Entrepreneur.", buff: "Self-Funder (Start with $5M)", img: "images/vance.jpg" }, // Reuse image if needed

    // INDEPENDENT
    { id: "yang", name: "Andrew Yang", party: "I", home: "NY", desc: "Forward Party Founder.", buff: "UBI Appeal (+Youth Vote)", img: "images/yang.jpg" }
];

// Initial Game State Data (Polling & EV)
// Polling > 50 is Democrat, < 50 is Republican. 50 is tie.
const STATE_DATA = {
    "AL": { name: "Alabama", ev: 9, polling: 35 },
    "AK": { name: "Alaska", ev: 3, polling: 42 },
    "AZ": { name: "Arizona", ev: 11, polling: 49 }, // Swing
    "AR": { name: "Arkansas", ev: 6, polling: 35 },
    "CA": { name: "California", ev: 54, polling: 65 },
    "CO": { name: "Colorado", ev: 10, polling: 56 },
    "CT": { name: "Connecticut", ev: 7, polling: 59 },
    "DE": { name: "Delaware", ev: 3, polling: 60 },
    "DC": { name: "District of Columbia", ev: 3, polling: 90 },
    "FL": { name: "Florida", ev: 30, polling: 45 },
    "GA": { name: "Georgia", ev: 16, polling: 48 }, // Swing
    "HI": { name: "Hawaii", ev: 4, polling: 68 },
    "ID": { name: "Idaho", ev: 4, polling: 30 },
    "IL": { name: "Illinois", ev: 19, polling: 57 },
    "IN": { name: "Indiana", ev: 11, polling: 40 },
    "IA": { name: "Iowa", ev: 6, polling: 43 },
    "KS": { name: "Kansas", ev: 6, polling: 40 },
    "KY": { name: "Kentucky", ev: 8, polling: 35 },
    "LA": { name: "Louisiana", ev: 8, polling: 38 },
    "ME": { name: "Maine", ev: 4, polling: 55 },
    "MD": { name: "Maryland", ev: 10, polling: 63 },
    "MA": { name: "Massachusetts", ev: 11, polling: 65 },
    "MI": { name: "Michigan", ev: 15, polling: 51 }, // Swing
    "MN": { name: "Minnesota", ev: 10, polling: 53 },
    "MS": { name: "Mississippi", ev: 6, polling: 38 },
    "MO": { name: "Missouri", ev: 10, polling: 41 },
    "MT": { name: "Montana", ev: 4, polling: 40 },
    "NE": { name: "Nebraska", ev: 5, polling: 38 },
    "NV": { name: "Nevada", ev: 6, polling: 50 }, // Swing
    "NH": { name: "New Hampshire", ev: 4, polling: 52 },
    "NJ": { name: "New Jersey", ev: 14, polling: 58 },
    "NM": { name: "New Mexico", ev: 5, polling: 54 },
    "NY": { name: "New York", ev: 28, polling: 60 },
    "NC": { name: "North Carolina", ev: 16, polling: 48 }, // Swing
    "ND": { name: "North Dakota", ev: 3, polling: 30 },
    "OH": { name: "Ohio", ev: 17, polling: 45 },
    "OK": { name: "Oklahoma", ev: 7, polling: 32 },
    "OR": { name: "Oregon", ev: 8, polling: 58 },
    "PA": { name: "Pennsylvania", ev: 19, polling: 50 }, // Swing
    "RI": { name: "Rhode Island", ev: 4, polling: 60 },
    "SC": { name: "South Carolina", ev: 9, polling: 42 },
    "SD": { name: "South Dakota", ev: 3, polling: 35 },
    "TN": { name: "Tennessee", ev: 11, polling: 37 },
    "TX": { name: "Texas", ev: 40, polling: 43 },
    "UT": { name: "Utah", ev: 6, polling: 38 },
    "VT": { name: "Vermont", ev: 3, polling: 65 },
    "VA": { name: "Virginia", ev: 13, polling: 54 },
    "WA": { name: "Washington", ev: 12, polling: 60 },
    "WV": { name: "West Virginia", ev: 4, polling: 28 },
    "WI": { name: "Wisconsin", ev: 10, polling: 50 }, // Swing
    "WY": { name: "Wyoming", ev: 3, polling: 25 }
};

// FULL US MAP SVG PATHS (Albers Projection)
const US_STATE_PATHS = {
    "HI": "M 295.4 533.2 L 297.1 534.5 L 305.8 535.1 L 309.8 537.1 L 306.2 539.9 L 295.4 533.2 Z M 266.1 522 L 271.7 526.4 L 265.6 523.7 Z M 255.5 516.5 L 257.6 519 L 253.3 516.5 Z",
    "FL": "M 751.3 473.5 L 760.9 474.3 L 761.6 485.8 L 763.5 488.7 L 761.9 498.4 L 759.2 507 L 748.8 498.1 L 741 483 L 714.3 467.4 Z",
    "CA": "M 52.8 210.6 L 102.4 199.4 L 140.8 292.8 L 123.6 316.6 L 102.7 313.8 L 74.2 284.2 L 40.7 224.3 Z",
    "TX": "M 333.4 313.4 L 396.9 313.6 L 401.5 387.9 L 420.7 397.7 L 420.7 416 L 425.2 430.7 L 420.6 440.1 L 396.6 464.7 L 396.8 473 L 391.2 478.5 L 354.9 463.3 L 341.3 449.6 L 333.7 438.3 Z",
    "NV": "M 52.8 210.6 L 115.3 196.2 L 140.8 292.8 L 102.6 247.9 Z",
    "OR": "M 48 207.4 L 43.2 210.6 L 39.4 218.4 L 40.7 224.3 L 52.8 210.6 L 115.3 196.2 L 109.8 174.6 L 44 186.9 Z",
    "WA": "M 44 186.9 L 109.8 174.6 L 105.9 157.9 L 47.9 168.7 Z",
    "ID": "M 109.8 174.6 L 115.3 196.2 L 147 189.2 L 157.4 227.6 L 175.6 222.7 L 179.8 162.2 Z",
    "UT": "M 115.3 196.2 L 140.8 292.8 L 180.7 282.3 L 175.6 222.7 L 147 189.2 Z",
    "AZ": "M 140.8 292.8 L 180.7 282.3 L 183.3 361.3 L 134.4 374.2 Z",
    "MT": "M 105.9 157.9 L 265.5 167.3 L 261.2 218.5 L 175.6 222.7 L 179.8 162.2 Z",
    "WY": "M 175.6 222.7 L 261.2 218.5 L 258 276.4 L 180.7 282.3 Z",
    "CO": "M 180.7 282.3 L 258 276.4 L 254.6 343.8 L 183.3 361.3 Z",
    "NM": "M 183.3 361.3 L 254.6 343.8 L 250.7 416.3 L 179.2 411.3 Z",
    "ND": "M 265.5 167.3 L 341.1 171.6 L 338.8 212.8 L 261.2 218.5 Z",
    "SD": "M 261.2 218.5 L 338.8 212.8 L 337.8 259.6 L 258 276.4 Z",
    "NE": "M 258 276.4 L 337.8 259.6 L 349.5 289.4 L 269 301.7 L 269 278.4 Z",
    "KS": "M 269 301.7 L 349.5 289.4 L 352.6 333.1 L 273.7 348 Z",
    "OK": "M 254.6 343.8 L 273.7 348 L 352.6 333.1 L 353.9 375 L 298.6 390.7 L 297.6 389 Z",
    "MN": "M 341.1 171.6 L 388.9 168.4 L 369.3 227.1 L 338.8 212.8 Z",
    "IA": "M 338.8 212.8 L 369.3 227.1 L 365 262.6 L 337.8 259.6 Z",
    "MO": "M 337.8 259.6 L 365 262.6 L 364.6 302 L 392.5 304 L 384 353 L 352.6 333.1 Z",
    "AR": "M 352.6 333.1 L 384 353 L 377.9 397.6 L 333.4 397.3 Z",
    "LA": "M 333.4 397.3 L 377.9 397.6 L 382.7 425.4 L 369.4 443.9 L 343.9 443.3 Z",
    "WI": "M 369.3 227.1 L 388.9 168.4 L 420.9 184.2 L 409.7 257.6 L 365 262.6 Z",
    "IL": "M 365 262.6 L 409.7 257.6 L 413.4 321.4 L 392.5 304 L 364.6 302 Z",
    "KY": "M 392.5 304 L 413.4 321.4 L 458 310 L 442 344 L 384 353 Z",
    "TN": "M 384 353 L 442 344 L 493.6 340 L 485 369 L 377.9 397.6 Z",
    "MS": "M 377.9 397.6 L 410 393 L 409 444 L 382.7 425.4 Z",
    "MI": "M 420.9 184.2 L 475 204 L 460 255 L 409.7 257.6 Z",
    "IN": "M 409.7 257.6 L 439 254 L 436 312 L 413.4 321.4 Z",
    "OH": "M 439 254 L 476 244 L 482 299 L 436 312 Z",
    "WV": "M 436 312 L 482 299 L 492 318 L 465 330 Z",
    "PA": "M 476 244 L 541 231 L 536 279 L 482 299 Z",
    "NY": "M 541 231 L 565 194 L 590 196 L 585 240 L 536 279 Z",
    "VT": "M 565 194 L 579 183 L 582 216 L 569 220 Z",
    "NH": "M 579 183 L 591 176 L 594 214 L 582 216 Z",
    "ME": "M 591 176 L 610 156 L 633 186 L 594 214 Z",
    "MA": "M 569 220 L 594 214 L 602 225 L 572 231 Z",
    "RI": "M 590 228 L 596 228 L 595 234 Z",
    "CT": "M 572 231 L 590 228 L 586 238 L 570 238 Z",
    "NJ": "M 536 279 L 555 272 L 552 300 L 538 290 Z",
    "DE": "M 538 290 L 552 300 L 548 312 Z",
    "MD": "M 538 290 L 548 312 L 515 315 L 492 318 Z",
    "VA": "M 465 330 L 492 318 L 548 312 L 545 348 L 458 350 Z",
    "NC": "M 458 350 L 545 348 L 526 376 L 460 366 Z",
    "SC": "M 460 366 L 526 376 L 507 400 L 455 390 Z",
    "GA": "M 455 390 L 507 400 L 505 450 L 450 445 Z",
    "AL": "M 410 393 L 455 390 L 450 445 L 420 440 Z",
    "AK": "M 90 450 L 160 450 L 180 500 L 100 520 Z", // Simplified Alaska
    "DC": "M 518 308 L 522 308 L 522 312 L 518 312 Z"
};
