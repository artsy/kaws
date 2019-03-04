import { plainToClass } from "class-transformer"
import { Collection } from "../../../Entities/Collection"

export const mockCollectionRepository = plainToClass(Collection, [
  {
    id: 1,
    _id: 1,
    slug: "kaws-companions",
    title: "KAWS: Companions",
    category: "Collectible Sculptures",
    description: `<p>Brian Donnelly, better known as KAWS, spent the first year of his career as an animator for Disney.</p>`,
    headerImage: "",
    query: {
      id: null,
      tag_id: "companion",
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
    show_on_editorial: false,
    price_guidance: null,
    is_featured_artist_content: true,
  },
  {
    id: 2,
    _id: 2,
    title: "Big Artists, Small Sculptures",
    category: "Collectible Sculptures",
    description:
      "<p>Today&rsquo;s collectible sculptures&mdash;from KAWS&rsquo;s cartoon Companions to Yayoi Kusama&rsquo;s miniature pumpkins&mdash;have roots in the 1980s New York art scene.</p>",
    slug: "collectible-sculptures",
    headerImage:
      "http://files.artsy.net/images/pumpkinsbigartistsmallsculpture.png",
    query: {
      id: null,
      gene_id: null,
    },
    show_on_editorial: true,
    price_guidance: 1000,
    is_featured_artist_content: false,
  },
  {
    id: 3,
    _id: 3,
    title: "Jasper Johns: Flags",
    category: "Pop Art",
    description:
      '<p>In 1954, two years after being discharged from the United States Army, the 24-year-old <a href="https://www.artsy.net/artist/jasper-johns">Jasper Johns</a> had a vivid dream of the American flag.</p>',
    slug: "jasper-johns-flags",
    headerImage: "http://files.artsy.net/images/jasperjohnsflag.png",
    query: {
      id: null,
      tag_id: null,
    },
    show_on_editorial: false,
    price_guidance: 1000,
    is_featured_artist_content: true,
  },
])
