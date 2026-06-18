import { Filter } from "bad-words"

const filter = new Filter()

filter.addWords(
  "fuck",
  "shit",
  "bitch",
  "pussy"
)

export const containsBadWords = (text) => {
  const normalized = text.toLowerCase()
  return filter.list.some((word) =>
    normalized.includes(word)
  )
}