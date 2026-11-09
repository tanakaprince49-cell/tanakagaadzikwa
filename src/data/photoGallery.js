/**
 * Press / photo library for Tanaka Gaadzikwa.
 *
 * Single source of truth for the 18 official photos. Imported by:
 *   - src/pages/PressKitPage.tsx      (the crawlable gallery at /press)
 *   - src/utils/seo.ts                (runtime JSON-LD)
 *   - scripts/prerender.mjs           (static HTML + image sitemaps)
 *
 * Every photo carries a keyword-rich filename, an honest descriptive alt text,
 * a human caption and a longer description. That triple is what Google Images
 * actually reads: filename, alt attribute, surrounding text and ImageObject
 * structured data. Nothing here is keyword stuffing - each string describes
 * what is literally in the frame.
 *
 * Deliberately NOT linked from the main navigation. The page is reachable by
 * crawlers through sitemap-images.xml, /press in sitemap.xml and the
 * `image` array on the Person entity.
 */

const TODAY = '2026-11-09';

/** Shared licence block so every ImageObject is unambiguous for image search. */
export const PHOTO_LICENSE = {
  name: 'Press use permitted with credit to Tanaka Gaadzikwa',
  url: 'https://www.tanakagaadzikwa.com/press',
};

export const PHOTO_CREDIT = 'Tanaka Gaadzikwa';

