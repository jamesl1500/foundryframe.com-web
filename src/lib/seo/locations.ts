/**
 * Local SEO landing pages - Foundry Frame
 * =========================================
 * Content for /locations/[slug]. Each city gets its own copy (intro, local
 * angle, FAQ) rather than a find-and-replace of the same page, so the pages
 * earn rankings for "web design <city>" searches instead of reading as
 * doorway pages.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

export const locationRegions = [
  "Lorain County",
  "Greater Cleveland",
  "Lake Erie Shore",
  "Akron & Central Ohio",
] as const;

export type LocationRegion = (typeof locationRegions)[number];

export type LocationPage = {
  slug: string;
  city: string;
  county: string;
  /** Groups the cards on the /locations hub. */
  region: LocationRegion;
  /** Short line used on the /locations hub card. */
  summary: string;
  metaDescription: string;
  intro: string[];
  localAngle: { title: string; description: string }[];
  nearby: string[];
  faqs: { q: string; a: string }[];
};

export const locations: LocationPage[] = [
  {
    slug: "lorain-oh",
    city: "Lorain",
    county: "Lorain County",
    region: "Lorain County",
    summary: "Our home base. Custom websites for Lorain shops, trades, and service businesses.",
    metaDescription:
      "Lorain, Ohio web design from a local, founder-led studio. Custom, mobile-first websites for Lorain small businesses, starting at $1,500. Free website audit.",
    intro: [
      "Foundry Frame is based in Lorain, so when a Lorain business hires us they get a designer who can meet in person, knows the neighborhoods, and answers the phone. No offshore hand-offs, no account managers in between.",
      "Most local businesses we talk to have one of three problems: no website at all, a template site that hasn't been touched in years, or a site that looks fine but never makes the phone ring. We build custom websites that fix the last one, because that's the one that costs you money.",
    ],
    localAngle: [
      {
        title: "Built for “near me” searches",
        description:
          "People in Lorain search on their phones for “plumber near me” or “restaurants on the lake.” We set up your pages, Google Business Profile links, and local schema so you show up in those results.",
      },
      {
        title: "Meet in person",
        description:
          "Kickoffs and design reviews can happen over coffee in Lorain instead of a video call, which makes it much easier to get the details right.",
      },
      {
        title: "Priced for small business",
        description:
          "Custom sites start at $1,500. You get a real, hand-coded website at a price that makes sense for a local business, not an enterprise budget.",
      },
    ],
    nearby: ["Sheffield Village", "Sheffield Lake", "Amherst", "Elyria", "Vermilion", "Avon Lake"],
    faqs: [
      {
        q: "Do you work with businesses in Lorain in person?",
        a: "Yes. We're based in Lorain (44053), so in-person kickoff meetings and design reviews are easy to arrange anywhere in town.",
      },
      {
        q: "How much does a website cost for a Lorain small business?",
        a: "Our custom websites start at $1,500 for a focused 5-page site. Larger sites with booking, e-commerce, or more pages are quoted after a free discovery call.",
      },
      {
        q: "Can you help my Lorain business show up on Google Maps?",
        a: "Yes. Every site we build includes local SEO basics: location schema, consistent name/address/phone details, and guidance on setting up or cleaning up your Google Business Profile.",
      },
    ],
  },
  {
    slug: "elyria-oh",
    city: "Elyria",
    county: "Lorain County",
    region: "Lorain County",
    summary: "Websites for Elyria service businesses, professional offices, and retailers.",
    metaDescription:
      "Elyria, Ohio web design for small businesses. Custom, fast, mobile-first websites built by a Lorain County studio. Starting at $1,500 with a free website audit.",
    intro: [
      "Elyria is the Lorain County seat, home to law offices, medical practices, contractors, and family-owned shops that compete with bigger Cleveland-area firms for the same customers. A modern website is how a local business wins that comparison.",
      "We're a 15-minute drive away in Lorain, so you get a local designer who can visit your office, photograph your space, and build a site around how your business actually works.",
    ],
    localAngle: [
      {
        title: "Look as credible as the big firms",
        description:
          "A fast, professional site puts your Elyria business on equal footing with Cleveland competitors when someone is comparing options on their phone.",
      },
      {
        title: "Clear paths to call or book",
        description:
          "Every page is designed around the action you want: a call, a booked appointment, or a quote request. We track those actions so you can see what the site brings in.",
      },
      {
        title: "Local SEO for Lorain County",
        description:
          "We structure your pages and business details so Google understands you serve Elyria and the surrounding county, not just your street address.",
      },
    ],
    nearby: ["North Ridgeville", "Grafton", "LaGrange", "Amherst", "Lorain", "Oberlin"],
    faqs: [
      {
        q: "Are you an Elyria web design company?",
        a: "We're based in neighboring Lorain and work with Elyria businesses regularly. In-person meetings in Elyria are easy to arrange.",
      },
      {
        q: "How long does it take to build a website for an Elyria business?",
        a: "Most projects launch in 6 to 12 weeks, depending on the number of pages and features. Smaller 5-page sites are on the faster end.",
      },
      {
        q: "Can you redesign my existing website instead of starting over?",
        a: "Yes. We start with a free audit of your current site, keep what's working (content, rankings, URLs), and rebuild the parts that are holding you back.",
      },
    ],
  },
  {
    slug: "avon-lake-oh",
    city: "Avon & Avon Lake",
    county: "Lorain County",
    region: "Lorain County",
    summary: "Polished websites for Avon and Avon Lake boutiques, studios, and professional services.",
    metaDescription:
      "Web design for Avon and Avon Lake, Ohio businesses. Custom, conversion-focused websites from a Lorain County studio. Starting at $1,500. Free website audit.",
    intro: [
      "Avon and Avon Lake customers expect a polished experience, and they usually judge a business by its website before they ever walk in. If your site feels dated next to the shops and studios around you, you're losing people you never hear from.",
      "We design custom websites that match the quality of what you actually deliver, with booking, galleries, and contact paths built for people browsing on their phones.",
    ],
    localAngle: [
      {
        title: "Design that matches your brand",
        description:
          "Custom layouts, typography, and photography direction so your site feels like your storefront, not a template shared with a thousand other businesses.",
      },
      {
        title: "Online booking and inquiries",
        description:
          "We connect the scheduling and inquiry tools you already use so customers can book or request a quote without calling during business hours.",
      },
      {
        title: "Fast on every phone",
        description:
          "Hand-coded sites load quickly on mobile, which keeps visitors from bouncing and helps your Google rankings.",
      },
    ],
    nearby: ["Westlake", "Bay Village", "Sheffield Village", "North Ridgeville", "Lorain", "Elyria"],
    faqs: [
      {
        q: "Do you work with businesses in Avon and Avon Lake?",
        a: "Yes. We're based in nearby Lorain and can meet in person for kickoffs and reviews.",
      },
      {
        q: "Can you add online booking to my website?",
        a: "Yes. We integrate booking tools like Square, Acuity, Vagaro, Mindbody, or Google Calendar appointment schedules so customers can book directly from your site.",
      },
      {
        q: "Will I be able to update my own website?",
        a: "Yes. Most projects include a content system for editing text, photos, and posts, plus a recorded walkthrough so you're never stuck waiting on us.",
      },
    ],
  },
  {
    slug: "amherst-oh",
    city: "Amherst",
    county: "Lorain County",
    region: "Lorain County",
    summary: "Straightforward, affordable websites for Amherst family businesses and trades.",
    metaDescription:
      "Amherst, Ohio web design for family businesses, trades, and shops. Custom mobile-first websites from a nearby Lorain studio, starting at $1,500.",
    intro: [
      "Amherst runs on family-owned businesses and word of mouth. A good website doesn't replace that; it's where those referrals go to check you out before they call. If they can't find you, or your site looks abandoned, the referral goes nowhere.",
      "We build clean, fast websites that make it obvious what you do, where you are, and how to reach you, with none of the upkeep headaches of a plugin-heavy template.",
    ],
    localAngle: [
      {
        title: "Make referrals convert",
        description:
          "Clear service pages, reviews, and a one-tap call button so people who heard about you from a neighbor can reach you in seconds.",
      },
      {
        title: "Low-maintenance by design",
        description:
          "No WordPress plugins to update or break. Your site stays fast and secure without a monthly babysitting bill.",
      },
      {
        title: "A local contact",
        description:
          "We're one town over in Lorain. When you need a change, you call the person who built your site.",
      },
    ],
    nearby: ["Oberlin", "South Amherst", "Lorain", "Elyria", "Vermilion", "Sheffield Village"],
    faqs: [
      {
        q: "What does a basic website for an Amherst business include?",
        a: "Our starting package is a custom 5-page site: home, services, about, reviews or gallery, and contact, with mobile design, local SEO basics, and a contact form.",
      },
      {
        q: "Do I need a website if most of my business is word of mouth?",
        a: "Yes. Most people look you up before they call, even when a friend recommended you. A clear website turns that search into a phone call.",
      },
      {
        q: "Do you offer ongoing website maintenance?",
        a: "Yes. Our maintenance plans cover updates, backups, and monitoring, and the higher tiers include monthly content changes.",
      },
    ],
  },
  {
    slug: "sandusky-oh",
    city: "Sandusky",
    county: "Erie County",
    region: "Lake Erie Shore",
    summary: "Websites for Sandusky restaurants, rentals, and tourism businesses built to win the season.",
    metaDescription:
      "Sandusky, Ohio web design for restaurants, vacation rentals, and tourism businesses. Custom, fast, mobile-first websites built to capture seasonal traffic.",
    intro: [
      "Sandusky businesses live and die by the summer season. Visitors heading to Cedar Point and the Lake Erie islands are searching on their phones for places to eat, stay, and book, often the same day. A slow or confusing website hands those customers to the business next door.",
      "We build fast, mobile-first websites for restaurants, rentals, charters, and shops that make it easy to see the menu, check availability, and book in a couple of taps.",
    ],
    localAngle: [
      {
        title: "Built for visitors on phones",
        description:
          "Menus, hours, directions, and booking front and center, loading quickly on spotty vacation-town cell service.",
      },
      {
        title: "Ready before the season",
        description:
          "We plan launches around your calendar so the new site is live and indexed before peak traffic starts.",
      },
      {
        title: "Direct bookings",
        description:
          "Booking and reservation integrations that help you take more reservations directly instead of paying third-party commissions on every one.",
      },
    ],
    nearby: ["Huron", "Vermilion", "Port Clinton", "Milan", "Norwalk", "Kelleys Island"],
    faqs: [
      {
        q: "Do you build websites for Sandusky restaurants and rentals?",
        a: "Yes. We build sites with menus, galleries, and reservation or booking integrations that work well for restaurants, vacation rentals, and tour operators.",
      },
      {
        q: "When should I start a website project to be ready for summer?",
        a: "Ideally in the winter. Most projects take 6 to 12 weeks, and a few extra weeks after launch helps Google index the new site before visitors start searching.",
      },
      {
        q: "Are you based in Sandusky?",
        a: "We're based in Lorain, about 40 minutes east, and work with Erie County businesses in person or remotely.",
      },
    ],
  },
  {
    slug: "cleveland-oh",
    city: "Cleveland",
    county: "Cuyahoga County",
    region: "Greater Cleveland",
    summary: "Custom websites for Cleveland small businesses and growth brands, without big-agency overhead.",
    metaDescription:
      "Cleveland web design for small businesses and growing brands. Custom, hand-coded websites from a founder-led Northeast Ohio studio. Starting at $1,500.",
    intro: [
      "Cleveland has no shortage of web design agencies, and plenty of them bill like it. Foundry Frame is a founder-led studio 30 minutes west in Lorain: you work directly with the person designing and building your site, at small-business pricing.",
      "We build custom, hand-coded websites for Cleveland restaurants, contractors, studios, and emerging brands that need to compete online without paying for an agency's office lease.",
    ],
    localAngle: [
      {
        title: "Founder-led, not account-managed",
        description:
          "No layers between you and the work. The person you meet on the discovery call is the one designing and building your site.",
      },
      {
        title: "Stand out in a crowded market",
        description:
          "Custom design and messaging that separates you from the dozens of competitors a Cleveland customer sees in a single search.",
      },
      {
        title: "Measurable results",
        description:
          "Analytics and conversion tracking are set up at launch, so you can see how many calls, bookings, and inquiries the site produces.",
      },
    ],
    nearby: ["Lakewood", "Westlake", "Parma", "Strongsville", "Ohio City", "Tremont"],
    faqs: [
      {
        q: "Do you work with Cleveland businesses?",
        a: "Yes. We're based in Lorain, about 30 minutes from downtown Cleveland, and work with Cleveland-area clients in person and remotely.",
      },
      {
        q: "How are you different from larger Cleveland web design agencies?",
        a: "You work directly with the founder, every site is custom-coded instead of built on a theme, and pricing starts at $1,500 instead of big-agency retainers.",
      },
      {
        q: "Can you help with branding as well as the website?",
        a: "Yes. We offer brand identity work (logo, color, typography, guidelines) on its own or bundled with a website build.",
      },
    ],
  },
  {
    slug: "westlake-oh",
    city: "Westlake",
    county: "Cuyahoga County",
    region: "Greater Cleveland",
    summary: "Websites for Westlake medical offices, professional firms, and the shops around Crocker Park.",
    metaDescription:
      "Westlake, Ohio web design for medical offices, professional firms, and retailers. Custom websites from a studio 20 minutes away in Lorain. From $1,500.",
    intro: [
      "Westlake's business mix leans professional: medical and dental practices, financial advisors, insurance agencies, law firms, and the shops and restaurants around Crocker Park. Customers here compare a few options on their phone before they call, and they notice when a site looks dated next to the competitor down Detroit Road.",
      "Foundry Frame is 20 minutes west in Lorain. We build custom websites that look as established as your practice, explain your services clearly, and make booking a consultation the obvious next step.",
    ],
    localAngle: [
      {
        title: "Credibility for professional services",
        description:
          "Clean design, real photos, credentials, and reviews arranged so a prospective patient or client trusts you before the first appointment.",
      },
      {
        title: "Booking and intake built in",
        description:
          "Online scheduling, intake forms, and consultation requests connected to the tools you already use, so new clients don't have to call during office hours.",
      },
      {
        title: "Found across the West Shore",
        description:
          "Westlake customers also search Rocky River, Bay Village, and North Olmsted. We set up your pages and Google Business Profile so you show up across the West Shore, not just at your own address.",
      },
    ],
    nearby: ["Bay Village", "Rocky River", "North Olmsted", "Avon & Avon Lake", "Fairview Park", "Lakewood"],
    faqs: [
      {
        q: "Do you meet with Westlake businesses in person?",
        a: "Yes. We're based in Lorain, about 20 minutes away, so in-person kickoffs and design reviews in Westlake are easy to set up.",
      },
      {
        q: "Can my website handle patient or client intake forms?",
        a: "Yes. We can add inquiry and intake forms, or connect the scheduling and practice-management tools you already use. For anything covered by HIPAA, we link to your compliant patient portal instead of collecting health details on the website itself.",
      },
      {
        q: "How much does a website for a Westlake practice or firm cost?",
        a: "Custom sites start at $1,500 for a focused 5-page site. Practices that need more service pages, provider bios, or booking integrations are quoted after a free discovery call.",
      },
    ],
  },
  {
    slug: "lakewood-oh",
    city: "Lakewood",
    county: "Cuyahoga County",
    region: "Greater Cleveland",
    summary: "Websites for Lakewood's independent restaurants, bars, salons, and shops on Detroit and Madison.",
    metaDescription:
      "Lakewood, Ohio web design for independent restaurants, bars, salons, and shops. Fast, mobile-first websites with menus and booking you update yourself.",
    intro: [
      "Lakewood is one of the most walkable cities in Ohio, and its business districts along Detroit Avenue and Madison Avenue are packed with independent restaurants, bars, coffee shops, salons, and boutiques. Most of them live on Instagram, and plenty have a website that hasn't been touched since the last menu change.",
      "We build fast, simple websites for Lakewood independents: current menus and hours, easy reservations or bookings, events, and a site you can update yourself in a couple of minutes.",
    ],
    localAngle: [
      {
        title: "Menus and hours that stay current",
        description:
          "Edit your menu, specials, and hours from your phone, so Google and your website never disagree about whether you're open.",
      },
      {
        title: "More than an Instagram link",
        description:
          "A real website gives you a place to own your menu, booking, and gift cards, and it shows up in searches that social profiles miss.",
      },
      {
        title: "Stand out on a busy strip",
        description:
          "With dozens of competitors within a few blocks, a distinct look and a fast mobile site help you get picked when someone searches “brunch in Lakewood.”",
      },
    ],
    nearby: ["Rocky River", "Cleveland", "Fairview Park", "Westlake", "Ohio City", "Edgewater"],
    faqs: [
      {
        q: "I already have Instagram. Does my Lakewood business need a website?",
        a: "For most businesses, yes. Instagram is great for regulars, but Google, Maps, and review sites send people to a website. Without one, they land on a third-party page you don't control.",
      },
      {
        q: "Can I update my menu and hours myself?",
        a: "Yes. Sites come with a simple content editor and a recorded walkthrough, so changing a menu item or holiday hours takes a minute.",
      },
      {
        q: "Can you connect online ordering or reservations?",
        a: "Yes. We connect the tools you already use, like Toast, Square, OpenTable, or Resy, so customers can order or book straight from your site.",
      },
    ],
  },
  {
    slug: "north-ridgeville-oh",
    city: "North Ridgeville",
    county: "Lorain County",
    region: "Lorain County",
    summary: "Websites for North Ridgeville contractors, home services, and family businesses in a fast-growing city.",
    metaDescription:
      "North Ridgeville, Ohio web design for contractors, home services, and family businesses. Custom websites that turn local searches into quote requests.",
    intro: [
      "North Ridgeville has been one of the fastest-growing cities in Lorain County for years, with new subdivisions bringing in households that need everyone from roofers and landscapers to dentists and daycares. New residents don't have neighbors to ask yet, so they search.",
      "We build websites that win those searches: clear service pages, the areas you cover, reviews, and a quote request or call button on every screen. We're about 20 minutes away in Lorain, so we can meet on site and photograph your work.",
    ],
    localAngle: [
      {
        title: "Reach new residents first",
        description:
          "People who just moved in search for every service from scratch. A page for each service you offer helps you show up for those searches.",
      },
      {
        title: "Quote requests with the details",
        description:
          "Forms that ask for the address, project type, and photos up front, so you can price jobs without three rounds of phone tag.",
      },
      {
        title: "Show off finished work",
        description:
          "Project galleries and before-and-after photos from local jobs prove you do the work you say you do.",
      },
    ],
    nearby: ["Avon & Avon Lake", "Elyria", "Eaton Township", "Columbia Station", "Olmsted Falls", "Sheffield Village"],
    faqs: [
      {
        q: "Do you build websites for contractors in North Ridgeville?",
        a: "Yes. Contractors and home-service businesses are a big focus for us. Every site includes service pages, a project gallery, reviews, and a quote request form.",
      },
      {
        q: "Can my website show which towns I serve?",
        a: "Yes. We add service-area content and schema for the towns you work in, such as Avon, Elyria, and Columbia Station, so Google knows where to show you.",
      },
      {
        q: "How fast can a small business website launch?",
        a: "Most projects launch in 6 to 12 weeks. A focused 5-page site with your content ready lands on the faster end.",
      },
    ],
  },
  {
    slug: "sheffield-village-oh",
    city: "Sheffield Village",
    county: "Lorain County",
    region: "Lorain County",
    summary: "Websites for Sheffield Village trades, retailers, and home-based businesses right next door to Lorain.",
    metaDescription:
      "Sheffield Village, Ohio web design for trades, retailers, and home-based businesses. Custom websites from our studio next door in Lorain. From $1,500.",
    intro: [
      "Sheffield Village sits between Lorain, Elyria, and Avon, with retail along its main roads, light industry, and a lot of owner-operated trades and home-based businesses. It's a small community, so your customers are spread across the neighboring cities, not just inside the village line.",
      "We're next door in Lorain. We build websites that make it clear what you do and where you work, so you show up for customers searching in Avon, Elyria, North Ridgeville, and Lorain as well as Sheffield.",
    ],
    localAngle: [
      {
        title: "Show up beyond the village line",
        description:
          "Service-area content and local schema tell Google you serve the surrounding cities, so a small home base doesn't limit who finds you.",
      },
      {
        title: "A designer next door",
        description:
          "We're minutes away in Lorain, so meeting at your shop, job site, or kitchen table is easy.",
      },
      {
        title: "Built for one-person operations",
        description:
          "A site that answers the usual questions, collects quote requests, and doesn't need attention while you're out on jobs.",
      },
    ],
    nearby: ["Lorain", "Elyria", "Avon & Avon Lake", "Sheffield Lake", "North Ridgeville", "Amherst"],
    faqs: [
      {
        q: "Can a home-based business in Sheffield Village show up on Google Maps?",
        a: "Yes. Google lets service-area businesses hide their home address and list the cities they serve instead. We set your website up to match and walk you through the Google Business Profile settings.",
      },
      {
        q: "What's the smallest website you build?",
        a: "Our starting package is a custom 5-page site from $1,500. For a very small business that usually covers everything: home, services, about, work samples, and contact.",
      },
      {
        q: "How close are you to Sheffield Village?",
        a: "Very close. We're based in Lorain, which borders the village, so in-person meetings are easy.",
      },
    ],
  },
  {
    slug: "sheffield-lake-oh",
    city: "Sheffield Lake",
    county: "Lorain County",
    region: "Lorain County",
    summary: "Websites for Sheffield Lake's lakeshore restaurants, salons, trades, and neighborhood businesses.",
    metaDescription:
      "Sheffield Lake, Ohio web design for restaurants, salons, trades, and neighborhood businesses. Affordable custom websites from a studio 10 minutes away.",
    intro: [
      "Sheffield Lake is a small lakeshore city along Lake Road, between Lorain and Avon Lake. Its businesses mostly serve neighbors: restaurants and carryouts, salons, auto shops, contractors, and home services. Many get by on word of mouth and a Facebook page, until a new customer searches and finds the competitor in Avon Lake first.",
      "We build straightforward, affordable websites that put your hours, services, reviews, and phone number in front of those searchers. Our studio is about 10 minutes away in Lorain.",
    ],
    localAngle: [
      {
        title: "Win the search, not just the referral",
        description:
          "Clear service pages and local schema help you show up when someone searches from Avon Lake or Lorain, not only when a neighbor recommends you.",
      },
      {
        title: "Hours, menus, and services in one place",
        description:
          "Everything a customer checks before calling, kept current from an editor you can use on your phone.",
      },
      {
        title: "Pricing for a neighborhood business",
        description:
          "Custom sites start at $1,500, with optional maintenance plans if you'd rather we handle updates for you.",
      },
    ],
    nearby: ["Avon & Avon Lake", "Lorain", "Sheffield Village", "Elyria", "Bay Village", "North Ridgeville"],
    faqs: [
      {
        q: "Do I need a website if my Sheffield Lake business has a Facebook page?",
        a: "It helps a lot. Facebook pages rarely rank in Google for searches like “salon near me,” and a website gives you a place you control to show services, prices, and reviews.",
      },
      {
        q: "Can you set up my Google Business Profile too?",
        a: "Yes. Every site includes local SEO basics, and we'll help you claim or clean up your Google Business Profile so your hours and contact details match your website.",
      },
      {
        q: "Are you close to Sheffield Lake?",
        a: "Yes. We're based in Lorain, about 10 minutes west, so meeting in person is easy.",
      },
    ],
  },
  {
    slug: "oberlin-oh",
    city: "Oberlin",
    county: "Lorain County",
    region: "Lorain County",
    summary: "Websites for Oberlin's downtown shops, restaurants, nonprofits, and arts organizations.",
    metaDescription:
      "Oberlin, Ohio web design for downtown shops, restaurants, nonprofits, and arts groups. Accessible, easy-to-update websites from a nearby Lorain studio.",
    intro: [
      "Oberlin's downtown runs on independent shops, cafes, and restaurants, plus a long list of nonprofits, arts groups, and practices connected to the college and the town. The audience is wide: students and visiting families, longtime residents, and donors or members who live far away.",
      "We build websites that work for all of them: accessible, quick to load, easy to update, and clear about how to visit, buy, donate, or get involved. Oberlin is about 25 minutes from our Lorain studio.",
    ],
    localAngle: [
      {
        title: "Accessible by default",
        description:
          "We design and test against WCAG accessibility guidelines: readable contrast, keyboard navigation, and screen-reader-friendly structure, which matters for public-facing organizations.",
      },
      {
        title: "Donations, memberships, and tickets",
        description:
          "We connect the donation, membership, or ticketing tools you already use so supporters can act without a phone call.",
      },
      {
        title: "Ready for visiting weekends",
        description:
          "Clear hours, directions, and visit info for the move-in, commencement, and reunion weekends when out-of-town visitors fill downtown.",
      },
    ],
    nearby: ["Elyria", "Amherst", "Wellington", "Kipton", "New Russia Township", "Grafton"],
    faqs: [
      {
        q: "Do you build websites for nonprofits and arts organizations?",
        a: "Yes. We build sites for mission-driven organizations with donation, event, and volunteer sign-up integrations, plus an editor your staff or volunteers can learn from a short recorded walkthrough.",
      },
      {
        q: "Will my website be accessible?",
        a: "Yes. We follow WCAG guidelines for contrast, structure, alt text, and keyboard use, and our free audit includes an accessibility score for your current site.",
      },
      {
        q: "Do you meet with Oberlin clients in person?",
        a: "Yes. We're about 25 minutes away in Lorain and can meet downtown for kickoffs and reviews.",
      },
    ],
  },
  {
    slug: "vermilion-oh",
    city: "Vermilion",
    county: "Erie County",
    region: "Lake Erie Shore",
    summary: "Websites for Vermilion's harbor-town shops, restaurants, marinas, and seasonal businesses.",
    metaDescription:
      "Vermilion, Ohio web design for harbor-town shops, restaurants, marinas, and seasonal businesses. Mobile-first websites from a studio 15 minutes away.",
    intro: [
      "Vermilion's downtown, harbor, and lakefront bring in boaters and day-trippers every summer, and year-round residents keep the shops and restaurants going the rest of the year. A Vermilion business website has to work for both: the visitor searching from a boat slip and the local checking winter hours.",
      "We're 15 minutes east in Lorain. We build quick, mobile-first websites with seasonal hours, events, menus, and booking that you can update as the season changes.",
    ],
    localAngle: [
      {
        title: "Seasonal hours without confusion",
        description:
          "Easy-to-edit hours, closures, and announcement banners, so summer visitors and winter regulars both see what's true today.",
      },
      {
        title: "Events front and center",
        description:
          "Event pages and calendars for festival weekends and summer nights, so you get found when people plan a trip to town.",
      },
      {
        title: "Built for weak lakefront signal",
        description:
          "Lightweight pages that load on one bar of service, which matters when your customers are on the water or at the beach.",
      },
    ],
    nearby: ["Huron", "Amherst", "Lorain", "Florence Township", "Birmingham", "Sandusky"],
    faqs: [
      {
        q: "Do you work with Vermilion businesses in person?",
        a: "Yes. We're based in Lorain, about 15 minutes east of downtown Vermilion, so in-person meetings are easy.",
      },
      {
        q: "Can I change my hours and specials myself during the season?",
        a: "Yes. Every site includes a simple editor for hours, menus, events, and announcements, with a walkthrough video.",
      },
      {
        q: "Can visitors book a charter, slip, or rental from my website?",
        a: "Yes. We connect booking tools like FareHarbor or Square Appointments, or the reservation system you already use, so visitors can reserve from their phone.",
      },
    ],
  },
  {
    slug: "akron-oh",
    city: "Akron",
    county: "Summit County",
    region: "Akron & Central Ohio",
    summary: "Websites for Akron manufacturers, B2B suppliers, and neighborhood businesses across Summit County.",
    metaDescription:
      "Akron web design for manufacturers, B2B suppliers, and local businesses. Custom websites with capability pages and RFQ forms, from a Northeast Ohio studio.",
    intro: [
      "Akron still runs on making things. Alongside the big names are many small manufacturers, machine shops, polymer suppliers, and B2B service companies whose websites were built a decade ago and now undersell what they can do. Then there are the restaurants, shops, and studios in neighborhoods like Highland Square and the Merriman Valley competing for local attention.",
      "Foundry Frame is a little under an hour away in Lorain. We build custom websites that explain technical capabilities clearly for B2B buyers, or bring in local customers for neighborhood businesses, and the founder handles the work directly.",
    ],
    localAngle: [
      {
        title: "Capability pages buyers can use",
        description:
          "Clear pages for your processes, materials, certifications, and equipment, so engineers and purchasing managers can qualify you without a call.",
      },
      {
        title: "RFQs that arrive complete",
        description:
          "Request-for-quote forms that accept drawings and specs and go straight to your inbox.",
      },
      {
        title: "Neighborhood businesses, too",
        description:
          "For Akron restaurants, salons, and shops, we focus on menus, booking, and showing up in local searches across Summit County.",
      },
    ],
    nearby: ["Cuyahoga Falls", "Fairlawn", "Stow", "Hudson", "Barberton", "Green"],
    faqs: [
      {
        q: "Do you build websites for manufacturers and B2B companies?",
        a: "Yes. We build capability-focused sites with RFQ forms, file uploads, and industry pages, written so buyers can quickly tell whether you're a fit.",
      },
      {
        q: "Do you work with Akron businesses in person?",
        a: "Yes. We're based in Lorain, a little under an hour from Akron. We can meet in person for a kickoff or work remotely, whichever is easier for you.",
      },
      {
        q: "Can you redesign an old website without losing our Google rankings?",
        a: "Yes. We map your existing URLs, keep the pages that rank, and set up redirects for anything that moves, so the new site doesn't reset your search traffic.",
      },
    ],
  },
  {
    slug: "columbus-oh",
    city: "Columbus",
    county: "Franklin County",
    region: "Akron & Central Ohio",
    summary: "Remote-first web design for Columbus startups, consumer brands, and small businesses.",
    metaDescription:
      "Columbus, Ohio web design for startups, consumer brands, and small businesses. Custom, hand-coded websites from a founder-led Ohio studio, from $1,500.",
    intro: [
      "Columbus is Ohio's fastest-growing metro, with a busy startup scene, a dense restaurant and retail market from the Short North to German Village, and a steady stream of new consumer brands. That growth also means a crowded field: whatever you sell, a Columbus customer sees several competitors in one search.",
      "Foundry Frame is a founder-led Ohio studio based in Lorain, about two hours north. We work with Columbus clients remotely, with video calls and clickable previews, and you work directly with the person designing and building your site at small-business pricing.",
    ],
    localAngle: [
      {
        title: "Launch-ready for new brands",
        description:
          "Brand identity, a product or service site, and analytics set up together, so a new Columbus brand launches with a consistent look from day one.",
      },
      {
        title: "Remote without the runaround",
        description:
          "Clear milestones, shared previews you can click through, and one point of contact. No account managers relaying messages.",
      },
      {
        title: "Compete in a crowded market",
        description:
          "Custom design and messaging that set you apart from the template sites a Columbus customer sees in a single search.",
      },
    ],
    nearby: ["Dublin", "Westerville", "Upper Arlington", "Grandview Heights", "Gahanna", "Worthington"],
    faqs: [
      {
        q: "Do you work with Columbus businesses if you're based in Lorain?",
        a: "Yes. Columbus projects run remotely over video calls and shared previews, and an in-person kickoff can be arranged for larger projects.",
      },
      {
        q: "Can you build a website for a new brand or startup?",
        a: "Yes. We can pair brand identity (logo, colors, typography) with the first website so everything launches together. Custom sites start at $1,500.",
      },
      {
        q: "Do you build e-commerce websites?",
        a: "Yes. We build online stores on Shopify or WooCommerce and recommend a platform based on how many products you sell and how you want to manage orders.",
      },
    ],
  },
];

export function getLocation(slug: string) {
  return locations.find((location) => location.slug === slug);
}

/** Splits a combined entry like "Avon & Avon Lake" into its cities. */
export function citiesOf(location: LocationPage) {
  return location.city.split(" & ");
}

/** The location page for a town name, if we have one ("Avon" matches the Avon & Avon Lake page). */
export function findLocationByName(name: string) {
  return locations.find(
    (location) => location.city === name || citiesOf(location).includes(name)
  );
}

/**
 * Other location pages to link from a location page: the nearby towns that
 * have pages first, then the rest of the same region.
 */
export function relatedLocations(location: LocationPage, limit = 6) {
  const nearby = location.nearby
    .map(findLocationByName)
    .filter((match): match is LocationPage => Boolean(match) && match !== location);
  const sameRegion = locations.filter(
    (other) => other.region === location.region && other !== location
  );
  return [...new Set([...nearby, ...sameRegion])].slice(0, limit);
}
