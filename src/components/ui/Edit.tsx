import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { BookFormSchema, BookFormType } from "@/lib/formSchemas"
import BookForm from "@/components/ui/BookForm"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay } from "@/components/ui/dialog"
import { supabase } from "@/lib/supabaseClient"
import { format } from "date-fns"

export default function Edit({ open, setOpen, book, onBookUpdated }: {
    open: boolean
    setOpen: (open: boolean) => void
    book: BookFormType & { id: string }
    onBookUpdated: () => void
}) {
    const form = useForm<BookFormType>({
        resolver: zodResolver(BookFormSchema),
        defaultValues: {
        title: book.title,
        author: book.author,
        read_date: new Date(book.read_date),
        rating: book.rating,
        content: book.content,
        },
    })

    async function onSubmit(data: BookFormType) {
        console.log("更新しようとしてるID:", book.id)
        const { data: updatedBook, error } = await supabase
            .from("books")
            .update({
            title: data.title,
            author: data.author,
            read_date: format(data.read_date, "yyyy-MM-dd"),
            rating: data.rating,
            content: data.content,
            })
            .eq("id", book.id)
            .select()
            .single()
        if (error) {
            console.error("更新失敗：", error)
        } else {
            console.log("更新成功：", updatedBook)
            onBookUpdated()
            setOpen(false)
        }
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
            <BookForm form={form} onSubmit={onSubmit} isEditing />
        </DialogContent>
    </Dialog>
    )
}
