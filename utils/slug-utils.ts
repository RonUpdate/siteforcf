/**
 * Преобразует строку в URL-дружественный слаг
 * @param text Исходный текст
 * @param maxLength Максимальная длина слага (по умолчанию 100)
 * @returns Сформированный слаг
 */
export function generateSlug(text: string, maxLength = 100): string {
  if (!text) return ""

  // Транслитерация кириллицы в латиницу
  const transliterated = transliterateRuToEn(text)

  // Преобразование в нижний регистр, замена пробелов на дефисы
  // и удаление всех символов, кроме букв, цифр и дефисов
  let slug = transliterated
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")

  // Обрезаем слаг до максимальной длины
  if (slug.length > maxLength) {
    slug = slug.substring(0, maxLength)

    // Убедимся, что слаг не заканчивается на дефис
    if (slug.endsWith("-")) {
      slug = slug.substring(0, slug.length - 1)
    }
  }

  return slug
}

/**
 * Проверяет уникальность слага в базе данных
 * @param slug Слаг для проверки
 * @param table Имя таблицы
 * @param excludeId ID записи, которую нужно исключить из проверки (при редактировании)
 * @returns Уникальный слаг (с добавлением числового суффикса при необходимости)
 */
export async function ensureUniqueSlug(
  slug: string,
  table: "blog_posts" | "categories" | "products",
  excludeId?: string,
): Promise<string> {
  const { createClient } = await import("@/utils/supabase/server")
  const supabase = createClient()

  let uniqueSlug = slug
  let counter = 1
  let isUnique = false

  while (!isUnique) {
    // Проверяем существование слага в базе данных
    const query = supabase.from(table).select("id").eq("slug", uniqueSlug)

    // Если указан ID для исключения, добавляем условие
    if (excludeId) {
      query.neq("id", excludeId)
    }

    const { data, error } = await query.limit(1)

    if (error) {
      console.error("Ошибка при проверке уникальности слага:", error)
      throw new Error("Не удалось проверить уникальность слага")
    }

    // Если слаг уникален, выходим из цикла
    if (data.length === 0) {
      isUnique = true
    } else {
      // Иначе добавляем числовой суффикс и проверяем снова
      uniqueSlug = `${slug}-${counter}`
      counter++
    }
  }

  return uniqueSlug
}

/**
 * Транслитерация кириллицы в латиницу
 * @param text Исходный текст на кириллице
 * @returns Транслитерированный текст
 */
function transliterateRuToEn(text: string): string {
  const ruToEnMap: Record<string, string> = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "e",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "h",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "sch",
    ъ: "",
    ы: "y",
    ь: "",
    э: "e",
    ю: "yu",
    я: "ya",
    А: "A",
    Б: "B",
    В: "V",
    Г: "G",
    Д: "D",
    Е: "E",
    Ё: "E",
    Ж: "Zh",
    З: "Z",
    И: "I",
    Й: "Y",
    К: "K",
    Л: "L",
    М: "M",
    Н: "N",
    О: "O",
    П: "P",
    Р: "R",
    С: "S",
    Т: "T",
    У: "U",
    Ф: "F",
    Х: "H",
    Ц: "Ts",
    Ч: "Ch",
    Ш: "Sh",
    Щ: "Sch",
    Ъ: "",
    Ы: "Y",
    Ь: "",
    Э: "E",
    Ю: "Yu",
    Я: "Ya",
  }

  return text
    .split("")
    .map((char) => ruToEnMap[char] || char)
    .join("")
}
