import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react"
import StarRating from "./StarRating"

type Book = {
    id: string
    title: string
    author: string
    rating: number
    read_date: string
    tags: { id: string; name: string }[]
}

export default function BookCard({
    book,
    onClick,
    onDelete,
    isOwner,
}: {
    book: Book
    onClick?: () => void
    onDelete?: (id: string) => void
    isOwner?: boolean
}) { // propsからbookとonClick、onDeleteを分割代入し、その型を注釈している
    return (
        <Card
            className="w-full max-w-md relative cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.01] hover:border-zinc-600"
            onClick={onClick}
        >
            <CardHeader>
                <CardTitle>{book.title}</CardTitle>
                <CardDescription>{book.author}</CardDescription>
            </CardHeader>
            <CardContent>
                <StarRating rating={book.rating} />
                <p>読了日：{book.read_date}</p>
                <div className="text-sm text-muted-foreground flex flex-wrap gap-1">
                    タグ：
                    {book.tags?.map((tag, i) => (
                    <Badge key={i} variant="outline" className="ml-1">
                        {tag.name}
                    </Badge>
                    ))}
                </div>
            </CardContent>
            {isOwner && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute bottom-2 right-2"
                    onClick={(e) => {
                        e.stopPropagation()
                        const confirmDelete = window.confirm("この本を本当に削除しますか？")
                        if (confirmDelete){
                            onDelete?.(book.id)
                        }
                    }}
                    >
                    <Trash2 className="w-4 h-4" />
                </Button>
            )}
        </Card>
    )
}