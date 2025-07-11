import { Star } from "lucide-react"

export default function StarRating ({ rating }: { rating: number }) {
    return (
        <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
                <Star
                    key={index}
                    className={`w-4 h-4 ${index < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                />
            ))}
        </div>
    )
}