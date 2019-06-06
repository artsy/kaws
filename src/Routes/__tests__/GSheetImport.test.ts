import { updateDatabase } from "../../utils/updateDatabase"
import { upload } from "../GSheetImport"

jest.mock("../../utils/gSheetDataFetcher", () => ({
  gSheetDataFetcher: () => {
    return rows
  },
}))

jest.mock("../../utils/updateDatabase")

describe("GSheetImport", () => {
  let req: any
  let res: any
  let next: any

  describe("#upload", () => {
    beforeEach(() => {
      req = {
        path: "/",
        query: {},
        body: {},
      }
      res = {
        status: jest.fn(() => res),
        send: jest.fn(),
      }
      next = jest.fn()
    })

    it("Returns an error if spreadSheetID and sheetName is not set", async () => {
      await upload(req, res, next)
      expect(res.status).toBeCalledWith(500)
      expect(res.send).toBeCalledWith(
        "A valid spreadSheetID and sheetName is required"
      )
    })

    it("Calls updateDatabase with downloaded rows data", async () => {
      req.body = {
        spreadSheetID: "123",
        sheetName: "'All'",
      }

      await upload(req, res, next)
      expect(updateDatabase).toBeCalledWith([
        {
          title: "Andy Warhol: Superman",
          slug: "andy-warhol-superman",
          category: "Pop Art",
          description:
            '<p>At eight years old, <a href="https://www.artsy.net/artist/andy-warhol">Andy Warhol</a> found a new idol: Superman. Diagnosed with an autoimmune disease, the young artist was bedridden for months after episodes of involuntary shaking led to bullying at school. At home, Warhol escaped into the world of comic books, especially the tale of Clark Kent. As an insecure young boy, Warhol found hope in Kent’s transformation from underdog to superhero. Decades later, he created his own rendition of Superman, portraying the character flying through the sky as part of his “<a href="https://www.artsy.net/collection/andy-warhol-myths">Myths</a>” portfolio. Warhol’s silkscreen <i>Superman</i> (1981) reached a new auction record in 2017, selling for over $200,000 at Phillips. But this isn’t the only Warhol motif inspired by his childhood illness—while bedridden, Warhol’s mother also fed him lots of <a href="https://www.artsy.net/collection/andy-warhol-campbells-soup-can">Campbell’s Soup</a>.</p>',
          headerImage: "http://files.artsy.net/images/andywarholsuperman.png",
          credit:
            "<p>&copy; Andy Warhol / Artist Rights Society (ARS), New York, NY.</p>",
          price_guidance: null,
          show_on_editorial: false,
          is_featured_artist_content: false,
          query: {
            artist_ids: ["4d8b92b34eb68a1b2c0003f4"],
            gene_ids: [],
            tag_id: "",
            keyword: "Superman",
          },
        },
        {
          title: "Anish Kapoor: Etchings",
          slug: "anish-kapoor-etchings",
          category: "Contemporary",
          description:
            '<p>In the late 1980s, <a href="https://www.artsy.net/artist/anish-kapoor">Anish Kapoor</a> began experimenting with printmaking, turning to the etching technique to portray abstract voids on handmade paper. In a process that can last several months and dozens of trips to the studio, Kapoor uses several techniques to create a finished etching, layering his freely etched prints with additional color deposits from aquatint plates, spit bite plates, or acid washing. The end product calls to mind TV static, primordial cells, or cosmic dust—familiar yet intangible, seeming to morph into new forms before one’s eyes. “The void is not silent,” he <a href="http://anishkapoor.com/185/making-emptiness-by-homi-k-bhabha">says</a>. “I have always thought of it more and more as a transitional space, an in-between space.” Ranging from dark abstractions to bright bursts of color, Kapoor’s most celebrated series of etchings include <i>15 Etchings</i> (1996), <i>Blackness from her Womb</i> (2000), <i>12 Etchings</i> (2004), <i>Shadow</i> (2007–12), and <i>Fold</i> (2014–16).</p>',
          headerImage: "http://files.artsy.net/images/anishkapooretchings.png",
          credit:
            "<p>&copy; Anish Kapoor / Artist Rights Society (ARS), New York, NY.</p>",
          price_guidance: null,
          show_on_editorial: false,
          is_featured_artist_content: false,
          query: {
            artist_ids: ["4de528068236f6000100070b"],
            gene_ids: ["etching-slash-engraving"],
          },
        },
        {
          title: "Ansel Adams: Yosemite",
          slug: "ansel-adams-yosemite",
          category: "Photography",
          description: "",
          headerImage: "http://files.artsy.net/images/anseladamsyosemite.png",
          credit:
            "<p>Ansel Adams, <i>El Capitan, Sunrise, Yosemite National Park</i>, 1956. Courtesy of Robert Klein Gallery.</p>",
          price_guidance: null,
          show_on_editorial: false,
          is_featured_artist_content: true,
          query: {
            artist_ids: ["4e677d4ff8597e00010072e0"],
            gene_ids: [],
            tag_id: "",
            keyword:
              "Yosemite, El Capitan, Half Dome, Sentinel Dome, fern spring, Half Dome, nevada falls, Tuolomne Meadows",
          },
        },
      ])

      expect(res.send).toBeCalledWith(200)
    })
  })
})

