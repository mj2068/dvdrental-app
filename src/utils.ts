export function snakeToCapitalizedWords(snakeStr: string) {
  return snakeStr
    .split("_") // Split the string by underscores
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(" "); // Join the words with a space
}
