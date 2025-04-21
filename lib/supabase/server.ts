// Экспортируем только безопасные версии клиентов
import { createServerClientSafe } from "./server-safe"
import { createServerClientLegacy } from "./server-legacy"

// Основной экспорт - безопасная версия
export const createServerClient = createServerClientSafe

// Реэкспортируем legacy версию для использования в pages/ директории
export { createServerClientLegacy }
