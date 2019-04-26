import slugify from "slugify"
import { Collection } from "../Entities"

export const sanitizeRow = ({
  title,
  slug,
  category,
  description,
  headerImage,
  credit,
  artist_ids,
  gene_ids,
  tag_id,
  keyword,
  price_guidance,
  show_on_editorial,
  is_featured_artist_content,
}) => {
  return {
    title,
    slug: sanitizeSlug(slug),
    category,
    description,
    headerImage,
    credit,
    price_guidance: price_guidance ? Number(price_guidance) : null,
    show_on_editorial: Boolean(show_on_editorial),
    is_featured_artist_content: Boolean(is_featured_artist_content),
    query: (artist_ids || gene_ids || tag_id || keyword) && {
      artist_ids: artist_ids ? artist_ids.split(",").map(a => a.trim()) : [],
      gene_ids: gene_ids ? gene_ids.split(",").map(a => a.trim()) : [],
      tag_id,
      keyword,
    },
  } as Collection
}

export const sanitizeSlug = (slug: string) => {
  const cleanedSlug = slugify(slug, {
    remove: /[.'",&:\/#!$%\^\*;{}=_`’~()]/g,
    lower: true,
  })

  return cleanedSlug
}
