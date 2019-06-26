import * as path from "path"

import { convertCSVToJSON } from "../convertCSVToJSON"
import { sanitizeSlug } from "../sanitizeRow"

describe("convertCSVToJSON", () => {
  it("converts csv to json correctly", async () => {
    const csvFile = path.resolve(
      __dirname,
      "../../../fixtures/collections_test.csv"
    )

    const result = await convertCSVToJSON(csvFile)
    expect(result).toMatchObject([
      {
        title: "Alexander Calder: Lithographs",
        slug: "alexander-calder-lithographs",
        category: "Modern",
        description:
          '<p>Although <a href="https://www.artsy.net/artist/alexander-calder">Alexander Calder</a> might be best known for his <a href="https://www.artsy.net/collection/alexander-calder-mobiles">wire mobiles</a>, the artist was also an avid printmaker at the end of his career. Featuring primary colors, geometric lines and spirals, and flattened biomorphic shapes, the imagery in Calder’s lithographs is often reminiscent of his sculptural work. While many of Calder’s prints may initially appear abstract, a closer look will reveal symbols of people, plants, and animals. Calder even used his prints for political activism—in 1967 and 1969, Calder produced posters protesting the Vietnam War.</p>',
        headerImage:
          "http://files.artsy.net/images/alexandercalderlithographs.png",
        credit:
          "<p>&copy; Alexander Calder / Artist Rights Society (ARS), New York, NY.</p>",
        query: {
          artist_ids: ["4dde70a1306f6800010036ef"],
          gene_ids: ["lithograph-1"],
          tag_id: "",
          keyword: "",
        },
        price_guidance: 1000,
        show_on_editorial: true,
        linked_collections: [],
      },
      {
        title: "Andy Warhol: Bananas",
        slug: "andy-warhol-bananas",
        category: "Pop Art",
        description:
          '<p>In 1967, <a href="https://www.artsy.net/artist/andy-warhol">Andy Warhol</a> designed one of the most iconic album covers of all time, featuring a simple yellow banana on the sleeve of The Velvet Underground’s debut record. Warhol, undeterred by his lack of experience in the music industry, had become the band’s manager two years prior and even introduced the German vocalist Nico to the group. Early editions of the record cover featured removable stickers, allowing music fans to peel the banana’s yellow skin to reveal a pink fruit underneath. These early covers, now a rare collector’s item, also included the titillating suggestion, “Peel Slowly and See.” Though Warhol cut ties with The Velvet Underground in 1968, he continued experimenting with the banana motif in silkscreens and polaroids, favoring the fruit for its phallic shape and ubiquity in American daily life.</p>',
        headerImage: "http://files.artsy.net/images/andywarholbanana.png",
        credit:
          "<p>&copy; Andy Warhol / Artist Rights Society (ARS), New York, NY.</p>",
        query: {
          artist_ids: ["4d8b92b34eb68a1b2c0003f4"],
          gene_ids: [],
          tag_id: "",
          keyword: "Banana",
        },
        show_on_editorial: false,
        price_guidance: null,
        linked_collections: [],
      },
    ])
  })

  it("respects hub data", async () => {
    const csvFile = path.resolve(
      __dirname,
      "../../../fixtures/hub_collection_test_data.csv"
    )

    const result = await convertCSVToJSON(csvFile)
    const expected = [
      {
        title: "Agnes Martin: Lithographs",
        slug: "agnes-martin-lithographs",
        category: "Abstract Art",
        description: "",
        headerImage:
          "http://files.artsy.net/images/agnes_martin_lithographs.png",
        credit:
          "<p>&copy; Agnes Martin / Artist Rights Society (ARS), New York, NY.</p>",
        price_guidance: null,
        show_on_editorial: false,
        is_featured_artist_content: false,
        linked_collections: [
          {
            name: "Artist Series",
            members: ["artist-series-1", "artist-series-2", "artist-series-3"],
          },
          {
            name: "Featured Collections",
            members: ["featured-collection-1", "featured-collection-2"],
          },
          {
            name: "Other Collections",
            members: ["other-collection-1", "other-collection-2"],
          },
        ],
        query: {
          artist_ids: ["4ddbb20eb773bf00010031ea"],
          gene_ids: ["lithograph-1", "lithograph-2"],
          tag_id: "",
          keyword: "lithograph",
        },
      },
      {
        title: "Agnes Martin: Praise",
        slug: "agnes-martin-praise",
        category: "Abstract Art",
        description: "",
        headerImage: "http://files.artsy.net/images/agnes_martin_praise.png",
        credit:
          "<p>&copy; Agnes Martin / Artist Rights Society (ARS), New York, NY.</p>",
        price_guidance: null,
        show_on_editorial: false,
        is_featured_artist_content: false,
        linked_collections: [
          { name: "Artist Series", members: ["artist-series-3"] },
          {
            name: "Other Collections",
            members: ["other-collection-2", "other-collection-3"],
          },
        ],
        query: {
          artist_ids: ["4ddbb20eb773bf00010031ea"],
          gene_ids: [],
          tag_id: "",
          keyword: "praise",
        },
      },
      {
        title: "Alberto Giacometti: Busts",
        slug: "alberto-giacometti-busts",
        category: "Modern",
        description: "",
        headerImage:
          "http://files.artsy.net/images/alberto_giacometti_busts.png",
        credit:
          "<p>&copy; Alberto Giacometti / Artist Rights Society (ARS), New York, NY.</p>",
        price_guidance: null,
        show_on_editorial: false,
        is_featured_artist_content: false,
        linked_collections: [
          { name: "Featured Collections", members: ["featured-collection-2"] },
        ],
        query: {
          artist_ids: ["4e1716d0f1bf8f00010023d8"],
          gene_ids: [],
          tag_id: "",
          keyword: "bust",
        },
      },
    ]

    expect(result).toMatchObject(expected)
  })
})

describe("sanitizeSlug", () => {
  it("Removes spaces from slugs", () => {
    const cleanedSlug = sanitizeSlug(" alexander- calder-lithographs ")
    expect(cleanedSlug).toBe("alexander-calder-lithographs")
  })

  it("Converts symbols to text", () => {
    const cleanedSlug = sanitizeSlug(
      ".,&:/#!$%^*;{}=_`’~()alexander-calder-lithographs/"
    )
    expect(cleanedSlug).toBe("anddollarpercentalexander-calder-lithographs")
  })

  it("Removes special characters", () => {
    const cleanedSlug = sanitizeSlug("salvador-dalí-casanova")
    expect(cleanedSlug).toBe("salvador-dali-casanova")
  })

  it("Sets casing to lowercase", () => {
    const cleanedSlug = sanitizeSlug("Alexander-Calder-Lithographs/")
    expect(cleanedSlug).toBe("alexander-calder-lithographs")
  })
})
