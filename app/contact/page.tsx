export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold">Контакты</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <div className="prose prose-lg max-w-none">
            <p>
              Мы всегда рады общению с нашими клиентами! Если у вас есть вопросы, предложения или вы просто хотите
              поделиться своими впечатлениями, не стесняйтесь связаться с нами любым удобным способом.
            </p>

            <h2>Наш адрес</h2>
            <address className="not-italic">
              <p>ул. Творческая, 123</p>
              <p>Москва, 123456</p>
              <p>Россия</p>
            </address>

            <h2>Контактная информация</h2>
            <p>
              <strong>Телефон:</strong> <a href="tel:+71234567890">+7 (123) 456-78-90</a>
              <br />
              <strong>Email:</strong> <a href="mailto:info@creativefabric.ru">info@creativefabric.ru</a>
            </p>

            <h2>Часы работы</h2>
            <p>
              <strong>Понедельник - Пятница:</strong> 9:00 - 20:00
              <br />
              <strong>Суббота:</strong> 10:00 - 18:00
              <br />
              <strong>Воскресенье:</strong> 10:00 - 16:00
            </p>

            <h2>Социальные сети</h2>
            <p>Следите за нами в социальных сетях, чтобы быть в курсе последних новостей, акций и творческих идей:</p>
            <ul>
              <li>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div>
          <form className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Напишите нам</h2>

            <div className="mb-4">
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                Ваше имя
              </label>
              <input
                type="text"
                id="name"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500"
                placeholder="Иван Иванов"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500"
                placeholder="example@mail.ru"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="subject" className="mb-2 block text-sm font-medium text-gray-700">
                Тема
              </label>
              <input
                type="text"
                id="subject"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500"
                placeholder="Вопрос о товаре"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-700">
                Сообщение
              </label>
              <textarea
                id="message"
                rows={5}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500"
                placeholder="Ваше сообщение..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-gray-800 px-4 py-2 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Отправить
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
