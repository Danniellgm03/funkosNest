import { Category } from '../enums/Categoria'

export class Funko {
  id: number
  name: string
  price: number
  quantity: number
  image: string
  category: Category
  createdAt: Date
  updatedAt: Date
}
