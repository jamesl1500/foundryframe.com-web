/**
 * Unsplash Photo Catalog - Foundry Frame
 * ========================================
 * Every Unsplash photo the marketing site uses, in one place. Photos are
 * served straight from Unsplash's image CDN (images.unsplash.com), which
 * resizes and converts them on request, so nothing is stored in the repo
 * and the Vercel image optimizer isn't involved. See components/media/Photo.
 *
 * All photos are under the Unsplash License (free for commercial use, no
 * permission needed). Credit isn't required, but the photographer is kept
 * here so it's easy to add attribution later.
 *
 * To swap a photo: find it on unsplash.com, open it, copy the
 * "photo-XXXXXXXXXX-xxxxxxxxxxxx" part of its image URL into `id`.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

export type UnsplashPhoto = {
  /** The "photo-..." identifier from the images.unsplash.com URL. */
  id: string;
  alt: string;
  credit: string;
};

const photo = (id: string, alt: string, credit: string): UnsplashPhoto => ({
  id,
  alt,
  credit,
});

export const photos = {
  /* --- Spark, fire, and molten metal: The Spark and the "foundry" theme --- */
  sparkler: photo("photo-1509910110001-4e756f86fbd3", "Close-up of a sparkler throwing off bright sparks", "Jez Timms"),
  embers: photo("photo-1557951959-e3e30ee937e5", "Orange embers rising into the night air", "Peter Yost"),
  welding: photo("photo-1705875021755-88ba2c835524", "A metalworker shaping steel with a torch in a workshop", "marc Colonna D'Istria"),
  moltenAbstract: photo("photo-1757509022941-3910376728c0", "Abstract glowing orange and black fluid forms", "George Pixel"),
  warmOrb: photo("photo-1604079628040-94301bb21b91", "Abstract warm orange orb on a blue gradient", "mymind"),
  gradientWave: photo("photo-1618005182384-a83a8bd57fbe", "Abstract blue, orange and yellow gradient waves", "Milad Fakurian"),

  /* --- Small business owners --- */
  barista: photo("photo-1507914372368-b2b085b925a1", "A smiling barista holding a portafilter in a coffee shop", "Brooke Cagle"),
  coffeeCounter: photo("photo-1556742049-0cfed4f6a45d", "A shop owner smiling at a customer across the counter", "Clay Banks"),
  shopOwners: photo("photo-1556740758-90de374c12ad", "Two small business owners working in their shop", "Blake Wisz"),
  openSign: photo("photo-1575663620136-5ebbfcc2c597", "An open sign hanging in a shop window", "Tim Mossholder"),
  hairStylist: photo("photo-1562322140-8baeececf3df", "A hair stylist at work in a salon", "Adam Winger"),
  barber: photo("photo-1503951914875-452162b0f3f1", "A client in a barber's chair getting a haircut", "Allef Vinicius"),
  barberChair: photo("photo-1585747860715-2ba37e788b70", "A leather barber chair against a brick wall", "Nathon Oski"),
  woodworker: photo("photo-1687422810663-c316494f725a", "A woodworker smiling while working on a piece of wood", "Ali Mkumbwa"),
  contractor: photo("photo-1589939705384-5185137a7f0f", "A contractor in a hard hat holding a power tool", "Jeriden Villegas"),
  blueprints: photo("photo-1762146828422-50a8bd416d3c", "Architectural blueprints spread out on a table", "Marina Zvada"),
  restaurantOwner: photo("photo-1551632436-cbf8dd35adfa", "A restaurant owner standing in her dining room", "Louis Hansel"),
  chef: photo("photo-1622021142947-da7dedc7c39a", "A chef chopping vegetables in a restaurant kitchen", "Pylyp Sukhenko"),
  fitness: photo("photo-1534438327276-14e5300c3a48", "A trainer standing in a gym surrounded by equipment", "Danielle Cerullo"),
  freelancer: photo("photo-1520333789090-1afc82db536a", "A freelancer checking her phone at her desk", "bruce mars"),
  consultant: photo("photo-1543269664-56d93c1b41a6", "A consultant reviewing a tablet with a client", "Brooke Cagle"),

  /* --- Studio, design, and code --- */
  imacDesk: photo("photo-1467232004584-a241de8bcf5d", "An iMac on a clean desk in a bright studio", "Lee Campbell"),
  designDesk: photo("photo-1499951360447-b19be8fe80f5", "A laptop and desktop computer side by side on a designer's desk", "Domenico Loia"),
  designSystem: photo("photo-1558655146-d09347e92766", "A monitor showing a design system next to plants on a desk", "Balázs Kétyi"),
  wireframes: photo("photo-1522542550221-31fd19575a2d", "Watercolor wireframe sketches of website layouts", "Hal Gatewood"),
  codeDesk: photo("photo-1498050108023-c5249f4df085", "A laptop showing code on a busy desk", "Christopher Gower"),
  lettering: photo("photo-1498075702571-ecb018f3752d", "A designer lettering on tracing paper with a mechanical pencil", "Kelly Sikkema"),
  swatches: photo("photo-1664638413302-d1ca29ac885b", "A designer holding an orange material sample over design swatches", "Mohammad Lotfian"),
  sunlitStudio: photo("photo-1565791380713-1756b9a05343", "A wooden worktable in a sunlit studio", "Hannah Busing"),
  pantone: photo("photo-1723220217548-169d91fd1ba3", "A Pantone color swatch on a white background", "Fiona Murray-deGraaff"),
  coffeeBrand: photo("photo-1633533452148-a9657d2c9a5f", "Branded coffee cups and coffee bags", "MK +2"),
  posters: photo("photo-1633533451638-32f1e337d254", "A row of advertising posters on the side of a building", "MK +2"),
  paperArt: photo("photo-1620912189875-3fdb2380621b", "A person holding a sheet of printed paper art", "Milad Fakurian"),
  teamLaptops: photo("photo-1519389950473-47ba0277781c", "A team working together around a table of laptops", "Marvin Meyer"),
  strategyDesk: photo("photo-1556761175-4b46a572b786", "A strategist at a desk with multiple monitors", "Austin Distel"),
  socialIcons: photo("photo-1611162617213-7d7a39e9b1d7", "Social media and app icons arranged around a central logo", "Alexander Shatov"),
  laptopPhone: photo("photo-1563986768494-4dee2763ff3f", "A person working on a laptop and a smartphone at once", "Austin Distel"),

  /* --- Ohio --- */
  clevelandSkyline: photo("photo-1547916721-7469af15e2a3", "The Cleveland skyline across Lake Erie", "DJ Johnson"),
  clevelandSign: photo("photo-1542762735-ddc16fb8daaa", "The Cleveland script sign by the lake", "DJ Johnson"),
} as const satisfies Record<string, UnsplashPhoto>;

export type PhotoKey = keyof typeof photos;

export { unsplashUrl } from "@/lib/media/unsplash-url";

/** Picks the photo for a service from its slug or name (CMS services included). */
export function photoForService(slug: string, name = ""): PhotoKey {
  const key = `${slug} ${name}`.toLowerCase();
  if (key.includes("brand")) return "swatches";
  if (key.includes("social")) return "socialIcons";
  if (key.includes("graphic")) return "paperArt";
  if (key.includes("advert") || key.includes("ads")) return "posters";
  if (key.includes("strateg")) return "strategyDesk";
  return "designDesk";
}

/** Hero photo for an industry landing page, by industry slug. */
export function photoForIndustry(slug: string): PhotoKey {
  const map: Record<string, PhotoKey> = {
    restaurants: "chef",
    contractors: "contractor",
    "salons-and-spas": "hairStylist",
    "real-estate": "blueprints",
    "fitness-studios": "fitness",
    "retail-and-ecommerce": "shopOwners",
  };
  return map[slug] ?? "openSign";
}
