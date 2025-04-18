# Настройка ESLint для проверки импортов

В этом проекте настроен ESLint для автоматической проверки и оптимизации импортов. Это помогает поддерживать код в чистоте и избегать распространенных проблем.

## Установленные плагины

- `eslint-plugin-import` - проверка импортов
- `@typescript-eslint/eslint-plugin` - правила для TypeScript
- `eslint-plugin-react` - правила для React
- `eslint-plugin-react-hooks` - правила для хуков React
- `eslint-plugin-jsx-a11y` - правила доступности

## Основные правила для импортов

- Импорты должны быть отсортированы по группам
- Между группами импортов должны быть пустые строки
- Импорты должны быть отсортированы в алфавитном порядке
- Запрещены циклические зависимости
- Запрещены дублирующиеся импорты
- Импорты должны быть в начале файла
- После импортов должна быть пустая строка
- Запрещены ненужные сегменты пути

## Команды

- `npm run lint` - проверка всего кода
- `npm run lint:fix` - проверка и автоматическое исправление проблем
- `npm run lint:imports` - проверка и исправление только импортов

## Интеграция с редактором

Для VS Code рекомендуется установить расширение ESLint и включить автоматическое исправление при сохранении:

\`\`\`json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
\`\`\`

## Примеры правильных импортов

\`\`\`tsx
// Встроенные модули и React
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Внешние библиотеки
import { createClient } from '@supabase/supabase-js';
import { Loader2, Plus } from 'lucide-react';

// Внутренние компоненты и утилиты
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createClient as createSupabaseClient } from '@/utils/supabase/client';

// Типы
import type { Product, Category } from '@/types';
