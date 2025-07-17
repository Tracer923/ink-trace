import { z } from "zod"

export const BookFormSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  author: z.string().optional(),
  read_date: z.date(),
  rating: z.number().min(1, "評価を選んでください"),
  content: z.string().min(1, "内容は必須です"),
})

export type BookFormType = z.infer<typeof BookFormSchema>
