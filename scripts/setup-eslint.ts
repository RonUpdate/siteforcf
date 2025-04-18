import { execSync } from "child_process"

// Функция для выполнения команд
function runCommand(command: string) {
  try {
    console.log(`Выполняется: ${command}`)
    execSync(command, { stdio: "inherit" })
  } catch (error) {
    console.error(`Ошибка при выполнении команды: ${command}`)
    console.error(error)
    process.exit(1)
  }
}

// Установка зависимостей ESLint
console.log("Установка зависимостей ESLint...")
runCommand(
  "npm install --save-dev eslint eslint-config-next @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-react-hooks eslint-import-resolver-typescript",
)

console.log("Настройка ESLint завершена!")
console.log("Теперь вы можете запустить проверку импортов с помощью команды:")
console.log("npm run lint:imports")
