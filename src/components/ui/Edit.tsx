import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { BookFormSchema, BookFormType } from "@/lib/formSchemas"
import BookForm from "@/components/ui/BookForm"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay
} from "@/components/ui/dialog"
import { supabase } from "@/lib/supabaseClient"
import { format } from "date-fns"

export default function Edit({
  open,
  setOpen,
  book,
  onBookUpdated
}: {
  open: boolean
  setOpen: (open: boolean) => void
  book: BookFormType & { id: string; tags: { id: string; name: string }[] }
  onBookUpdated: () => void
}) {
  const form = useForm<BookFormType>({
    resolver: zodResolver(BookFormSchema),
    defaultValues: {
      title: book.title,
      author: book.author,
      read_date: new Date(book.read_date),
      rating: book.rating,
      content: book.content
    }
  })

  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    Array.isArray(book.tags) ? book.tags.map((t) => t.id) : []
  )

  useEffect(() => {
    form.reset({
        title: book.title,
        author: book.author,
        read_date: new Date(book.read_date),
        rating: book.rating,
        content: book.content
    })
    setSelectedTagIds(Array.isArray(book.tags) ? book.tags.map((t) => t.id) : [])
  }, [book, form])

  async function onSubmit(data: BookFormType) {
    console.log("更新しようとしてるID:", book.id)

    // 本体データを更新
    const { data: updatedBook, error } = await supabase
      .from("books")
      .update({
        title: data.title,
        author: data.author,
        read_date: format(data.read_date, "yyyy-MM-dd"),
        rating: data.rating,
        content: data.content
      })
      .eq("id", book.id)
      .select()
      .single()

    if (error) {
      console.error("更新失敗：", error)
      return
    }

    // タグのリセット
    const { error: deleteError } = await supabase
        .from("book_tags")
        .delete()
        .eq("book_id", book.id)
        console.log("削除完了 → 次に追加開始")


    if (deleteError) {
        console.error("タグ削除失敗：", deleteError)
        return
    }

    // タグの追加
    if (selectedTagIds.length > 0) {
        console.log("選択されたタグ:", selectedTagIds)
        const tagRelations = selectedTagIds.map((tagId) => ({
            book_id: book.id,
            tag_id: tagId
        }))

        const { error: insertError } = await supabase
            .from("book_tags")
            .upsert(tagRelations, { onConflict: "book_id,tag_id" })

        if (insertError) {
            console.error("タグ挿入失敗：", insertError)
            return
        }
    }

    console.log("更新成功：", updatedBook)
    onBookUpdated()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogOverlay className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm transition-opacity" />
      <DialogContent
        className="z-[9999] max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-900 text-white"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>本を編集</DialogTitle>
        </DialogHeader>
        <BookForm
          form={form}
          onSubmit={onSubmit}
          isEditing
          selectedTagIds={selectedTagIds}
          setSelectedTagIds={setSelectedTagIds}
        />
      </DialogContent>
    </Dialog>
  )
}
