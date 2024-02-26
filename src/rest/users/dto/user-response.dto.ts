export class UserDto {
  id: number
  name: string
  surname: string
  email: string
  username: string
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
  roles: string[]
}
