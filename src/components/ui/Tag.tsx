import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabaseClient"

type Tag = {
    id: string
    name: String
}

export default function TagSelector({
    selectedTagIds,
    setSelectedTagIds,
}: {
    selectedTagIds: string[]
    setSelectedTagIds: (ids: string[]) => void
}) {
    const [tags, setTags] = useState<Tag[]>([])

    useEffect(() => {
        const fetchTags = async () => {
            const { data, error } = await supabase.from("tags").select("*")
            if (error) {
                console.error("タグ取得エラー:", error)
            } else {
                setTags(data)
            }
        }

        fetchTags()
    }, [])

    const toggleTag = (id: string) => {
        if (selectedTagIds.includes(id)) {
            setSelectedTagIds(selectedTagIds.filter((tagId) => tagId !== id))
        } else {
            setSelectedTagIds([...selectedTagIds, id])
        }
    }

    return (
        <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
            <Badge
            key={tag.id}
            variant={selectedTagIds.includes(tag.id) ? "default" : "outline"}
            onClick={() => toggleTag(tag.id)}
            className="cursor-pointer"
            >
            {tag.name}
            </Badge>
        ))}
        </div>
    )
}