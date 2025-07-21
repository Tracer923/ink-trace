import { useEffect, useState } from "react"

import BookCard from "@/components/ui/BookCard"
import Header from "@/components/ui/Header"
import Add from "@/components/ui/Add"
import Edit from "@/components/ui/Edit"
import StarRating from "@/components/ui/StarRating"
import Section from "@/components/ui/Section"
import ReadOnlyEditor from "@/components/ui/ReadOnlyEditor"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

import { supabase } from "@/lib/supabaseClient"

type Book = {
  id: string
  title: string
  author: string
  rating: number
  read_date: string
  content: string
  tags: { id: string; name: string }[]
  created_at: string
  updated_at: string
  user_id?: string
}

export default function Home({ user }: { user?: any }) {
  const [books, setBooks] = useState<Book[]>([])
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [editingBook, setEditingBook] = useState<Book | null>(null)


  const [userId, setUserId] = useState<string | null>(null)

  const [editOpen, setEditOpen] = useState(false)


  const fetchBooks = async () => {
    const { data, error } = await supabase
    .from("books")
    .select(`
      *,
      book_tags (
        tag:tags (
          id,
          name
        )
      )
    `)
    .order("read_date", { ascending: false })

    if (error) {
      console.error("読み込みエラー:", error)
    } else {
      const booksWithTags = data.map((book: any) => ({
        ...book,
        tags: book.book_tags
          .map((bt: any) => bt.tag)
          .filter((tag: any) => tag?.id && tag?.name)
      }))
      setBooks(booksWithTags)
    }
  }

  const fetchUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
      console.error("ユーザー取得エラー", error)
    } else {
      setUserId(user?.id ?? null)
    }
  }

  const handleDelete = async (id: string) => {
    const {error} = await supabase.from('books').delete().eq('id', id)
    if (error) {
      console.error("削除エラー:", error)
    } else {
      console.log("削除成功！")
      fetchBooks()
    }
  }

  useEffect(() => {
    fetchUser()
    fetchBooks()
  }, [])

  return (
    <>
      <Header/>
        <div className="p-4">
          <div className="flex justify-end gap-2 mb-6">
            <Add onBookAdded={fetchBooks} />
            {/* <Button variant="outline">編集</Button> */}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {books.map((book) => (
              <BookCard 
                key={book.id} 
                book={book} 
                onClick={() => setSelectedBook(book)} 
                onDelete={handleDelete}
                isOwner={book.user_id === userId}
              />
            ))}
          </div>
        {/* モーダル表示部分 */}
        <Dialog open={!!selectedBook} onOpenChange={() => setSelectedBook(null)}>
          <DialogOverlay className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm transition-opacity" />
          <DialogContent className="z-[9999] w-full max-w-4xl max-h-[90vh] overflow-y-auto space-y-6 bg-zinc-900 text-white">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <DialogTitle className="text-2xl font-bold text-white">
                  {selectedBook?.title}
                </DialogTitle>
                {selectedBook?.user_id === userId && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingBook(selectedBook)
                      setSelectedBook(null)
                      setTimeout(() => {
                        setEditOpen(true)
                      }, 100)
                    }}
                  >
                    編集
                  </Button>
                )}
              </div>
            </DialogHeader>

            <Section title="著者">
              <p>{selectedBook?.author || "（不明）"}</p>
            </Section>

            <Section title="評価">
              <StarRating rating={selectedBook?.rating || 0} />
            </Section>

            <Section title="読了日">
              <p>{selectedBook?.read_date || "（未設定）"}</p>
            </Section>

            <Section title="タグ">
              <div className="flex flex-wrap gap-2">
                {selectedBook?.tags?.length ? (
                  selectedBook.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-white border-white">
                      {tag.name}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">（なし）</span>
                )}
              </div>
            </Section>

            <Section title="内容">
              {selectedBook?.content ? (
                <div className="border border-white/20 bg-zinc-800 rounded-md p-4 shadow-inner">
                  <ReadOnlyEditor html={selectedBook.content} />
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">（なし）</p>
              )}
            </Section>

          </DialogContent>
        </Dialog>
        {editingBook && (
          <Edit
            open={editOpen}
            setOpen={setEditOpen}
            book={{
              ...editingBook,
              read_date: new Date(editingBook.read_date),
            }}
            onBookUpdated={() => {
              fetchBooks()
              setEditOpen(false)
              setSelectedBook(null)
            }}
          />
        )}
      </div>
    </>
  )
}