const rows = [
  [
    "title",
    "slug",
    "category",
    "description",
    "headerImage",
    "credit",
    "artist_ids",
    "gene_ids",
    "tag_id",
    "keyword",
    "price_guidance",
    "show_on_editorial",
    "is_featured_artist_content",
  ],
  [
    "Andy Warhol: Superman",
    "andy-warhol-superman",
    "Pop Art",
    '<p>At eight years old, <a href="https://www.artsy.net/artist/andy-warhol">Andy Warhol</a> found a new idol: Superman. Diagnosed with an autoimmune disease, the young artist was bedridden for months after episodes of involuntary shaking led to bullying at school. At home, Warhol escaped into the world of comic books, especially the tale of Clark Kent. As an insecure young boy, Warhol found hope in Kent’s transformation from underdog to superhero. Decades later, he created his own rendition of Superman, portraying the character flying through the sky as part of his “<a href="https://www.artsy.net/collection/andy-warhol-myths">Myths</a>” portfolio. Warhol’s silkscreen <i>Superman</i> (1981) reached a new auction record in 2017, selling for over $200,000 at Phillips. But this isn’t the only Warhol motif inspired by his childhood illness—while bedridden, Warhol’s mother also fed him lots of <a href="https://www.artsy.net/collection/andy-warhol-campbells-soup-can">Campbell’s Soup</a>.</p>',
    "http://files.artsy.net/images/andywarholsuperman.png",
    "<p>&copy; Andy Warhol / Artist Rights Society (ARS), New York, NY.</p>",
    "4d8b92b34eb68a1b2c0003f4",
    "",
    "",
    "Superman",
  ],
  [
    "Anish Kapoor: Etchings",
    "anish-kapoor-etchings",
    "Contemporary",
    '<p>In the late 1980s, <a href="https://www.artsy.net/artist/anish-kapoor">Anish Kapoor</a> began experimenting with printmaking, turning to the etching technique to portray abstract voids on handmade paper. In a process that can last several months and dozens of trips to the studio, Kapoor uses several techniques to create a finished etching, layering his freely etched prints with additional color deposits from aquatint plates, spit bite plates, or acid washing. The end product calls to mind TV static, primordial cells, or cosmic dust—familiar yet intangible, seeming to morph into new forms before one’s eyes. “The void is not silent,” he <a href="http://anishkapoor.com/185/making-emptiness-by-homi-k-bhabha">says</a>. “I have always thought of it more and more as a transitional space, an in-between space.” Ranging from dark abstractions to bright bursts of color, Kapoor’s most celebrated series of etchings include <i>15 Etchings</i> (1996), <i>Blackness from her Womb</i> (2000), <i>12 Etchings</i> (2004), <i>Shadow</i> (2007–12), and <i>Fold</i> (2014–16).</p>',
    "http://files.artsy.net/images/anishkapooretchings.png",
    "<p>&copy; Anish Kapoor / Artist Rights Society (ARS), New York, NY.</p>",
    "4de528068236f6000100070b",
    "etching-slash-engraving",
  ],
  [
    "Ansel Adams: Yosemite",
    "ansel-adams-yosemite",
    "Photography",
    "",
    "http://files.artsy.net/images/anseladamsyosemite.png",
    "<p>Ansel Adams, <i>El Capitan, Sunrise, Yosemite National Park</i>, 1956. Courtesy of Robert Klein Gallery.</p>",
    "4e677d4ff8597e00010072e0",
    "",
    "",
    "Yosemite, El Capitan, Half Dome, Sentinel Dome, fern spring, Half Dome, nevada falls, Tuolomne Meadows",
    "",
    "",
    "TRUE",
  ],
]
