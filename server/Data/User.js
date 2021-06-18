import bcrypt from 'bcryptjs'

const users = [
  {
    name: 'User 1',
    email: 'user1@example.com',
    password: bcrypt.hashSync('123456', 10),
    
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'Mark Smith',
    email: 'mark@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
]

export default users