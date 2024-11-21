type Role = 'user' | 'model'

type Part = {
  text: string
}

type Message = {
  role: Role
  parts: Part[]
}

type ChatHistory = Message[]

export type { Role, Part, Message, ChatHistory }
