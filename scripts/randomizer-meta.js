// Hand-written metadata for the works harvested from the course galleries (see build-randomizer-seed.js).
// key = image file name, or the 11-character YouTube id for clips.
// year = the year the WORK was made (midpoint of a range; negative for BCE); region = country (or culture)
// where it was made; form = what the work IS; { skip: true } = harvested but not a work of art.
const P = "painting", S = "sculpture", A = "architecture", L = "literature", T = "theater", M = "music", D = "dance", PH = "photography", C = "cinema", V = "television and video art";
const w = (id, title, creator, year, yearLabel, region, form, extra) => Object.assign({ id, title, creator, year, yearLabel, region, form }, extra || {});

module.exports = {
  // Unit 1
  "david-alfaro-siqueiros-echo-of-a-scream-1937-a-giant-ba.jpg": w("echo-of-a-scream", "Echo of a Scream", "David Alfaro Siqueiros", 1937, "1937", "Mexico", P),
  "peter-blume-the-eternal-city-1937-a-surrealist-painting.jpg": w("the-eternal-city", "The Eternal City", "Peter Blume", 1936, "1934–1937", "United States", P),
  "leonardo-da-vinci-mona-lisa-c-1503-1519-a-half-length-p.jpg": w("mona-lisa", "Mona Lisa", "Leonardo da Vinci", 1511, "c. 1503–1519", "Italy", P),
  "pablo-picasso-guernica-1937-a-large-monochromatic-paint.webp": w("guernica", "Guernica", "Pablo Picasso", 1937, "1937", "Spain", P),
  "katsushika-hokusai-the-great-wave-off-kanagawa-c-1831-a.jpg": w("great-wave", "The Great Wave off Kanagawa", "Katsushika Hokusai", 1831, "c. 1831", "Japan", P),
  "dorothea-lange-migrant-mother-1936-a-woman-in-worn-clot.jpg": w("migrant-mother", "Migrant Mother", "Dorothea Lange", 1936, "1936", "United States", PH, { unit: "unit-11-photography" }),
  // Unit 2
  "marcel-duchamp-fountain-1917-a-porcelain-urinal-turned-.jpg": w("fountain", "Fountain", "Marcel Duchamp", 1917, "1917", "United States", S),
  "francisco-goya-the-third-of-may-1808-1814-a-man-in-whit.jpg": w("third-of-may", "The Third of May 1808", "Francisco Goya", 1814, "1814", "Spain", P),
  "paul-c-zanne-mont-sainte-victoire-1886-1887-an-oil-pain.jpg": w("mont-sainte-victoire", "Mont Sainte-Victoire", "Paul Cézanne", 1887, "1886–1887", "France", P),
  "pieter-bruegel-landscape-with-the-fall-of-icarus-c-1560.jpg": w("fall-of-icarus", "Landscape with the Fall of Icarus", "Pieter Bruegel the Elder", 1560, "c. 1560", "Belgium", P),
  "exekias-achilles-and-ajax-amphora-c-530-bc.jpg": w("exekias-amphora", "Amphora with Achilles and Ajax", "Exekias", -530, "c. 530 BCE", "Greece", S),
  "vincent-van-gogh-the-starry-night-1889.jpg": w("starry-night", "The Starry Night", "Vincent van Gogh", 1889, "1889", "France", P, { unit: "unit-4-painting" }),
  // Unit 3
  "leonardo-da-vinci-the-last-supper-1495-1498-a-mural-sho.jpg": w("last-supper", "The Last Supper", "Leonardo da Vinci", 1496, "1495–1498", "Italy", P),
  "artemisia-gentileschi-judith-slaying-holofernes-c-1620-.jpg": w("judith-slaying-holofernes", "Judith Slaying Holofernes", "Artemisia Gentileschi", 1620, "c. 1620", "Italy", P),
  "johannes-vermeer-the-milkmaid-c-1658.jpg": w("the-milkmaid", "The Milkmaid", "Johannes Vermeer", 1658, "c. 1658", "Netherlands", P),
  "gustav-klimt-the-kiss-1907-1908.jpg": w("the-kiss", "The Kiss", "Gustav Klimt", 1907, "1907–1908", "Austria", P),
  "edvard-munch-the-scream-1893.jpg": w("the-scream", "The Scream", "Edvard Munch", 1893, "1893", "Norway", P),
  // Unit 4
  "frida-kahlo-the-two-fridas-1939-two-versions-of-the-art.jpeg": w("the-two-fridas", "The Two Fridas", "Frida Kahlo", 1939, "1939", "Mexico", P),
  "mark-rothko-no-61-rust-and-blue-1953-two-large-rectangl.jpg": w("rothko-no-61", "No. 61 (Rust and Blue)", "Mark Rothko", 1953, "1953", "United States", P),
  "jacob-lawrence-the-migration-series-panel-1-1940-1941-s.jpg": w("migration-series-1", "The Migration Series, Panel 1", "Jacob Lawrence", 1941, "1940–1941", "United States", P),
  "michelangelo-creation-of-adam-sistine-chapel-1508-1512.jpg": w("creation-of-adam", "The Creation of Adam", "Michelangelo", 1510, "1508–1512", "Italy", P),
  "rembrandt-self-portrait-kenwood-c-1665.jpg": w("rembrandt-self-portrait", "Self-Portrait", "Rembrandt van Rijn", 1667, "c. 1665–1669", "Netherlands", P),
  "giotto-lamentation-scrovegni-chapel-c-1305.jpg": w("giotto-lamentation", "Lamentation", "Giotto di Bondone", 1305, "c. 1305", "Italy", P),
  // Unit 5
  "musee-rodin-1.jpg": w("the-thinker", "The Thinker", "Auguste Rodin", 1904, "1904 cast", "France", S),
  "louise-bourgeois-maman-1999-a-giant-spider-sculpture-ma.jpg": w("maman", "Maman", "Louise Bourgeois", 1999, "1999", "United States", S),
  "alexander-calder-lobster-trap-and-fish-tail-1939-a-hang.webp": w("lobster-trap-and-fish-tail", "Lobster Trap and Fish Tail", "Alexander Calder", 1939, "1939", "United States", S),
  "bernini-apollo-and-daphne-1622-1625.jpg": w("apollo-and-daphne", "Apollo and Daphne", "Gian Lorenzo Bernini", 1623, "1622–1625", "Italy", S),
  "venus-of-willendorf-c-25000-bce.jpg": w("venus-of-willendorf", "Venus of Willendorf", "Unknown artist", -25000, "c. 25,000 BCE or earlier", "Central Europe", S),
  // Unit 6
  "frank-lloyd-wright-fallingwater-1935-a-house-with-drama.jpg": w("fallingwater", "Fallingwater", "Frank Lloyd Wright", 1935, "1935", "United States", A),
  "le-corbusier-notre-dame-du-haut-1955-a-white-concrete-c.webp": w("ronchamp", "Notre-Dame-du-Haut (Ronchamp Chapel)", "Le Corbusier", 1955, "1955", "France", A),
  "zaha-hadid-heydar-aliyev-center-2012-a-large-white-buil.jpg": w("heydar-aliyev-center", "Heydar Aliyev Center", "Zaha Hadid", 2012, "2012", "Azerbaijan", A),
  "parthenon-athens-447-432-bce.jpg": w("parthenon", "The Parthenon", "Iktinos and Kallikrates", -440, "447–432 BCE", "Greece", A),
  "pantheon-rome-dome-interior-c-126-ce.jpg": w("pantheon", "The Pantheon", "Roman architects under Hadrian", 126, "c. 126 CE", "Italy", A),
  "taj-mahal-agra-1632-1653.jpg": w("taj-mahal", "The Taj Mahal", "Commissioned by Shah Jahan", 1643, "1632–c. 1653", "India", A),
  "empire-state-building-new-york-1931.jpg": w("empire-state-building", "Empire State Building", "Shreve, Lamb & Harmon", 1931, "1931", "United States", A),
  // Unit 7
  "shakespeare-first-folio-title-page-1623.jpg": w("first-folio", "First Folio, title page", "William Shakespeare (engraving by Martin Droeshout)", 1623, "1623", "England", L),
  "gustave-dore-dante-lost-in-the-dark-forest-1857.jpg": w("dore-dante", "Dante lost in the dark forest", "Gustave Doré", 1857, "1857", "France", L),
  "frankenstein-1818-title-page.jpg": w("frankenstein-1818", "Frankenstein, 1818 title page", "Mary Shelley", 1818, "1818", "England", L),
  "walt-whitman-leaves-of-grass-1855-frontispiece.jpg": w("leaves-of-grass", "Leaves of Grass, frontispiece portrait", "Walt Whitman (engraving by Samuel Hollyer)", 1855, "1855", "United States", L),
  "emily-dickinson-daguerreotype-c-1847.jpg": w("emily-dickinson", "Emily Dickinson, daguerreotype", "Unknown photographer", 1847, "c. 1847", "United States", L),
  "langston-hughes-by-carl-van-vechten-1936.jpg": w("langston-hughes", "Langston Hughes", "Carl Van Vechten", 1936, "1936", "United States", L),
  // Unit 8 (clips)
  "OzvI3WS61ps": w("hamlet-globe", "Hamlet's soliloquy, Shakespeare's Globe", "William Shakespeare", 1600, "c. 1600", "England", T),
  "q6CLdCl9TB0": w("hamlet-scott", "Hamlet's soliloquy, Andrew Scott", "William Shakespeare", 1600, "c. 1600", "England", T),
  "dxG9vCyKSw8": { skip: true },
  "DSCKfXpAGHc": w("hamilton", "Hamilton", "Lin-Manuel Miranda", 2015, "2015", "United States", T),
  "LEN8FZEKaNU": { skip: true },
  // Unit 9 (clips)
  "fOk8Tm815lE": w("beethoven-fifth", "Symphony No. 5", "Ludwig van Beethoven", 1808, "1808", "Austria", M),
  "1prweT95Mo0": w("bach-cello-suite", "Cello Suite No. 1, Prélude", "Johann Sebastian Bach", 1720, "c. 1720", "Germany", M),
  "CaCSuzR4DwM": w("what-a-wonderful-world", "What a Wonderful World", "Louis Armstrong", 1967, "1967", "United States", M),
  "Web007rzSOI": w("strange-fruit", "Strange Fruit", "Billie Holiday", 1939, "1939", "United States", M),
  "lk60ObnbIOk": w("raga-ravi-shankar", "Raga at Monterey Pop", "Ravi Shankar", 1967, "1967", "India", M),
  // Unit 10 (clips)
  "klF8Ob8bRSE": w("lamentation-graham", "Lamentation", "Martha Graham", 1930, "1930", "United States", D),
  "BG1lg9GV9WY": w("revelations", "Revelations", "Alvin Ailey", 1960, "1960", "United States", D),
  "3WLazG0bQPI": w("cafe-muller", "Café Müller", "Pina Bausch", 1978, "1978", "Germany", D),
  "GRLeTziFsHs": w("swan-lake", "Swan Lake", "Pyotr Ilyich Tchaikovsky", 1877, "1877", "Russia", D),
  "gAI6hhsDNxc": w("singin-in-the-rain", "Singin' in the Rain", "Gene Kelly", 1952, "1952", "United States", D),
  // Unit 11
  "ansel-adams-the-tetons-and-the-snake-river-1942.jpg": w("tetons-snake-river", "The Tetons and the Snake River", "Ansel Adams", 1942, "1942", "United States", PH),
  "gordon-parks-em-american-gothic-washington-d-c-em-1942.jpg": w("american-gothic-parks", "American Gothic, Washington, D.C.", "Gordon Parks", 1942, "1942", "United States", PH),
  "alfred-stieglitz-paula-sun-rays-berlin-1889.jpg": w("paula-stieglitz", "Paula (Sun Rays), Berlin", "Alfred Stieglitz", 1889, "1889", "Germany", PH),
  "eadweard-muybridge-the-horse-in-motion-1878.jpg": w("horse-in-motion", "The Horse in Motion", "Eadweard Muybridge", 1878, "1878", "United States", PH),
  "louis-daguerre-boulevard-du-temple-1838.jpg": w("boulevard-du-temple", "Boulevard du Temple", "Louis Daguerre", 1838, "1838", "France", PH),
  "lewis-hine-powerhouse-mechanic-c-1920.jpg": w("powerhouse-mechanic", "Powerhouse Mechanic", "Lewis Hine", 1920, "c. 1920", "United States", PH),
  // Unit 12 (clips)
  "BAbzRjErywY": w("odessa-steps", "Battleship Potemkin: The Odessa Steps", "Sergei Eisenstein", 1925, "1925", "Russia", C),
  "8nYkyWQ-20w": w("citizen-kane-opening", "Citizen Kane, opening sequence", "Orson Welles", 1941, "1941", "United States", C),
  "SEUXfv87Wpk": w("parasite", "Parasite", "Bong Joon-ho", 2019, "2019", "South Korea", C),
  "qcyZ70tO9-Q": w("trip-to-the-moon", "A Trip to the Moon", "Georges Méliès", 1902, "1902", "France", C),
  "6xjJc2nb-Dk": { skip: true },
  // Unit 13 (clips)
  "fHqhaH6m9pY": w("the-crossing", "The Crossing", "Bill Viola", 1996, "1996", "United States", V),
  "MVwR1n0IZAs": w("tv-buddha", "TV Buddha", "Nam June Paik", 1974, "1974", "United States", V),
  "XS1j7haXiSM": w("global-groove", "Global Groove", "Nam June Paik", 1973, "1973", "United States", V),
  "uDcQbk78CSw": w("the-wire", "The Wire", "David Simon", 2002, "2002–2008", "United States", V),
  "ip-TuIXMS70": w("i-love-lucy", "I Love Lucy: Vitameatavegamin", "I Love Lucy", 1952, "1952", "United States", V),
};
