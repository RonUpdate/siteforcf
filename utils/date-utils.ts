/**
 * Форматирует дату в локализованную строку
 * @param dateString Строка с датой
 * @returns Отформатированная дата
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}

/**
 * Форматирует дату и время в локализованную строку
 * @param dateString Строка с датой и временем
 * @returns Отформатированная дата и время
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString)

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}
