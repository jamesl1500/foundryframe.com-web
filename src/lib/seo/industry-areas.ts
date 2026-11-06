/**
 * Industry + area landing pages - Foundry Frame
 * ===============================================
 * Content for /industries/[slug]/[area], e.g. "Contractor websites in Lorain
 * County". Each page pairs one industry with one area and has to earn its
 * place with copy that only makes sense for that pair: local demand, local
 * competition, the towns people search by. If a new page would read the same
 * as its parent industry page with a place name swapped in, don't add it;
 * Google treats those as doorway pages.
 *
 * Only add areas Foundry Frame actually serves, and say honestly how (in
 * person around Lorain County and Cleveland, remotely for Columbus).
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

export type IndustryAreaPage = {
  /** Matches an IndustryPage slug in industries.ts. */
  industrySlug: string;
  /** URL segment, e.g. "lorain-county-oh". */
  areaSlug: string;
  /** Display name, e.g. "Lorain County". */
  area: string;
  /** Towns named on the page; ones with a /locations page get linked. */
  towns: string[];
  /** Under 60 characters with the " | Foundry Frame" suffix where possible. */
  title: string;
  metaDescription: string;
  headline: string;
  intro: string[];
  localFactors: { title: string; description: string }[];
  checklist: string[];
  faqs: { q: string; a: string }[];
};

const LORAIN_COUNTY_TOWNS = [
  "Lorain",
  "Elyria",
  "Avon",
  "Avon Lake",
  "North Ridgeville",
  "Amherst",
  "Sheffield Village",
  "Sheffield Lake",
  "Oberlin",
  "Vermilion",
  "Wellington",
  "Grafton",
];

const CUYAHOGA_COUNTY_TOWNS = [
  "Cleveland",
  "Lakewood",
  "Westlake",
  "Rocky River",
  "Bay Village",
  "North Olmsted",
  "Parma",
  "Strongsville",
  "Cleveland Heights",
  "Shaker Heights",
  "Euclid",
  "Solon",
];

const FRANKLIN_COUNTY_TOWNS = [
  "Columbus",
  "Dublin",
  "Westerville",
  "Hilliard",
  "Upper Arlington",
  "Worthington",
  "Grandview Heights",
  "Bexley",
  "Gahanna",
  "Grove City",
  "Reynoldsburg",
  "New Albany",
];

