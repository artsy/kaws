import { plainToClass } from "class-transformer"
import { Collection } from "../../../Entities/Collection"

export const mockCollectionRepository = plainToClass(Collection, [
  {
    id: 1,
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
    price_guidance: 1000,
  },
  {
    id: 2,
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
  },
])
