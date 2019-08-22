import slugify from "slugify"
import { Collection, CollectionGroup, GroupType } from "../Entities"

const validate = (input) => {
  const by_slug = input.reduce((acc, val) => ({ ...acc, [val.slug]: true }), {})
  const bad_slugs = new Set();

  const process_link = slug_string => slug_string
    .split(",")
    .forEach(slug => {
      if (slug && !by_slug[slug]) {
        bad_slugs.add(slug)
      }
    })

  input.forEach(({ artist_series, featured_collections, other_collections }) => {
    artist_series && process_link(artist_series)
    featured_collections && process_link(featured_collections)
    other_collections && process_link(other_collections)
  })

  return bad_slugs
}

export const validateAndSanitizeInput = rows => {
  const bad_slugs = validate(rows)
  if (bad_slugs.size > 0) {
    throw new Error("Unable to resolve one or more linked slugs: " + Array.from(bad_slugs).join(" | "))
  }
  return rows.map(sanitizeRow)
}

const sanitizeRow = ({
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
  thumbnail,
  artist_series_label,
  artist_series,
  featured_collections_label,
  featured_collections,
  other_collections_label,
  other_collections,
}) => {
  return {
    title,
    slug: sanitizeSlug(slug),
    category,
    description,
    headerImage,
    thumbnail,
    credit,
    price_guidance: price_guidance ? Number(price_guidance) : null,
    show_on_editorial: Boolean(show_on_editorial),
    is_featured_artist_content: Boolean(is_featured_artist_content),
    linkedCollections: buildLinkedCollections(
      {
        label: artist_series_label || "Artist Series",
        collection: artist_series,
      },
      {
        label: featured_collections_label || "Featured Collections",
        collection: featured_collections,
      },
      {
        label: other_collections_label || "Other Collections",
        collection: other_collections,
      }
    ),
    query: (artist_ids || gene_ids || tag_id || keyword) && {
      artist_ids: splitmap(artist_ids),
      gene_ids: splitmap(gene_ids),
      tag_id,
      keyword,
    },
  } as Collection
}

const splitmap = text => (text ? text.split(",").map(a => a.trim()) : [])

const buildLinkedCollections = (
  { label: artistLabel, collection: artist },
  { label: featuredLabel, collection: featured },
  { label: otherLabel, collection: other }
) => {
  const output: CollectionGroup[] = []
  if (artist && artist.length > 0) {
    output.push({
      name: artistLabel,
      members: splitmap(artist),
      groupType: GroupType.ArtistSeries,
    } as CollectionGroup)
  }
  if (featured && featured.length > 0) {
    output.push({
      name: featuredLabel,
      members: splitmap(featured),
      groupType: GroupType.FeaturedCollections,
    } as CollectionGroup)
  }
  if (other && other.length > 0) {
    output.push({
      name: otherLabel,
      members: splitmap(other),
      groupType: GroupType.OtherCollections,
    } as CollectionGroup)
  }
  return output
}

export const sanitizeSlug = (slug: string) => {
  const cleanedSlug = slugify(slug, {
    remove: /[.'",&:\/#!$%\^\*;{}=_`’~()]/g,
    lower: true,
  })

  return cleanedSlug
}
