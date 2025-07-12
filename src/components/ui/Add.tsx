import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabaseClient"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import TagSelector from "./Tag"
import StarSelector from "./StarSelector"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogOverlay } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import RichTextEditor from "@/components/ui/RichTextEditor"

const formSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  author: z.string().optional(),
  read_date: z.date(),
  rating: z.number().min(1, "評価を選んでください"), // 0は未評価扱い
  content: z.string().min(1, "内容は必須です"),
})

const templates = {
  business: `
<h1>【なぜこの本を選んだのか】</h1>
<h1>【この本から得たいこと】</h1>
<h1>【印象に残った内容】</h1>
<h1>【これからどう活かすか】</h1>
<h1>【読後の気づき・変化】</h1>
`,
  novel: `
<h1>【あらすじ】</h1>
<h1>【印象に残った登場人物】</h1>
<h1>【感想】</h1>
<h1>【心に残った一文】</h1>
`,
}

type BookForm = z.infer<typeof formSchema>

export default function Add({ onBookAdded }: { onBookAdded: () => void }) {
  const [open, setOpen] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof templates>("business")


  const form = useForm<BookForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      author: "",
      read_date: new Date(),
      rating: 0,
      content: "",
    },
  })

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) {
        console.error("ユーザー取得失敗", error)
      } else {
        setUserId(user?.id ?? null)
      }
    }
    fetchUser()
  }, [])

  async function onSubmit(data: BookForm) {
    if (!userId) {
      alert("ユーザー情報が取得できていません")
      return
    }

    const { data: insertedBook, error: bookError } = await supabase
      .from("books")
      .insert([{
        title: data.title,
        author: data.author,
        read_date: format(data.read_date, "yyyy-MM-dd"),
        rating: data.rating,
        content: data.content,
        user_id: userId,
      }])
      .select()
      .single()

    if (bookError || !insertedBook) {
      console.error("追加時のエラー：", bookError)
      return
    }

    if (selectedTagIds.length > 0) {
      const relations = selectedTagIds.map((tagId) => ({
        book_id: insertedBook.id,
        tag_id: tagId,
      }))
      const { error: relationError } = await supabase
        .from("book_tags")
        .insert(relations)

      if (relationError) {
        console.error("タグの関連付け失敗：", relationError)
      }
    }

    console.log("追加成功！")
    form.reset()
    setSelectedTagIds([])
    setOpen(false)
    onBookAdded()
  }

  if (!userId) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">追加</Button>
      </DialogTrigger>
      <DialogOverlay className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm transition-opacity" />
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        className="z-[9999] w-full max-w-4xl max-h-[90vh] overflow-y-auto space-y-6 bg-zinc-900 text-white"
      >
        <DialogHeader>
          <DialogTitle>本を追加</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/* タイトル */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>タイトル</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  {form.formState.errors.title && (
                    <p className="text-red-500 text-sm">{form.formState.errors.title.message}</p>
                  )}
                </FormItem>
              )}
            />

            {/* 著者 */}
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>著者</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* 評価 */}
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>評価</FormLabel>
                  <FormControl>
                    <StarSelector value={field.value} onChange={field.onChange} />
                  </FormControl>
                  {form.formState.errors.rating && (
                    <p className="text-red-500 text-sm">{form.formState.errors.rating.message}</p>
                  )}
                </FormItem>
              )}
            />

            {/* 読了日 */}
            <FormField
              control={form.control}
              name="read_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>読了日</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "yyyy-MM-dd") : "日付を選択"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="z-[10000] w-auto p-0" side="bottom" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            {/* タグ */}
            <FormItem>
              <FormLabel>タグ</FormLabel>
              <TagSelector
                selectedTagIds={selectedTagIds}
                setSelectedTagIds={setSelectedTagIds}
              />
            </FormItem>

            {/* 内容 */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                
                <FormItem>
                  <FormLabel>内容</FormLabel>

                  {/* テンプレ選択・挿入UI */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-white">テンプレート:</label>
                      <select
                        value={selectedTemplate}
                        onChange={(e) => setSelectedTemplate(e.target.value as keyof typeof templates)}
                        className="bg-zinc-800 border border-zinc-700 text-white text-sm rounded px-2 py-1"
                      >
                        <option value="business">ビジネス本</option>
                        <option value="novel">小説</option>
                      </select>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        form.setValue("content", templates[selectedTemplate])
                      }}
                    >
                      テンプレートを挿入
                    </Button>
                  </div>

                  <FormControl>
                    <RichTextEditor
                      content={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>

                  {form.formState.errors.content && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.content.message}
                    </p>
                  )}
                </FormItem>

              )}
            />

            <Button type="submit">保存</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
