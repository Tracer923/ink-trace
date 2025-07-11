import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Bold from "@tiptap/extension-bold"
import Italic from "@tiptap/extension-italic"
import Heading from "@tiptap/extension-heading"
import Blockquote from "@tiptap/extension-blockquote"
import BulletList from "@tiptap/extension-bullet-list"
import OrderedList from "@tiptap/extension-ordered-list"
import ListItem from "@tiptap/extension-list-item"

import { useEffect } from "react"

type Props = {
  content: string
  onChange: (value: string) => void
}

export default function RichTextEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, // これでStarterKit内のheadingを無効に
      }),
      Bold,
      Italic,
      Heading.configure({ levels: [1, 2, 3] }),
      Blockquote,
      BulletList,
      OrderedList,
      ListItem,
    ],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) return null

  return (
    <div className="border border-white/20 bg-zinc-800 rounded-md shadow-inner space-y-2">
      {/* ツールバー */}
      <div className="border-b border-white/10 px-4 py-2 sticky top-0 z-10 bg-zinc-800">
      <div className="flex flex-wrap gap-2 text-white">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("bold") ? "bg-blue-500 text-white" : "bg-zinc-700"
          }`}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("italic") ? "bg-blue-500 text-white" : "bg-zinc-700"
          }`}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("heading", { level: 1 }) ? "bg-blue-500 text-white" : "bg-zinc-700"
          }`}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("heading", { level: 2 }) ? "bg-blue-500 text-white" : "bg-zinc-700"
          }`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("blockquote") ? "bg-blue-500 text-white" : "bg-zinc-700"
          }`}
        >
          "
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("bulletList") ? "bg-blue-500 text-white" : "bg-zinc-700"
          }`}
        >
          •
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("orderedList") ? "bg-blue-500 text-white" : "bg-zinc-700"
          }`}
        >
          1.
        </button>
      </div>

      {/* エディタ本体 */}
      <div className="border rounded bg-white text-black overflow-y-auto max-h-[400px] px-4 py-2">
        <EditorContent
          editor={editor}
          className="prose max-w-none focus:outline-none px-2 py-1 [h1,h2,h3,h4,h5,h6]:mt-0 [&_.ProseMirror]:min-h-[10px] [&_.ProseMirror]:p-2"
        />
      </div>
    </div>
    </div>
  )
}
