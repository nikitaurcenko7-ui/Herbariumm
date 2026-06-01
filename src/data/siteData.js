import harvest1 from '../assets/harvest-1.jpeg'
import harvest2 from '../assets/harvest-2.jpeg'
import harvest3 from '../assets/harvest-3.jpeg'
import harvest4 from '../assets/harvest-4.jpeg'
import harvest5 from '../assets/harvest-5.jpeg'

export const routes = [
  ['home', 'Главная'],
  ['catalog', 'Каталог'],
  ['delivery', 'Доставка'],
  ['contacts', 'Контакты']
]

export const harvestSlides = [
  { title: 'Сбор в чистых зонах', text: 'Отбираем травы в сезон и собираем вручную, чтобы сохранить полезные свойства.', image: harvest1 },
  { title: 'Щадящая сушка', text: 'Поддерживаем мягкую температуру и вентиляцию, чтобы аромат и цвет оставались стабильными.', image: harvest2 },
  { title: 'Сортировка партий', text: 'Проверяем сырье перед смешиванием и убираем все, что не проходит внутренний стандарт.', image: harvest3 },
  { title: 'Бережное смешивание', text: 'Собираем рецептуры малыми партиями, чтобы вкус и аромат оставались ровными от заказа к заказу.', image: harvest4 },
  { title: 'Фасовка и отправка', text: 'Упаковываем сборы в защитную тару и передаем заказ в доставку в течение суток.', image: harvest5 }
]

export function scrollToSupplyForm(navigate) {
  const form = document.getElementById('supply-form')
  if (form) {
    form.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return
  }

  navigate('home')
  window.setTimeout(() => {
    document.getElementById('supply-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, 220)
}
