export default function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-zinc-800 p-4 rounded-md space-y-1">
            <div className="text-lg text-zinc-200 font-semibold">{title}</div>
            <div>{children}</div>
        </div>
    )
}