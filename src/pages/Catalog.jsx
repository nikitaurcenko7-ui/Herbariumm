import React, { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import CustomSelect from '../components/CustomSelect.jsx'
import { ProductGrid } from '../components/Product.jsx'

const CATEGORY_OPTIONS = [
  {
    label: 'Травяные сборы',
    options: ['Для сна', 'Для энергии', 'Для иммунитета', 'Для пищеварения']
  },
  {
    label: 'Монотравы',
    options: ['Листовые травы', 'Цветы', 'Ароматные травы', 'Корни и специи']
  },
  {
    label: 'Чайные коллекции',
    options: ['Зелёный', 'Черный', 'Улун', 'Красный', 'Белый', 'Фруктовый']
  },
  {
    label: 'Ягоды, плоды и добавки',
    options: ['Ягоды', 'Плоды', 'Грибы', 'Семена и добавки']
  }
]

const CATEGORY_FILTER_OPTIONS = ['Все категории', ...CATEGORY_OPTIONS]
const FORM_OPTIONS = ['Все формы', 'Рассыпной', 'Чайные пакетики', 'Сушёный', 'Порошок']
const SORT_OPTIONS = ['Популярные', 'Сначала дешевле']

const categoryMatches = (productCategory, selectedCategory) => {
  if (selectedCategory === 'Все категории') return true
  if (productCategory === selectedCategory) return true

  const group = CATEGORY_OPTIONS.find((option) => option.label === selectedCategory)
  return Boolean(group?.options.includes(productCategory))
}

export default function Catalog({ addToCart, products, loading }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Все категории')
  const [form, setForm] = useState('Все формы')
  const [sort, setSort] = useState('Популярные')

  const filtered = useMemo(() => {
    return products
      .filter((product) => product.title.toLowerCase().includes(query.toLowerCase()))
      .filter((product) => categoryMatches(product.category, category))
      .filter((product) => form === 'Все формы' || product.form === form)
      .sort((a, b) => sort === 'Сначала дешевле' ? a.price - b.price : Number(b.popular) - Number(a.popular))
      .slice(0, 9)
  }, [products, query, category, form, sort])

  return (
    <div>
      <h1 className="page-title">Каталог сборов</h1>
      <div className="mt-4 grid gap-5 lg:grid-cols-[300px_1fr]">
        <aside className="panel filter-panel h-fit">
          <div className="relative"><Search className="search-icon absolute left-3 top-3" size={16} /><input className="pl-9" placeholder="Поиск по каталогу" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
          <CustomSelect value={category} options={CATEGORY_FILTER_OPTIONS} onChange={setCategory} />
          <CustomSelect value={form} options={FORM_OPTIONS} onChange={setForm} />
          <CustomSelect value={sort} options={SORT_OPTIONS} onChange={setSort} />
          <button className="btn-ghost w-full" onClick={() => { setQuery(''); setCategory('Все категории'); setForm('Все формы') }}>Сбросить</button>
        </aside>
        <section>
          {loading && <p className="muted text-sm">Загружаем товары из SQLite...</p>}
          {!loading && filtered.length > 0 && <ProductGrid products={filtered} addToCart={addToCart} />}
          {!loading && filtered.length === 0 && <p className="muted text-sm">По вашим параметрам ничего не найдено.</p>}
        </section>
      </div>
    </div>
  )
}
