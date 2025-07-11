import { Star } from "lucide-react"

export default function StarSelector({
    value,
    onChange,
}: {
    value: number
    onChange: (val: number) => void
}) {
    return (
        <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => {
                const filled = i < value
                return (
                    <Star 
                        key={i}
                        className={`w-6 h-6 cursor-pointer transition duration-200 transform ${
                            filled ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        } hover:scale-110`}
                        onClick={() => onChange(i + 1)}
                        onMouseEnter={() => {}}
                    />
                )
            })}
        </div>
    )
}