export const PHOTOS = [
  {
    id: 'wetindey-tech-a16z',
    file: 'tanaka-gaadzikwa-wetindey-tech-a16z-feature.jpg',
    width: 850,
    height: 1056,
    title: 'Tanaka Gaadzikwa on the Wetindey Tech a16z feature cover',
    alt: 'Tanaka Gaadzikwa, a 15-year-old Zimbabwean tech founder, on a Wetindey Tech editorial cover headlined "15-Year-Old Zimbabwean Founder Don Knock on a16z Door, Wetin Go Happen Next?"',
    caption:
      'Wetindey Tech editorial cover asking whether a 15-year-old Zimbabwean founder can knock on Andreessen Horowitz (a16z)\'s door, featuring Tanaka Gaadzikwa.',
    description:
      'A Wetindey Tech studio story cover profiling Tanaka Gaadzikwa, the young Zimbabwean founder and CEO of LINKUP, framed around the question of whether a teenager building from Harare can reach top-tier Silicon Valley investors such as Andreessen Horowitz (a16z).',
    keywords: [
      'Tanaka Gaadzikwa a16z',
      'Wetindey Tech Tanaka Gaadzikwa',
      '15 year old Zimbabwean founder',
      'Andreessen Horowitz African founder',
      'young tech founder Zimbabwe',
    ],
    category: 'Press coverage',
    orientation: 'portrait',
  },
  {
    id: 'building-the-future-poster',
    file: 'tanaka-gaadzikwa-building-the-future-poster.jpg',
    width: 793,
    height: 1122,
    title: 'Building the Future with Tanaka Gaadzikwa event poster',
    alt: 'Pink event poster reading "Building the Future with Tanaka Gaadzikwa", with a photo of Tanaka standing in a maize field and the words "In Conversation", "The Future Is Now?" and "Get Involved"',
    caption:
      'Poster for "Building the Future with Tanaka Gaadzikwa" - a live in-conversation session with the LINKUP founder about young people building technology in Zimbabwe.',
    description:
      'Promotional poster for a "Building the Future with Tanaka Gaadzikwa" conversation event. The design uses a portrait of Tanaka in a navy and yellow track jacket in a maize field, paired with the lines "In Conversation", "The Future Is Now?" and "Get Involved".',
    keywords: [
      'Building the Future Tanaka Gaadzikwa',
      'Tanaka Gaadzikwa event poster',
      'Zimbabwe tech event speaker',
      'young entrepreneur speaking Harare',
    ],
    category: 'Event & speaking',
    orientation: 'portrait',
  },
  {
    id: 'hoodie-looking-left',
    file: 'tanaka-gaadzikwa-hoodie-portrait-looking-left.jpg',
    width: 576,
    height: 1280,
    title: 'Tanaka Gaadzikwa in a black hoodie, looking to the side',
    alt: 'Tanaka Gaadzikwa wearing a black hooded sweatshirt with his hands clasped in front of him, looking slightly off camera and to the left',
    caption:
      'Tanaka Gaadzikwa in a black hoodie, hands clasped, photographed indoors in a calm three-quarter pose.',
    description:
      'A quiet, three-quarter-length studio portrait of Tanaka Gaadzikwa in a black hoodie against a plain pale background, hands clasped and eyes off to the left. Used as a clean editorial portrait where a neutral, low-distraction image is needed.',
    keywords: [
      'Tanaka Gaadzikwa portrait',
      'Tanaka Gaadzikwa black hoodie',
      'young founder portrait',
      'Zimbabwean entrepreneur photo',
    ],
    category: 'Portraits',
    orientation: 'portrait',
  },
  {
    id: 'hoodie-front-portrait',
    file: 'tanaka-gaadzikwa-hoodie-front-portrait.jpg',
    width: 576,
    height: 1280,
    title: 'Tanaka Gaadzikwa front-facing portrait in a black hoodie',
    alt: 'Front-facing portrait of Tanaka Gaadzikwa in a black hoodie, standing with hands clasped against a pale wall',
    caption:
      'The front-facing version of the black hoodie portrait: direct eye contact, symmetric composition, ideal for an author or press bio card.',
    description:
      'A straight-on, full-torso portrait of Tanaka Gaadzikwa in a black hoodie against a plain wall. The symmetrical framing and direct gaze make this the most usable image for author biography cards, press mentions and byline thumbnails.',
    keywords: [
      'Tanaka Gaadzikwa headshot',
      'Tanaka Gaadzikwa biography photo',
      'front portrait Zimbabwe founder',
      'author photo tech blog',
    ],
    category: 'Portraits',
    orientation: 'portrait',
  },
  {
    id: 'hoodie-closeup',
    file: 'tanaka-gaadzikwa-hoodie-closeup-portrait.jpg',
    width: 576,
    height: 1280,
    title: 'Close-up portrait of Tanaka Gaadzikwa in a black hoodie',
    alt: 'Close-up portrait of Tanaka Gaadzikwa in a black hoodie, smiling faintly at the camera',
    caption:
      'A tighter crop of the hoodie session - warm, approachable and easy to read at small sizes.',
    description:
      'Close crop on the face and shoulders of Tanaka Gaadzikwa in a black hoodie, with a faint, relaxed smile. Best suited to small placements: article author boxes, social cards and search result thumbnails.',
    keywords: [
      'Tanaka Gaadzikwa close-up photo',
      'Tanaka Gaadzikwa smiling portrait',
      'young CEO Zimbabwe portrait',
      'LINKUP founder photo',
    ],
    category: 'Portraits',
    orientation: 'portrait',
  },
  {
    id: 'beanie-closeup-maize-field',
    file: 'tanaka-gaadzikwa-beanie-closeup-maize-field.jpg',
    width: 960,
    height: 1280,
    title: 'Tanaka Gaadzikwa in a black beanie against a maize field',
    alt: 'Close-up of Tanaka Gaadzikwa wearing a black ribbed beanie, with green maize crops blurred behind him in Zimbabwe',
    caption:
      'Tanaka Gaadzikwa in a black beanie, photographed against a green maize field - the signature look of the 2026 photo series.',
    description:
      'A tight portrait of Tanaka Gaadzikwa in a black ribbed beanie with a maize field behind him. Photographed by TAKEPHOTOS. This frame established the look of the series: black beanie, deep green Zimbabwean crop field, soft golden light.',
    keywords: [
      'Tanaka Gaadzikwa beanie',
      'Tanaka Gaadzikwa maize field photo',
      'Zimbabwean founder outdoor portrait',
      'TakePhotos Zimbabwe',
    ],
    category: 'The beanie series',
    orientation: 'portrait',
  },
  {
    id: 'fisheye-maize-field',
    file: 'tanaka-gaadzikwa-fisheye-portrait-maize-field.jpg',
    width: 960,
    height: 1280,
    title: 'Fisheye portrait of Tanaka Gaadzikwa standing in a field',
    alt: 'Fisheye lens shot of Tanaka Gaadzikwa in a navy and yellow track jacket standing in a green field, framed inside a dark circular vignette',
    caption:
      'Fisheye frame: Tanaka Gaadzikwa in a navy track jacket in the middle of a green field, shot with a wide circular lens.',
    description:
      'A wide fisheye portrait that places Tanaka Gaadzikwa at the centre of a green field, wearing a navy and yellow school-style track jacket. The circular lens distortion makes the landscape wrap around him - the most stylised image in the press library. TAKEPHOTOS watermark present.',
    keywords: [
      'Tanaka Gaadzikwa fisheye',
      'Tanaka Gaadzikwa track jacket',
      'creative portrait Zimbabwe teen founder',
      'fisheye field portrait',
    ],
    category: 'The beanie series',
    orientation: 'portrait',
  },
  {
    id: 'fisheye-field-clean',
    file: 'tanaka-gaadzikwa-fisheye-portrait-field.jpg',
    width: 960,
    height: 1280,
    title: 'Fisheye portrait of Tanaka Gaadzikwa in a field (clean version)',
    alt: 'Clean fisheye portrait of Tanaka Gaadzikwa in a navy and yellow track jacket standing in a green field, without a photographer watermark',
    caption:
      'The clean fisheye frame - same composition as the TAKEPHOTOS version, with no watermark, so it can be used in press without cropping.',
    description:
      'An unwatermarked version of the fisheye field portrait of Tanaka Gaadzikwa. Supplied for editorial use so publications do not have to crop out a photographer mark.',
    keywords: [
      'Tanaka Gaadzikwa fisheye portrait clean',
      'press ready photo Zimbabwe founder',
      'Tanaka Gaadzikwa field portrait',
    ],
    category: 'The beanie series',
    orientation: 'portrait',
  },
  {
    id: 'linkedin-2000-followers',
    file: 'tanaka-gaadzikwa-linkedin-2000-followers.jpg',
    width: 851,
    height: 1280,
    title: 'Tanaka Gaadzikwa LinkedIn 2,000 followers milestone graphic',
    alt: 'Purple LinkedIn milestone graphic reading "2K Followers Thank You!" with a photo of Tanaka Gaadzikwa and text about building in public',
    caption:
      'The "2K Followers - Thank You" graphic Tanaka Gaadzikwa posted to LinkedIn after crossing two thousand followers.',
    description:
      'A celebratory purple LinkedIn graphic marking 2,000 followers, built around a portrait of Tanaka Gaadzikwa. The caption thanks the people who followed his build-in-public journey documenting LINKUP and startup life in Zimbabwe.',
    keywords: [
      'Tanaka Gaadzikwa LinkedIn',
      '2K followers thank you',
      'build in public Zimbabwe',
      'LINKUP founder LinkedIn milestone',
    ],
    category: 'Milestones',
    orientation: 'portrait',
  },
  {
    id: 'beanie-field-looking-right',
    file: 'tanaka-gaadzikwa-beanie-field-looking-right.jpg',
    width: 960,
    height: 1280,
    title: 'Tanaka Gaadzikwa in a beanie looking right, maize field behind',
    alt: 'Tanaka Gaadzikwa in a black beanie and navy track jacket glancing to his right, with a green maize field behind him',
    caption:
      'A candid glance to the side - Tanaka Gaadzikwa in the beanie and track jacket series, maize field behind.',
    description:
      'Tanaka Gaadzikwa photographed mid-turn, glancing away from the camera in a black beanie and navy track jacket, with tall green maize behind him. A more candid, unposed option from the same series.',
    keywords: [
      'Tanaka Gaadzikwa candid photo',
      'beanie portrait maize field',
      'young Zimbabwean entrepreneur',
      'candid founder portrait',
    ],
    category: 'The beanie series',
    orientation: 'portrait',
  },
  {
    id: 'beanie-field-slight-smile',
    file: 'tanaka-gaadzikwa-beanie-field-slight-smile.jpg',
    width: 960,
    height: 1280,
    title: 'Tanaka Gaadzikwa with a slight smile in a maize field',
    alt: 'Tanaka Gaadzikwa in a black beanie with a slight smile, green maize plants and sky behind him',
    caption: 'A slight, guarded smile - the softest frame of the beanie series.',
    description:
      'Tanaka Gaadzikwa in a black beanie with a small smile, photographed among green maize with open sky behind. A warmer alternative to the neutral frames without becoming a full grin.',
    keywords: [
      'Tanaka Gaadzikwa slight smile',
      'beanie portrait Zimbabwe',
      'friendly founder headshot',
    ],
    category: 'The beanie series',
    orientation: 'portrait',
  },
  {
    id: 'beanie-field-neutral',
    file: 'tanaka-gaadzikwa-beanie-field-neutral.jpg',
    width: 960,
    height: 1280,
    title: 'Neutral portrait of Tanaka Gaadzikwa in a beanie and maize field',
    alt: 'Neutral expression portrait of Tanaka Gaadzikwa in a black beanie, navy track jacket and green maize field background',
    caption:
      'Neutral and direct: the most serious frame of the series, closest to a formal headshot.',
    description:
      'A composed, neutral portrait of Tanaka Gaadzikwa in a black beanie and navy track jacket against a maize field. The straightest, most formal image in the outdoor set - suitable for news coverage that needs a serious register.',
    keywords: [
      'Tanaka Gaadzikwa neutral portrait',
      'formal headshot Zimbabwe founder',
      'news photo young entrepreneur',
    ],
    category: 'The beanie series',
    orientation: 'portrait',
  },
  {
    id: 'beanie-field-smiling',
    file: 'tanaka-gaadzikwa-beanie-field-smiling.jpg',
    width: 960,
    height: 1280,
    title: 'Tanaka Gaadzikwa smiling in a black beanie',
    alt: 'Tanaka Gaadzikwa in a black beanie smiling broadly, photographed in front of a green maize field',
    caption:
      'The fullest smile in the series - Tanaka Gaadzikwa laughing at camera in a black beanie.',
    description:
      'Tanaka Gaadzikwa smiling openly at the camera in a black beanie, maize field behind him. The most approachable image in the library and the safest choice for profiles, interviews and human-interest features.',
    keywords: [
      'Tanaka Gaadzikwa smiling',
      'happy young founder portrait',
      'Zimbabwe tech entrepreneur smile',
    ],
    category: 'The beanie series',
    orientation: 'portrait',
  },
  {
    id: 'beanie-track-jacket-cornfield',
    file: 'tanaka-gaadzikwa-beanie-track-jacket-cornfield.jpg',
    width: 960,
    height: 1280,
    title: 'Tanaka Gaadzikwa in a track jacket standing in a cornfield',
    alt: 'Tanaka Gaadzikwa in a black beanie and navy track jacket with blue and yellow trim, standing among tall green corn plants',
    caption:
      'Fuller-length frame: black beanie, navy track jacket with blue and yellow trim, standing inside a tall cornfield.',
    description:
      'Tanaka Gaadzikwa standing in a tall cornfield wearing a black beanie and a navy track jacket with blue and yellow trim. Shows more of the environment than the close-ups and gives publications a vertical option with a clear sense of place.',
    keywords: [
      'Tanaka Gaadzikwa cornfield',
      'track jacket portrait Zimbabwe',
      'rural Zimbabwe tech founder',
      'farm field portrait',
    ],
    category: 'The beanie series',
    orientation: 'portrait',
  },
  {
    id: 'beanie-closeup-cornfield',
    file: 'tanaka-gaadzikwa-beanie-closeup-cornfield.jpg',
    width: 960,
    height: 1280,
    title: 'Close-up of Tanaka Gaadzikwa in a beanie in a cornfield',
    alt: 'Close-up of Tanaka Gaadzikwa wearing a black beanie and navy track jacket, with corn leaves behind him',
    caption:
      'Tight crop in the cornfield - the version that still reads clearly at thumbnail size.',
    description:
      'A tight close-up of Tanaka Gaadzikwa in a black beanie and navy track jacket with corn leaves behind him. Because the framing is tight and the background simple, this survives aggressive cropping in Google Images, social cards and news thumbnails.',
    keywords: [
      'Tanaka Gaadzikwa close-up beanie',
      'thumbnail portrait founder',
      'cornfield portrait Zimbabwe',
    ],
    category: 'The beanie series',
    orientation: 'portrait',
  },
  {
    id: 'beanie-peace-sign-smile',
    file: 'tanaka-gaadzikwa-beanie-peace-sign-smile.jpg',
    width: 960,
    height: 1280,
    title: 'Tanaka Gaadzikwa showing a peace sign and smiling',
    alt: 'Tanaka Gaadzikwa in a black beanie and navy track jacket, smiling and holding up a peace sign in front of a maize field',
    caption:
      'Peace sign, wide grin: the most playful and shareable frame in the press library.',
    description:
      'Tanaka Gaadzikwa laughing with a peace sign held up to the camera, black beanie and navy track jacket, maize field behind him. The most energetic photo of the set - built for social sharing and interview headers.',
    keywords: [
      'Tanaka Gaadzikwa peace sign',
      'playful founder photo',
      'young entrepreneur smiling Zimbabwe',
    ],
    category: 'The beanie series',
    orientation: 'portrait',
  },
  {
    id: 'beanie-moody-portrait',
    file: 'tanaka-gaadzikwa-beanie-moody-portrait.jpg',
    width: 959,
    height: 1280,
    title: 'Moody low-light portrait of Tanaka Gaadzikwa',
    alt: 'Moody, low-lit portrait of Tanaka Gaadzikwa in a black beanie, deep green foliage in shadow behind him',
    caption:
      'Moody lighting and deep shadow - the cinematic frame of the series, shot by TAKEPHOTOS.',
    description:
      'A dark, low-key portrait of Tanaka Gaadzikwa in a black beanie with deep green foliage falling into shadow behind him. The most atmospheric image in the library and a natural fit for long-form features and magazine layouts. TAKEPHOTOS watermark present.',
    keywords: [
      'Tanaka Gaadzikwa moody portrait',
      'dramatic lighting founder photo',
      'editorial portrait Zimbabwe',
      'cinematic beanie portrait',
    ],
    category: 'The beanie series',
    orientation: 'portrait',
  },
  {
    id: 'beanie-closeup-bright',
    file: 'tanaka-gaadzikwa-beanie-closeup-bright.jpg',
    width: 960,
    height: 1280,
    title: 'Bright close-up portrait of Tanaka Gaadzikwa in a beanie',
    alt: 'Bright, sunlit close-up portrait of Tanaka Gaadzikwa in a black beanie with a blue and yellow track jacket collar',
    caption:
      'Sun on his face: the brightest, most high-contrast close-up in the library.',
    description:
      'A bright, sunlit close-up of Tanaka Gaadzikwa in a black beanie, the blue and yellow collar of his track jacket filling the bottom of the frame. Strong contrast and clear facial detail make this the best-performing frame for image search thumbnails.',
    keywords: [
      'Tanaka Gaadzikwa bright close-up',
      'sunlit portrait Zimbabwe founder',
      'high contrast headshot',
    ],
    category: 'The beanie series',
    orientation: 'portrait',
  },
].map((photo) => ({
  ...photo,
  src: `/images/tanaka/${photo.file}`,
  mimeType: 'image/jpeg',
  datePublished: TODAY,
  creditText: PHOTO_CREDIT,
  copyrightNotice: `© ${new Date(TODAY).getFullYear()} Tanaka Gaadzikwa`,
}));

export const PHOTO_COUNT = PHOTOS.length;

export default { PHOTOS, PHOTO_COUNT, PHOTO_LICENSE, PHOTO_CREDIT };
