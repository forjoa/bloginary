import { useCallback, useEffect, useState } from 'react'
import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Image from '@tiptap/extension-image'

function MenuBar({ editor }: { editor: Editor }) {
  if (!editor) {
    return null
  }

  const addImage = useCallback(() => {
    const url = window.prompt('URL')

    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <div className='flex justify-between'>
      <div className='flex md:flex-row flex-col gap-2 mb-4'>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`flex gap-2 border border-zinc-200 items-center justify-center rounded-lg px-2 py-1 ${
            editor.isActive('bold') ? 'bg-black text-white' : ''
          }`}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`flex gap-2 border border-zinc-200 items-center justify-center rounded-lg px-2 py-1 ${
            editor.isActive('italic') ? 'bg-black text-white' : ''
          }`}
        >
          Italic
        </button>
        <button
          onClick={addImage}
          className='flex gap-2 border border-zinc-200 items-center justify-center rounded-lg px-2 py-1'
        >
          Set image
        </button>
      </div>
      <div className='flex mb-4'>
        <button className='flex bg-black text-white items-center justify-center rounded-lg p-2'>
          Upload new blog
        </button>
      </div>
    </div>
  )
}

export default function Board() {
  const [content, setContent] = useState('<em>Start writing here...</em>')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const editor = useEditor({
    extensions: [StarterKit, Bold, Italic, Image],
    content: content,
    onUpdate: ({ editor }) => {
      const contentEditor = editor.getHTML()
      console.log(contentEditor)
      setContent(content)
    },
  })

  if (!isClient || !editor) {
    return <div>Loading editor...</div>
  }

  return (
    <div className='w-full backdrop-blur-lg border border-zinc-200 p-4 rounded-lg shadow-xl'>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className='border p-4 rounded-md' />
    </div>
  )
}
