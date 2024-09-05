import {
  useCallback,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'
import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Image from '@tiptap/extension-image'

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

  const addImage = useCallback(() => {
    const url = window.prompt('Introduce el link de la imagen')

    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  useEffect(() => {
    const getCategories = () => {
      fetch('/api/getCategories')
        .then((res) => res.json())
        .then((data) => setCategories(data.result))
    }

    getCategories()
  }, [])

  if (!editor) {
    return null
  }

  return (
    <div className='flex md:flex-row flex-col gap-2 justify-between'>
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
          Imagen
        </button>
      </div>
      <div className='flex md:flex-row flex-col mb-4 gap-4'>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as unknown as number)}
        >
          <option value='0'>Selecciona una opción</option>
          {categories?.map((cat, index) => (
            <option key={index} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button
          onClick={submit}
          className='flex bg-black text-white items-center justify-center rounded-lg p-2'
        >
          Subir nuevo blog
        </button>
      </div>
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
            alert('Blog subido correctamente')
            window.location.reload()
          }
        })
    }
  }

  const editor = useEditor({
    extensions: [StarterKit, Bold, Italic, Image],
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
