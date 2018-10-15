import { plainToClass } from "class-transformer"
import { Collection } from "./Entities/Collection"

export const data = plainToClass(Collection, [
  {
    id: 1,
    slug: "minimalist-prints",
    title: "Minimalist Prints",
    description: `Obsessed with celebrity, consumer culture, and mechanical (re)production,
    Pop artist Andy Warhol created some of the most iconic images of the 20th century.
    As famous for his quips as for his art—he variously mused that “art is what you can get aw...`,
    headerImage: {
      large: "",
      medium: "",
      small: "",
    },
    keywords: ["minimalist", "prints", "20th century"],
    imageCaption: "",
    category: {
      name: ""
    },
    query: {
      medium: "prints",
      time_periods: ["2000"],
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
])
