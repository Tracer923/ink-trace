import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Bold from "@tiptap/extension-bold"
import Italic from "@tiptap/extension-italic"
import Heading from "@tiptap/extension-heading"
import Blockquote from "@tiptap/extension-blockquote"
import BulletList from "@tiptap/extension-bullet-list"
import OrderedList from "@tiptap/extension-ordered-list"
import ListItem from "@tiptap/extension-list-item"

export default function ReadOnlyEditor({ html }: { html: string }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false }),
      Bold,
      Italic,
      Heading.configure({ levels: [1, 2, 3] }),
      Blockquote,
      BulletList,
      OrderedList,
      ListItem,
    ],
    content: html,
    editable: false,
  })

  if (!editor) return null

  return (
    <div className="prose prose-invert max-w-none text-sm leading-relaxed">
      <EditorContent editor={editor} />
    </div>
  )
}