export const industryAreas: IndustryAreaPage[] = [
  /* ------------------------------------------------------------------
     Contractors & home services, Lorain County
     ------------------------------------------------------------------ */
  {
    industrySlug: "contractors",
    areaSlug: "lorain-county-oh",
    area: "Lorain County",
    towns: LORAIN_COUNTY_TOWNS,
    title: "Contractor Websites in Lorain County, OH",
    metaDescription:
      "Websites for Lorain County contractors, landscapers, and home service pros. Town-by-town service pages, seasonal offers, and quote forms. From $1,500.",
    headline: "Contractor websites for Lorain County",
    intro: [
      "Homeowners in Lorain County don't search for “contractor.” They search for “roofer in Elyria,” “leaf cleanup Avon Lake,” or “gutter repair North Ridgeville,” usually on a phone and usually right after something broke. The contractors who get those calls have a page for the job and a page for the town, and a phone number that's one tap away.",
      "We're based in Lorain and build websites for trades and home service businesses across the county. We've done it for our own lawn care business, so the site plan comes from what actually brought in booked jobs, not from a template.",
    ],
    localFactors: [
      {
        title: "Built around the seasons here",
        description:
          "Spring storm damage, summer mowing, fall leaf cleanups, and snow off the lake each bring a different rush of searches. We set up a seasonal banner and offer section you can swap in a minute, so the site always leads with what people need this month.",
      },
      {
        title: "One page per town you serve",
        description:
          "Older homes in Lorain and Elyria and new subdivisions in Avon and North Ridgeville need different work, and people search by their own town. Each service-area page speaks to that town's jobs instead of repeating the same paragraph with a new name.",
      },
      {
        title: "Proof before the first call",
        description:
          "Before-and-after sliders, the towns you've worked in, your license and insurance details, and reviews pulled from your Google Business Profile. Homeowners comparing three quotes pick the one they already trust.",
      },
    ],
    checklist: [
      "A page for each service you want more of",
      "Service-area pages for the Lorain County towns you cover",
      "Seasonal offer banner you can update yourself",
      "Quote form that asks for photos and the address",
      "Sticky call and text buttons on mobile",
      "Google Business Profile, reviews, and LocalBusiness schema lined up",
    ],
    faqs: [
      {
        q: "Will my contractor website show up when people in Elyria or Avon search?",
        a: "That's what the service-area pages are for. Each one targets a town you work in, with its own content and links to your services, and your Google Business Profile lists the same towns. Rankings take a few months to build, but those pages are what Google needs to match you to a town search.",
      },
      {
        q: "I only work certain months. Is a website still worth it?",
        a: "Yes, as long as it changes with the season. A site that leads with spring cleanups in April and snow removal in November keeps booking work, and off-season it collects quote requests for next year.",
      },
      {
        q: "Can you meet at a job site or my shop?",
        a: "Yes. We're in Lorain, so meeting anywhere in the county is easy, and we can take photos of your crew and finished jobs while we're there. Real photos do far more than stock images.",
      },
      {
        q: "What does a contractor website cost in Lorain County?",
        a: "Custom sites start at $1,500 for a focused 5-page site. Most contractors add a few service-area pages; we'll quote the exact number of towns and services on a free call.",
      },
    ],
  },

  /* ------------------------------------------------------------------
     Restaurants & cafés, Lorain County
     ------------------------------------------------------------------ */
  {
    industrySlug: "restaurants",
    areaSlug: "lorain-county-oh",
    area: "Lorain County",
    towns: LORAIN_COUNTY_TOWNS,
    title: "Restaurant Websites in Lorain County, OH",
    metaDescription:
      "Restaurant and café websites for Lorain County, from the lakeshore to Oberlin. Mobile menus, online ordering, and summer-season updates. From $1,500.",
    headline: "Restaurant websites for Lorain County",
    intro: [
      "Lorain County dining runs on two crowds: regulars who already know your name, and summer visitors heading along the lake from Avon Lake to Vermilion who are deciding where to eat from a phone in the parking lot. Your website has to work for both, fast.",
      "We're a Lorain studio, so we know a weekday lunch spot in Elyria and a patio on the lake need different things from a website. We build menus that load instantly, put ordering and directions one tap away, and make it easy to update hours when the season changes.",
    ],
    localFactors: [
      {
        title: "Ready for lake season",
        description:
          "Patio hours, live music nights, and summer specials change from May to September. We set up an events and announcements section you update yourself, so visitors driving the lakeshore see what's on tonight, not last October's hours.",
      },
      {
        title: "College-town weekends",
        description:
          "Oberlin's move-in, Commencement, and visiting-family weekends bring crowds who don't know the area. Clear menus, reservation links, and large-party information help you fill those tables.",
      },
      {
        title: "A menu as varied as Lorain",
        description:
          "“The International City” has food from dozens of traditions. Real HTML menus, not PDFs, let Google read your dishes, so someone searching for a specific cuisine nearby can actually find you.",
      },
    ],
    checklist: [
      "Mobile menu pages Google can read",
      "Online ordering through the system you already use",
      "Seasonal hours and patio status you can change in a minute",
      "Events and live music calendar",
      "Catering and private party inquiry form",
      "Restaurant schema and Google Business Profile hours that match",
    ],
    faqs: [
      {
        q: "How do I stop people seeing the wrong hours in summer and winter?",
        a: "We keep your hours in one place on the site and walk you through matching them, including holiday hours, in your Google Business Profile. Changing seasonal hours then takes a minute, not a call to a developer.",
      },
      {
        q: "Can the website take orders so I stop paying app commissions?",
        a: "Yes. We link or embed ordering from Toast, Square, or the system you already use, so regulars can order direct. Delivery apps can stay for reach, but your own customers don't have to go through them.",
      },
      {
        q: "We're a small café. Is a custom site overkill?",
        a: "Our smallest sites are a handful of pages: menu, hours and location, about, and contact. They start at $1,500, and they're built so you can update the menu yourself.",
      },
    ],
  },

  /* ------------------------------------------------------------------
     Salons, spas & beauty, Lorain County
     ------------------------------------------------------------------ */
  {
    industrySlug: "salons-and-spas",
    areaSlug: "lorain-county-oh",
    area: "Lorain County",
    towns: LORAIN_COUNTY_TOWNS,
    title: "Salon & Spa Websites in Lorain County, OH",
    metaDescription:
      "Websites for Lorain County salons, spas, barbers, and suite owners. Online booking, service menus with prices, and portfolio galleries. From $1,500.",
    headline: "Salon and spa websites for Lorain County",
    intro: [
      "A lot of Lorain County beauty pros work out of suites in Avon, Elyria, and North Ridgeville, and many clients find them through Instagram first. That works until someone searches “balayage near me” or “bridal hair Avon Lake” and your page isn't there, or they land on your profile and can't find prices or a booking link.",
      "We build salon and spa websites that turn a scroll into a booked appointment: real service menus with prices, your best work up front, and booking connected to the app you already use.",
    ],
    localFactors: [
      {
        title: "Made for suite owners, too",
        description:
          "If you rent a suite, your website is your storefront. One clear site for you or your team does what a shared building listing can't: your name, your work, and your booking link in one place.",
      },
      {
        title: "Wedding season by the lake",
        description:
          "Spring through fall brings weddings at lakefront and countryside venues around the county. A bridal page with trial details, travel fees, and an inquiry form books those parties months ahead.",
      },
      {
        title: "Searchable services and prices",
        description:
          "Clients search for the service, not the salon name. A page per signature service, with starting prices, lets Google send them to you instead of a booking app's listing.",
      },
    ],
    checklist: [
      "Online booking through Vagaro, Square, Boulevard, or GlossGenius",
      "Service menu with starting prices",
      "Portfolio gallery that loads fast on a phone",
      "Bridal and event inquiry page",
      "Gift cards and new-client offers",
      "Instagram feed and Google reviews on the page",
    ],
    faqs: [
      {
        q: "I already get clients from Instagram. Why do I need a website?",
        a: "Instagram is how people find your style. A website is how they find you on Google, check prices, and book without messaging you. It also keeps working if the algorithm stops showing your posts.",
      },
      {
        q: "Can the website work with my current booking app?",
        a: "Yes. We connect the booking tool you already use, so appointments still land in the same calendar. Nothing about how you run your day has to change.",
      },
      {
        q: "Do you work with independent stylists, not just full salons?",
        a: "Yes. Many of the sites we'd build in the county are for one or two people in a suite. A focused site starts at $1,500 and can grow if you add staff.",
      },
    ],
  },

  /* ------------------------------------------------------------------
     Real estate agents & teams, Lorain County
     ------------------------------------------------------------------ */
  {
    industrySlug: "real-estate",
    areaSlug: "lorain-county-oh",
    area: "Lorain County",
    towns: LORAIN_COUNTY_TOWNS,
    title: "Real Estate Websites in Lorain County, OH",
    metaDescription:
      "Websites for Lorain County real estate agents and teams. Community pages, IDX listings, and lead capture that builds your own brand. From $1,500.",
    headline: "Real estate agent websites for Lorain County",
    intro: [
      "Lorain County covers very different markets: lakefront homes in Avon Lake and Vermilion, newer subdivisions in Avon and North Ridgeville, older and more affordable homes in Lorain and Elyria, and small-town and rural property around Wellington and Grafton. Buyers moving from Cuyahoga County often don't know the differences yet, and the agent who explains them earns the client.",
      "We build agent and team websites around that local knowledge: community pages for the towns you sell in, listings from your MLS, and lead capture that sends buyers and sellers to you, not to a national portal.",
    ],
    localFactors: [
      {
        title: "Community pages that rank",
        description:
          "A real page for each town you sell in, written from your experience: commute to Cleveland on I-90 or Route 2, the lake, parks, and what homes there are like. These pages rank for “living in Avon Lake” searches and show buyers you know the area.",
      },
      {
        title: "Your brand, not your brokerage's",
        description:
          "Brokerage profile pages all look alike, and they're not yours if you switch firms. Your own site and domain carry your reviews, your listings history, and your leads wherever your license goes.",
      },
      {
        title: "Seller leads, not just buyer browsing",
        description:
          "A home value request page and sold-listing proof for the neighborhoods you work give sellers a reason to call you rather than the agent on the yard sign down the street.",
      },
    ],
    checklist: [
      "IDX listings search from your MLS",
      "Community pages for the Lorain County towns you sell in",
      "Home value request form for sellers",
      "Agent bio, reviews, and sold listings",
      "Lead routing to your CRM or inbox",
      "Fair housing and brokerage disclosures in place",
    ],
    faqs: [
      {
        q: "Can my website show MLS listings?",
        a: "Yes. We connect an IDX provider approved by your MLS so buyers can search active listings on your site. There's usually a monthly IDX fee from the provider, which we'll explain up front.",
      },
      {
        q: "Who writes the community pages?",
        a: "You bring the local knowledge and we turn it into pages. A short call per town is usually enough. Pages written from real experience rank better and convert better than generic neighborhood copy.",
      },
      {
        q: "I'm part of a team. Can we each have a profile?",
        a: "Yes. Team sites can have a profile page for each agent with their own listings and contact form, under one shared brand.",
      },
    ],
  },

  /* ------------------------------------------------------------------
     Contractors & home services, Cuyahoga County
     ------------------------------------------------------------------ */
  {
    industrySlug: "contractors",
    areaSlug: "cuyahoga-county-oh",
    area: "Cuyahoga County",
    towns: CUYAHOGA_COUNTY_TOWNS,
    title: "Contractor Websites in Cuyahoga County, OH",
    metaDescription:
      "Websites for Cleveland-area contractors and home service pros. Pages for older-home repairs, point-of-sale work, and the suburbs you cover. From $1,500.",
    headline: "Contractor websites for Cleveland and Cuyahoga County",
    intro: [
      "Much of Cuyahoga County was built before 1950. Century homes in Lakewood, Cleveland Heights, and Cleveland's west side keep roofers, masons, plumbers, and electricians busy, and the homeowners searching for them want to know you've worked on houses like theirs before they call.",
      "We're 30 minutes west in Lorain and build websites for trades and home service businesses across the county. Every site is planned around the jobs you want more of and the suburbs you actually drive to.",
    ],
    localFactors: [
      {
        title: "Point-of-sale repair work",
        description:
          "Suburbs like Cleveland Heights, Shaker Heights, and Euclid require inspections before a home is sold, and the repair lists that follow need contractors fast. A page for point-of-sale repairs, with the cities you cover, catches sellers and agents on a deadline.",
      },
      {
        title: "Old houses, specific searches",
        description:
          "“Knob and tube replacement,” “tuckpointing,” “slate roof repair”: older-home work gets searched by the exact job. A page per specialty ranks for those searches and shows you know the housing stock.",
      },
      {
        title: "Registered where you work",
        description:
          "Many Cuyahoga County cities run their own contractor registration. Listing the cities you're registered and insured in answers a homeowner's first question before they ask it.",
      },
    ],
    checklist: [
      "Service pages for the specialties older homes need",
      "Point-of-sale repair page for sellers and agents",
      "Pages for the Cuyahoga County suburbs you cover",
      "The cities you're registered and insured in",
      "Quote form with photo upload",
      "Reviews and before-and-after photos up front",
    ],
    faqs: [
      {
        q: "Can my website help me win point-of-sale repair jobs?",
        a: "Yes. A dedicated page that explains how you handle point-of-sale violation lists, lists the cities you work in, and makes it easy for sellers and real estate agents to send you the report gets in front of people who need the work done on a deadline.",
      },
      {
        q: "There are hundreds of contractors in Cleveland. How do I stand out?",
        a: "By being specific. A site that shows the exact jobs you do, the suburbs you serve, and real photos of your work beats a generic “we do it all” site, both on Google and when a homeowner is comparing three tabs.",
      },
      {
        q: "Do you meet with Cleveland-area contractors in person?",
        a: "Yes. We're about 30 minutes from downtown Cleveland and regularly meet clients on the west side and around the county.",
      },
      {
        q: "How much does a contractor website cost?",
        a: "Custom sites start at $1,500 for a focused 5-page site. Extra service and suburb pages are quoted after a free call based on how many you need.",
      },
    ],
  },

  /* ------------------------------------------------------------------
     Restaurants & cafés, Cuyahoga County
     ------------------------------------------------------------------ */
  {
    industrySlug: "restaurants",
    areaSlug: "cuyahoga-county-oh",
    area: "Cuyahoga County",
    towns: CUYAHOGA_COUNTY_TOWNS,
    title: "Restaurant Websites in Cuyahoga County, OH",
    metaDescription:
      "Restaurant websites for Cleveland and Cuyahoga County. Fast menus, game-day and show-night specials, and ordering that skips app fees. From $1,500.",
    headline: "Restaurant websites for Cleveland and Cuyahoga County",
    intro: [
      "Cleveland eats by neighborhood. People search “Ohio City brunch,” “Tremont patio,” “Lakewood bars on Detroit,” or “dinner near Playhouse Square,” and the restaurants that show up are the ones whose websites say exactly where they are and what's happening tonight.",
      "We build restaurant websites for independent spots around the county, from neighborhood cafés to chef-driven dining rooms, with menus that load instantly and ordering, reservations, and directions one tap away.",
    ],
    localFactors: [
      {
        title: "Game nights and show nights",
        description:
          "Browns, Guardians, and Cavaliers games and Playhouse Square curtain times all send crowds looking for a meal nearby, on a schedule. A pre-game and pre-show page with timing and parking details catches those searches.",
      },
      {
        title: "Neighborhood search",
        description:
          "Your neighborhood name is part of how people find you. We build it into your pages, schema, and Google Business Profile, so you show up for “Gordon Square,” “Little Italy,” or “Rocky River,” not just “Cleveland.”",
      },
      {
        title: "Patio season is short",
        description:
          "Cleveland patios get a few good months. A homepage banner you can switch in a minute tells people the patio is open, the igloos are up, or the kitchen is closed for a private event.",
      },
    ],
    checklist: [
      "Menus Google can read, not PDFs",
      "Reservations and direct online ordering",
      "Pre-game and pre-show info with parking",
      "Patio, live music, and event updates you control",
      "Private dining and catering inquiries",
      "Neighborhood named in pages, schema, and Google Business Profile",
    ],
    faqs: [
      {
        q: "How do we get found for searches like “dinner near Playhouse Square”?",
        a: "With a page built for it: what's walkable or a short drive, how long dinner takes, and where to park. Pair that with accurate hours in your Google Business Profile and you're a real answer to that search.",
      },
      {
        q: "Can we take orders directly instead of paying delivery app fees?",
        a: "Yes. We connect Toast, Square, or the ordering system you already use, so regulars can order straight from your site. Keep the apps for reach if you want, but give loyal customers a cheaper way to order.",
      },
      {
        q: "Do you work with Cleveland restaurants in person?",
        a: "Yes. We're about 30 minutes away in Lorain and can come by to talk through the site and photograph the space and food.",
      },
    ],
  },

  /* ------------------------------------------------------------------
     Salons, spas & beauty, Cuyahoga County
     ------------------------------------------------------------------ */
  {
    industrySlug: "salons-and-spas",
    areaSlug: "cuyahoga-county-oh",
    area: "Cuyahoga County",
    towns: CUYAHOGA_COUNTY_TOWNS,
    title: "Salon & Spa Websites in Cuyahoga County, OH",
    metaDescription:
      "Websites for Cleveland-area salons, spas, barbershops, and suite owners. Booking, service menus with prices, and portfolio pages that rank. From $1,500.",
    headline: "Salon and spa websites for Cleveland and Cuyahoga County",
    intro: [
      "In Cuyahoga County a client searching “hair salon near me” sees dozens of options within a few miles. The ones that get booked show their work, their prices, and an open appointment in the first few seconds. Everything else gets a back button.",
      "We build salon, spa, and barbershop websites that make that first impression count, with your portfolio up front, real prices, and booking connected to the app you already use.",
    ],
    localFactors: [
      {
        title: "Win the specialty search",
        description:
          "In a crowded market, specialists win. Pages for the services you're known for, like curly cuts, color correction, lash extensions, or fades, rank for the exact searches your best clients type.",
      },
      {
        title: "Neighborhood clientele",
        description:
          "Clients in Lakewood, Ohio City, or Shaker Heights rarely want to cross town for a trim. Naming your neighborhood, parking, and transit options on your site matches you with people who live and work nearby.",
      },
      {
        title: "Bilingual when it helps",
        description:
          "If your team serves Spanish-speaking clients, as many shops on Cleveland's west side do, a Spanish version of your key pages helps those clients find and book you.",
      },
    ],
    checklist: [
      "Online booking through your current app",
      "Service menu with starting prices",
      "Specialty service pages",
      "Portfolio gallery and team bios",
      "Neighborhood, parking, and transit details",
      "Optional Spanish-language pages",
    ],
    faqs: [
      {
        q: "There are so many salons in Cleveland. Will a website really help?",
        a: "It helps most in exactly that situation. When clients compare a dozen options, the shop with clear prices, real photos, and a booking button in two taps gets the appointment.",
      },
      {
        q: "Can you build the site in English and Spanish?",
        a: "Yes. We can add Spanish versions of your main pages, set up correctly so Google shows each version to the right searchers.",
      },
      {
        q: "Do you work with booth renters and suite owners?",
        a: "Yes. Focused sites for one or two stylists start at $1,500, and they move with you if you change locations.",
      },
    ],
  },

  /* ------------------------------------------------------------------
     Real estate agents & teams, Cuyahoga County
     ------------------------------------------------------------------ */
  {
    industrySlug: "real-estate",
    areaSlug: "cuyahoga-county-oh",
    area: "Cuyahoga County",
    towns: CUYAHOGA_COUNTY_TOWNS,
    title: "Real Estate Websites in Cuyahoga County, OH",
    metaDescription:
      "Websites for Cleveland-area real estate agents and teams. Neighborhood guides, point-of-sale explainers, IDX listings, and seller leads. From $1,500.",
    headline: "Real estate agent websites for Cleveland and Cuyahoga County",
    intro: [
      "Cuyahoga County is dozens of markets in one: lake suburbs like Bay Village and Rocky River, historic homes in Cleveland Heights and Shaker Heights, starter homes in Parma, city neighborhoods from Ohio City to Collinwood, and a steady stream of investors buying rentals. Buyers rarely understand all of it, and the agent who explains it gets the call.",
      "We build agent and team websites that show that expertise: neighborhood guides, listings from your MLS, and lead capture that brings buyers, sellers, and investors to you rather than to a national portal.",
    ],
    localFactors: [
      {
        title: "Explain point-of-sale inspections",
        description:
          "Several suburbs require a city inspection before a sale, and it catches out-of-town buyers and first-time sellers off guard. A clear guide on your site, by city, ranks for those questions and positions you as the agent who's been through it.",
      },
      {
        title: "Neighborhood guides that rank",
        description:
          "“Living in Lakewood” or “moving to Shaker Heights” searches come from serious buyers. Guides written from your experience, with commute, schools to look into, and housing types, earn rankings and trust.",
      },
      {
        title: "A path for investors",
        description:
          "If you work with investors, a separate page for rental and multi-family buyers keeps those leads apart from first-time buyers, with the information each one needs.",
      },
    ],
    checklist: [
      "IDX listings search from your MLS",
      "Neighborhood and suburb guides",
      "Point-of-sale inspection guide by city",
      "Home value request form for sellers",
      "Investor and multi-family page",
      "Fair housing and brokerage disclosures in place",
    ],
    faqs: [
      {
        q: "Is a point-of-sale guide on my website worth it?",
        a: "For agents in Cuyahoga County, yes. Buyers and sellers search for it, few agent sites explain it well, and it's a natural way to show local expertise and capture leads.",
      },
      {
        q: "Can I show MLS listings on my site?",
        a: "Yes. We connect an IDX provider approved by your MLS. Providers usually charge a monthly fee, which we'll walk through before you commit.",
      },
      {
        q: "Can the site keep working if I change brokerages?",
        a: "Yes. The site and domain are yours. We update the brokerage details and disclosures, and your content, reviews, and rankings stay put.",
      },
    ],
  },

  /* ------------------------------------------------------------------
     Contractors & home services, Franklin County
     ------------------------------------------------------------------ */
  {
    industrySlug: "contractors",
    areaSlug: "franklin-county-oh",
    area: "Franklin County",
    towns: FRANKLIN_COUNTY_TOWNS,
    title: "Contractor Websites in Franklin County, OH",
    metaDescription:
      "Websites for Columbus-area contractors and home service pros. Built to win new residents, new-build owners, and suburb-by-suburb searches. From $1,500.",
    headline: "Contractor websites for Columbus and Franklin County",
    intro: [
      "Columbus keeps growing, and every new resident needs a plumber, an electrician, a lawn service, and a handyman they don't have yet. They don't ask a neighbor first; they search “HVAC repair Hilliard” or “fence installer Westerville” and call whoever looks most trustworthy.",
      "Foundry Frame builds websites for contractors and home service businesses in Franklin County. We work remotely with Columbus clients, with clear milestones and previews you can click through, and every site is built around the jobs and suburbs you want more of.",
    ],
    localFactors: [
      {
        title: "Win the newcomers",
        description:
          "People who just moved to the area have no contractor loyalty. Reviews, clear pricing ranges, and an easy quote form give them a reason to pick you first and keep calling you.",
      },
      {
        title: "New builds and HOAs",
        description:
          "Newer neighborhoods around Dublin, Hilliard, Grove City, and New Albany bring fences, decks, finished basements, and landscaping, often with HOA rules. A page that says you handle HOA approvals removes a big worry for those homeowners.",
      },
      {
        title: "Suburb-by-suburb pages",
        description:
          "Franklin County is big, and people search by suburb. Pages for the areas you actually cover, each with its own content, help you rank where you want to work and nowhere you don't.",
      },
    ],
    checklist: [
      "Service pages for your most profitable jobs",
      "Pages for the Franklin County suburbs you cover",
      "HOA approval and new-build information",
      "Quote form with photos and address",
      "Click-to-call and text on mobile",
      "Google Business Profile and reviews lined up",
    ],
    faqs: [
      {
        q: "You're based in Lorain. Can you build a site for a Columbus contractor?",
        a: "Yes. Columbus projects run remotely over video calls and shared previews, with one point of contact the whole way. Most clients never need to meet in person, and we can arrange a kickoff visit for larger projects.",
      },
      {
        q: "How do I get found by people who just moved to Columbus?",
        a: "New residents search by service and suburb, so you need pages for both, plus a Google Business Profile with steady reviews. We build the pages and set up the profile so they work together.",
      },
      {
        q: "What does a contractor website cost?",
        a: "Custom sites start at $1,500 for a focused 5-page site. Additional service and suburb pages are quoted on a free call.",
      },
    ],
  },

  /* ------------------------------------------------------------------
     Restaurants & cafés, Franklin County
     ------------------------------------------------------------------ */
  {
    industrySlug: "restaurants",
    areaSlug: "franklin-county-oh",
    area: "Franklin County",
    towns: FRANKLIN_COUNTY_TOWNS,
    title: "Restaurant Websites in Franklin County, OH",
    metaDescription:
      "Restaurant websites for Columbus and Franklin County independents. Game-day ready, chain-proof branding, mobile menus, and direct ordering. From $1,500.",
    headline: "Restaurant websites for Columbus and Franklin County",
    intro: [
      "Columbus is where national chains come to test new concepts, which means independent restaurants compete with some of the best-funded marketing in the country. Your website is one of the few places you can match them, and beat them on personality.",
      "We build websites for independent restaurants, cafés, and bars across Franklin County, with menus that load instantly, a brand that feels like your dining room, and ordering that sends customers straight to you.",
    ],
    localFactors: [
      {
        title: "Ohio State Saturdays",
        description:
          "Fall Saturdays fill the city. Game-day hours, specials, and watch-party details, updated by you in a minute, put you in front of fans searching for somewhere to eat and watch.",
      },
      {
        title: "Out-brand the chains",
        description:
          "Chains have budgets; you have a story. Custom design, real photos, and copy about your kitchen and people make your site feel like somewhere worth going, not another menu page.",
      },
      {
        title: "Neighborhood by neighborhood",
        description:
          "The Short North, German Village, Clintonville, and Grandview all draw their own crowds. Naming your neighborhood on the site and in your Google Business Profile matches you to people searching there.",
      },
    ],
    checklist: [
      "Mobile menu pages Google can read",
      "Game-day hours and specials you can update",
      "Direct online ordering and reservations",
      "Events, gallery-hop nights, and live music",
      "Catering and private event inquiries",
      "Restaurant schema and matching Google hours",
    ],
    faqs: [
      {
        q: "How can an independent restaurant compete with chains online?",
        a: "By looking and sounding like itself. A custom site with your own photos, story, and menu ranks for local searches and gives people a reason to choose you over the chain down the road.",
      },
      {
        q: "Can we update game-day hours and specials ourselves?",
        a: "Yes. Hours, specials, and events are managed in a simple editor, so you can change them the morning of, without contacting us.",
      },
      {
        q: "Do you work with Columbus restaurants remotely?",
        a: "Yes. We work over video calls and shared previews, and we can arrange a photo session through a local photographer if you need new food photography.",
      },
    ],
  },

  /* ------------------------------------------------------------------
     Salons, spas & beauty, Franklin County
     ------------------------------------------------------------------ */
  {
    industrySlug: "salons-and-spas",
    areaSlug: "franklin-county-oh",
    area: "Franklin County",
    towns: FRANKLIN_COUNTY_TOWNS,
    title: "Salon & Spa Websites in Franklin County, OH",
    metaDescription:
      "Websites for Columbus-area salons, spas, and beauty pros. Booking, prices, and portfolios that win new-to-Columbus clients. From $1,500.",
    headline: "Salon and spa websites for Columbus and Franklin County",
    intro: [
      "Columbus has a steady stream of new residents: students, young professionals, and families moving in for work. Every one of them needs a new stylist, and they find one by searching, comparing portfolios, and booking whoever makes it easiest.",
      "We build salon, spa, and beauty websites that win those first appointments, with your work front and center, clear prices, and booking connected to the app you already use.",
    ],
    localFactors: [
      {
        title: "First-visit clients",
        description:
          "Someone new to town has no stylist and no referral. A new-client page with what to expect, consultation details, and an intro offer turns that search into a regular.",
      },
      {
        title: "Students and young professionals",
        description:
          "With Ohio State and a young workforce, many clients book on a phone between classes or meetings. A site built for one-handed booking, with evening and weekend availability up front, gets those appointments.",
      },
      {
        title: "Stand out in suite buildings",
        description:
          "Salon suites are everywhere from Polaris to Grove City. Your own site with your name and work makes you more than a door number in a shared building.",
      },
    ],
    checklist: [
      "Online booking through your current app",
      "New-client page and intro offer",
      "Service menu with starting prices",
      "Portfolio gallery that loads fast",
      "Evening and weekend availability up front",
      "Gift cards and reviews",
    ],
    faqs: [
      {
        q: "How do I attract clients who just moved to Columbus?",
        a: "Be easy to find and easy to trust: a portfolio, clear prices, reviews, and a booking button. A new-client page and offer give first-timers a reason to try you.",
      },
      {
        q: "Will the website work with my booking app?",
        a: "Yes. We connect Vagaro, Square, Boulevard, GlossGenius, or whatever you use now, so bookings land in the same calendar.",
      },
      {
        q: "Can you build my site if you're not in Columbus?",
        a: "Yes. We work remotely with Columbus clients, over video calls and previews you can click through on your phone.",
      },
    ],
  },

  /* ------------------------------------------------------------------
     Real estate agents & teams, Franklin County
     ------------------------------------------------------------------ */
  {
    industrySlug: "real-estate",
    areaSlug: "franklin-county-oh",
    area: "Franklin County",
    towns: FRANKLIN_COUNTY_TOWNS,
    title: "Real Estate Websites in Franklin County, OH",
    metaDescription:
      "Websites for Columbus-area real estate agents and teams. Relocation guides, suburb pages, IDX listings, and leads from out-of-town buyers. From $1,500.",
    headline: "Real estate agent websites for Columbus and Franklin County",
    intro: [
      "A lot of Columbus buyers are moving from somewhere else, often from out of state, and they start their search months before they visit. They read about Dublin, Westerville, Bexley, and Grove City online, and they reach out to the agent whose website answered their questions.",
      "We build agent and team websites for that buyer: relocation guides, suburb pages, listings from your MLS, and lead capture that works when your client is two time zones away.",
    ],
    localFactors: [
      {
        title: "Relocation guides",
        description:
          "“Moving to Columbus” is a huge search. A relocation guide written from your experience, covering suburbs, commutes, and what to expect from the market, brings in buyers before they've picked an agent.",
      },
      {
        title: "Suburb pages for a big county",
        description:
          "From Upper Arlington to Reynoldsburg, the suburbs differ a lot. A page per area you sell in helps buyers narrow it down, and helps you rank for each one.",
      },
      {
        title: "Built for remote buyers",
        description:
          "Video tour embeds, virtual consultation booking, and easy contact by text or email make it simple for an out-of-town buyer to start working with you before they arrive.",
      },
    ],
    checklist: [
      "IDX listings search from your MLS",
      "Moving-to-Columbus relocation guide",
      "Pages for the suburbs you sell in",
      "Virtual consultation booking",
      "Home value request form for sellers",
      "Fair housing and brokerage disclosures in place",
    ],
    faqs: [
      {
        q: "How do I reach buyers who are relocating to Columbus?",
        a: "Answer their questions before they ask. A relocation guide and suburb pages rank for the searches they make months before moving, and a virtual consultation link lets them start with you right away.",
      },
      {
        q: "Can my website show MLS listings?",
        a: "Yes. We connect an IDX provider approved by your MLS. Providers usually charge a monthly fee, which we'll explain up front.",
      },
      {
        q: "Do you work with Columbus agents remotely?",
        a: "Yes. Columbus projects run over video calls and shared previews. You'll work with one person from kickoff to launch.",
      },
    ],
  },
];

export function getIndustryArea(industrySlug: string, areaSlug: string) {
  return industryAreas.find(
    (page) => page.industrySlug === industrySlug && page.areaSlug === areaSlug
  );
}

/** Area pages for one industry, for linking from the industry page. */
export function areasForIndustry(industrySlug: string) {
  return industryAreas.filter((page) => page.industrySlug === industrySlug);
}

/** Industry pages in one area (matched by name, e.g. a location's county). */
export function industryPagesInArea(area: string) {
  return industryAreas.filter((page) => page.area === area);
}
