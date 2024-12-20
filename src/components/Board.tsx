import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from 'react'

import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Image from '@tiptap/extension-image'
import CodeBlock from '@tiptap/extension-code-block'
import Youtube from '@tiptap/extension-youtube'
import Underline from '@tiptap/extension-underline'

import { toast, Toaster } from 'sonner'

import ImageIcon from '../assets/Image.tsx'
import YoutubeIcon from '@/assets/Youtube.tsx'
import BoldIcon from '@/assets/Bold.tsx'
import ItalicIcon from '@/assets/Italic.tsx'
import CodeIcon from '@/assets/Code.tsx'
import UnderlineIcon from '@/assets/Underline.tsx'

interface MenuBarProps {
  editor: Editor
  submit: () => void
  category: number
  setCategory: Dispatch<SetStateAction<number>>
}

interface CategoryI {
  id?: number
  name: string
}

function MenuBar({ editor, submit, category, setCategory }: MenuBarProps) {
  const [categories, setCategories] = useState<CategoryI[]>()

  if (!editor) {
    return null
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const file = Array.from(files)[0]
    if (!file) return

    const data = new FormData()
    data.append('file', file)
    data.append('upload_preset', 'bondsimages')

    fetch(import.meta.env.PUBLIC_CLOUDINARY_ENDPOINT, {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        addImage(data.secure_url)
      })
      .finally(() => (event.target.value = ''))
  }

  const addImage = useCallback(
    (image: string) => {
      if (image) {
        editor.chain().focus().setImage({ src: image }).run()
      }
    },
    [editor]
  )

  const addYoutube = () => {
    const url = prompt('Ingresa la URL del video:')
    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: 640,
        height: 480,
      })
    }
  }

  useEffect(() => {
    const getCategories = () => {
      fetch('/api/getCategories')
        .then((res) => res.json())
        .then((data) => setCategories(data.result))
    }
    getCategories()
  }, [])

  return (
    <div className='sticky top-10 w-full bg-white z-10 flex flex-wrap gap-2 mb-4 p-2 border rounded-lg border-zinc-200'>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`flex gap-2 border border-zinc-200 items-center justify-center rounded-lg px-2 py-1 ${
          editor.isActive('bold') ? 'bg-black text-white' : ''
        }`}
      >
        <BoldIcon />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`flex gap-2 border border-zinc-200 items-center justify-center rounded-lg px-2 py-1 ${
          editor.isActive('italic') ? 'bg-black text-white' : ''
        }`}
      >
        <ItalicIcon />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`flex gap-2 border border-zinc-200 items-center justify-center rounded-lg px-2 py-1 ${
          editor.isActive('underline') ? 'bg-black text-white' : ''
        }`}
      >
        <UnderlineIcon />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`flex gap-2 border border-zinc-200 items-center justify-center rounded-lg px-2 py-1 ${
          editor.isActive('codeBlock') ? 'bg-black text-white' : ''
        }`}
      >
        <CodeIcon />
      </button>
      <label className='flex gap-2 border border-zinc-200 items-center justify-center rounded-lg px-2 py-1 cursor-pointer'>
        <input type='file' onChange={handleImageChange} className='hidden' />
        <ImageIcon />
      </label>
      <label className='flex gap-2 border border-zinc-200 items-center justify-center rounded-lg px-2 py-1 cursor-pointer'>
        <button onClick={addYoutube} className='hidden' />
        <YoutubeIcon />
      </label>
      <select
        value={category}
        onChange={(e) => setCategory(parseInt(e.target.value))}
        className='border border-zinc-200 rounded-lg p-1'
      >
        <option value='0'>Selecciona una categoría</option>
        {categories?.map((cat, index) => (
          <option key={index} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      <button
        onClick={submit}
        className='flex bg-black text-white items-center justify-center rounded-lg py-2 px-4 transition-all hover:opacity-50'
      >
        Subir blog
      </button>
    </div>
  )
}

export default function Board() {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(0)
  const [content, setContent] = useState('<em>Empieza a escribir aquí...</em>')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const onSubmit = () => {
    if (category === 0 || title === '') {
      alert('Completa todos los campos')
    } else {
      fetch('/api/uploadPost', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category, title, content }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.result.rowsAffected > 0) {
            toast.success('Blog subido correctamente')
            window.location.reload()
          }
        })
    }
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Image,
      CodeBlock,
      Underline,
      Youtube.configure({ controls: false, nocookie: true }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const contentEditor = editor.getHTML()
      setContent(contentEditor)
    },
  })

  if (!isClient || !editor) {
    return <div>Cargando editor...</div>
  }

  return (
    <div className='w-full backdrop-blur-lg border border-zinc-200 p-4 rounded-lg shadow-xl'>
      <Toaster position='top-center' />
      <MenuBar
        editor={editor}
        submit={onSubmit}
        category={category}
        setCategory={setCategory}
      />
      <input
        type='text'
        placeholder='Título'
        className='border border-zinc-200 p-4 rounded-lg w-full mb-2'
        onChange={(e) => setTitle(e.target.value)}
      />
      <EditorContent editor={editor} className='border p-4 rounded-md' />
    </div>
  )
}
