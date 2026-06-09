import { Post, Author, Category } from "../../src/types";

export const authors: Author[] = [
  {
    id: "1",
    name: "Emily Kosgei",
    avatar: "https://images.unsplash.com/photo-1497316730643-415fac54a2af?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGhvdG9ncmFwaGVyfGVufDB8fDB8fHww",
    bio: "Nomadic photographer & storyteller. 40 countries and counting.",
  },
  {
    id: "2",
    name: "John Kamau",
    avatar: "https://images.unsplash.com/photo-1682686581264-c47e25e61d95?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fFRyYXZlbGxlcnxlbnwwfHwwfHx8MA%3D%3D",
    bio: "Food traveller. I eat my way across continents so you don't have to.",
  },
  {
    id: "3",
    name: "Evans Mulemba",
    avatar: "https://images.unsplash.com/photo-1682686579688-c2ba945eda0e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fFRyYXZlbGxlcnxlbnwwfHwwfHx8MA%3D%3D",
    bio: "Hiking obsessive, cold-water swimmer, terrible ukulele player.",
  },
];

export const posts: Post[] = [
  {
    id: "1",
    slug: "lost-in-marrakech",
    title: "Lost in Marrakech: A Love Letter to Chaos",
    excerpt:
      "The medina swallowed me whole on my first morning  --  and I didn't want to be found.",
    content: `The call to prayer pulled me from sleep at 5am, threading through the riad's thick walls like something ancient and insistent. Outside my window, the sky was the colour of a bruised peach.

Marrakech doesn't ease you in. The moment you step through the medina gate, the city grabs you by the collar. Motorbikes materialise from nowhere. Spice vendors call in three languages. A cat watches you from a crumbling ledge with complete indifference.

I had a map. I stopped using it after an hour. The real Marrakech lives in the wrong turns  --  the courtyard behind a blue door, the man who repairs shoes in a space no wider than a wardrobe, the square where old men play cards in the shade of a dying afternoon.

Jemaa el-Fna at dusk is one of those places that makes you feel the planet is wildly, generously alive. Smoke from the food stalls, the thwack of drum circles, lanterns beginning to glow. You eat standing up  --  merguez sausage, snail broth, fried fish  --  jostled by strangers who somehow don't feel strange at all.

Go without a plan. Get lost properly. That's the whole point.`,
    cover: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80",
    category: Category.Culture,
    author: authors[0],
    publishedAt: "2024-11-14",
    readTime: 5,
    featured: true,
    tags: ["Morocco", "Medina", "Solo travel", "Culture"],
  },
  {
    id: "2",
    slug: "patagonia-end-of-world",
    title: "Patagonia: Where the World Forgets to End",
    excerpt:
      "Wind, silence, and a glacier that makes you reconsider the concept of blue.",
    content: `The wind in Patagonia is a living thing. It shoves you sideways, steals your words mid-sentence, and occasionally, on the Torres del Paine circuit, makes you genuinely wonder if you'll make it to the next refugio.

Then you turn a corner and there it is  --  the granite towers, impossibly sharp against a sky that goes on forever  --  and none of it matters.

I'd read about Patagonia for years. Travel writing has a way of hollowing words out through overuse, so when someone says "dramatic landscape" you picture something manageable. Patagonia is not manageable. It is excessive. The peaks are too tall, the ice fields too vast, the rivers too green, the foxes  --  there are foxes, impossibly tame, who will sit next to you at lunch  --  too charming.

The Grey Glacier deserves its own paragraph. Nothing in my 38 years on earth had prepared me for that shade of blue. Not the Maldives, not the Greek islands. This was something older, something that had been compressed into existence over millennia, a colour that felt like it shouldn't be real.

Fly into Punta Arenas. Pack warmer than you think. Walk until your legs give out. Repeat.`,
    cover: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
    category: Category.Adventure,
    author: authors[2],
    publishedAt: "2024-10-03",
    readTime: 6,
    featured: true,
    tags: ["Patagonia", "Hiking", "Argentina", "Chile"],
  },
  {
    id: "3",
    slug: "tokyo-convenience-stores",
    title: "The Quiet Genius of Tokyo Convenience Stores",
    excerpt:
      "A lawson at 2am will tell you more about Japan than any guidebook.",
    content: `It is 2:17am in Shinjuku. I have just finished my third whisky highball at a standing bar the size of a broom cupboard. I am, by any reasonable measure, not hungry. I walk into a Lawson anyway.

This is what Tokyo does to you.

The convenience stores  --  Lawson, 7-Eleven, FamilyMart  --  are a civilisational achievement that Japan does not get nearly enough credit for. They are warm, precisely lit, and staffed by humans who somehow make buying onigiri at 2am feel like a dignified transaction.

The food. The food. Hot foods rotating under heat lamps: nikuman (steamed pork buns), fried chicken that is legitimately excellent, corn dogs, oddly compelling. Cold shelves: rows of onigiri in flavours ranging from the classic (salmon, tuna mayo) to the seasonal and the strange. Sandwiches with their crusts cut off. Egg salad so aggressively smooth it borders on philosophical.

There is a machine that will make you a hot latte for 100 yen. There are entire dessert sections  --  cheesecakes, parfaits, mochi in seasonal flavours  --  that put the dessert sections of European supermarkets to shame.

I ate at least one convenience store meal a day for two weeks. I regret nothing.`,
    cover: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80",
    category: Category.Food,
    author: authors[1],
    publishedAt: "2024-09-18",
    readTime: 4,
    featured: false,
    tags: ["Japan", "Tokyo", "Food", "City life"],
  },
  {
    id: "4",
    slug: "costa-rica-cloud-forest",
    title: "Inside Costa Rica's Cloud Forest",
    excerpt:
      "Monteverde sits in the clouds  --  and the clouds sit inside you long after you leave.",
    content: `The suspension bridges at Monteverde Biological Reserve sway gently as you walk, and on either side of you the cloud forest presses in  --  dense, dripping, extravagantly alive.

You hear the quetzal before you see it. Your guide goes still. She raises her binoculars and tilts her head with the patient attention of someone who has done this a thousand times and still finds it extraordinary. Then there it is: the resplendent quetzal, the Mayans' sacred bird, iridescent green against the mist.

This is what Monteverde does. It makes you pay attention.

The cloud forests of Costa Rica sit above 1,400 metres, permanently wrapped in cloud, which means they are permanently strange. Mosses cover everything  --  branches, railings, the undersides of leaves. Orchids grow from tree trunks. Spider monkeys watch you from above with something between curiosity and contempt.

The evenings are cold. The coffee is extraordinary. The roads to get there are brutal  --  four hours of unpaved mountain track that will rearrange your spine  --  and worth every kilometre.

Slow down when you get here. This is a forest that rewards stillness.`,
    cover: "https://images.unsplash.com/photo-1518182170546-07661fd94144?w=800&q=80",
    category: Category.Nature,
    author: authors[2],
    publishedAt: "2024-08-27",
    readTime: 5,
    featured: false,
    tags: ["Costa Rica", "Nature", "Wildlife", "Cloud forest"],
  },
  {
    id: "5",
    slug: "oaxaca-mezcal-mole",
    title: "Oaxaca: Mezcal, Mole & Everything In Between",
    excerpt:
      "Mexico's culinary capital will ruin you for food everywhere else. Gladly.",
    content: `There's a woman in the Mercado 20 de Noviembre who has been making tlayudas since before I was born. Her tortillas come off a comal blackened by decades of use. She spreads black beans, asiento, and quesillo with the efficiency of muscle memory. I eat standing up. It is, without qualification, one of the finest things I have ever put in my mouth.

Oaxaca is Mexico's culinary capital and it knows it, but wears the title lightly. The food here is ancient and specific  --  seven moles (negro, rojo, coloradito, amarillo, verde, chichilo, manchamanteles), memelas, tasajo, enfrijoladas, the ubiquitous and entirely justified tlayuda.

Then there is the mezcal. Oaxaca produces 80% of Mexico's mezcal, and the best of it  --  single-village, wild agave, small batch  --  is something else entirely. Smoky and complex and strange, it tastes like the land it came from. Find a palenque, watch the process, taste the difference.

The city itself is all coloured facades and bougainvillea, a UNESCO World Heritage centre that somehow hasn't been ironed into a theme park. The zocalo at night, the Templo de Santo Domingo at golden hour, the markets before the tourists arrive at 10am.

Go hungry. Stay longer than you planned.`,
    cover: "https://images.unsplash.com/photo-1512813195386-6cf811ad3542?w=800&q=80",
    category: Category.Food,
    author: authors[1],
    publishedAt: "2024-07-11",
    readTime: 5,
    featured: true,
    tags: ["Mexico", "Oaxaca", "Food", "Culture"],
  },
  {
    id: "6",
    slug: "accra-city-rising",
    title: "Accra Is Rising and It Wants You to Know",
    excerpt:
      "Ghana's capital is loud, creative, and completely alive. The world is catching up.",
    content: `Accra moves at its own frequency. The traffic is operatic. The colours  --  of kente, of building facades, of market stalls  --  are relentless in the best possible way. The music leaks from everywhere: highlife from a chop bar, Afrobeats from a passing tro-tro, gospel from a church that seems to be open at all hours.

Labadi Beach on a Sunday afternoon is a masterclass in collective joy. Families, couples, vendors selling everything from cold water to phone cases, teenagers playing football in the shallows. The Atlantic here is warm and green and does not care about your Instagram.

The food: jollof rice is the hill I will die on, and Ghana's version  --  cooked in a rich tomato base, smoky from the firewood  --  is the best argument in the ongoing West African debate. Kelewele (spiced fried plantain) from a street stall at night. Waakye on a Tuesday morning. Groundnut soup that makes you want to learn to cook.

But what strikes most about Accra is the energy of building. A creative class is making itself loudly known  --  galleries, design studios, restaurants that are doing something genuinely new. The Nubuke Foundation. The Night Market at Kempinski. Labadi Beach Hotel on a weekend.

Get here before the rest of the world catches on. Though the secret is already out.`,
    cover: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80",
    category: Category.City,
    author: authors[0],
    publishedAt: "2024-06-05",
    readTime: 6,
    featured: false,
    tags: ["Ghana", "Accra", "West Africa", "City"],
  },

];

//Typed helper functions
export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getPostsByCategory(category: Category): Post[] {
  return posts.filter((p) => p.category === category);
}

export function getFeaturedPosts(): Post[] {
  return posts.filter((p) => p.featured);
}

export function searchPosts(query: string): Post[] {
  const q = query.toLowerCase();
  return posts.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
  );
}

