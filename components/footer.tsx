import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Креатив Фабрика</h3>
            <p className="mb-4 text-gray-300">
              Магазин креативных товаров для творчества и рукоделия. Мы помогаем воплотить ваши идеи в реальность.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Навигация</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Главная
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300 hover:text-white">
                  Товары
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-300 hover:text-white">
                  Категории
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white">
                  Блог
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Категории</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/categories/paints" className="text-gray-300 hover:text-white">
                  Краски
                </Link>
              </li>
              <li>
                <Link href="/categories/brushes" className="text-gray-300 hover:text-white">
                  Кисти
                </Link>
              </li>
              <li>
                <Link href="/categories/canvas" className="text-gray-300 hover:text-white">
                  Холсты
                </Link>
              </li>
              <li>
                <Link href="/categories/paper" className="text-gray-300 hover:text-white">
                  Бумага
                </Link>
              </li>
              <li>
                <Link href="/categories/accessories" className="text-gray-300 hover:text-white">
                  Аксессуары
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Контакты</h3>
            <address className="not-italic">
              <p className="mb-2 text-gray-300">ул. Творческая, 123</p>
              <p className="mb-2 text-gray-300">Москва, 123456</p>
              <p className="mb-2">
                <a href="tel:+71234567890" className="text-gray-300 hover:text-white">
                  +7 (123) 456-78-90
                </a>
              </p>
              <p>
                <a href="mailto:info@creativefabric.ru" className="text-gray-300 hover:text-white">
                  info@creativefabric.ru
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-300">&copy; {new Date().getFullYear()} Креатив Фабрика. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}
