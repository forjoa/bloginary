import { useState, type FormEvent } from 'react'
import { toast, Toaster } from 'sonner'

export default function Register() {
  const [name, setName] = useState<string>('')
  const [lastname, setLastname] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [selectedImage, setSelectedImage] = useState('')

  const images = [
    {
      src: '/bad_guy.jpg',
      alt: 'bad_guy',
    },
    {
      src: '/bald_beard.jpg',
      alt: 'bald_beard',
    },
    {
      src: 'nerd.jpg',
      alt: 'nerd',
    },
    {
      src: 'rock.jpg',
      alt: 'rock',
    },
  ]

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    fetch('/api/register', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        lastname,
        email,
        password,
        profileImage: selectedImage,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          toast.error(data.message)
        } else {
          window.location.pathname = '/subir'
        }
      })
  }

  return (
    <div className='w-full backdrop-blur-lg border border-zinc-200 p-4 rounded-lg shadow-xl'>
      <Toaster position='top-center' />
      <form className='flex flex-col gap-2' onSubmit={submit}>
        <h2 className='font-bold text-xl'>Registro</h2>
        <span className='text-zinc-500'>
          Gracias por depositar tu confianza con nosotros, podras compartir todo
          lo que desees.
        </span>
        <label htmlFor='name' className='flex flex-col gap-1'>
          Nombre
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type='name'
            id='name'
            placeholder='Nombre'
            autoComplete='off'
            className='border border-zinc-200 p-4 rounded-lg w-full mb-2'
          />
        </label>
        <label htmlFor='lastname' className='flex flex-col gap-1'>
          Apellido
          <input
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            type='lastname'
            id='lastname'
            placeholder='Apellido'
            autoComplete='off'
            className='border border-zinc-200 p-4 rounded-lg w-full mb-2'
          />
        </label>
        <label htmlFor='email' className='flex flex-col gap-1'>
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type='email'
            id='email'
            placeholder='Email'
            autoComplete='off'
            className='border border-zinc-200 p-4 rounded-lg w-full mb-2'
          />
        </label>
        <label htmlFor='password' className='flex flex-col gap-1'>
          Contraseña
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id='password'
            type='password'
            autoComplete='off'
            className='border border-zinc-200 p-4 rounded-lg w-full mb-2'
          />
        </label>

        <div className='flex flex-col gap-2'>
          <span className='text-sm'>Foto de perfil</span>
          <div className='flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-10 mx-6 md:mx-32'>
            {images.map((image) => (
              <label
                key={image.alt}
                className={`relative cursor-pointer rounded-lg overflow-hidden border-2 ${
                  selectedImage === image.alt
                    ? 'border-black'
                    : 'border-transparent'
                }`}
              >
                <input
                  type='radio'
                  name='profileImage'
                  value={image.alt}
                  checked={selectedImage === image.alt}
                  onChange={(e) => setSelectedImage(e.target.value)}
                  className='sr-only'
                />
                <img
                  src={image.src}
                  alt={image.alt}
                  className='w-full h-64 md:h-80 object-fill'
                />
                {selectedImage === image.alt && (
                  <div className='absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center'>
                    <div className='w-6 h-6 rounded-full bg-white flex items-center justify-center'>
                      <div className='w-4 h-4 rounded-full bg-black' />
                    </div>
                  </div>
                )}
              </label>
            ))}
          </div>
        </div>

        <div className='w-full flex justify-end'>
          <input
            type='submit'
            className='flex bg-black text-white items-center justify-center rounded-lg py-2 px-4 cursor-pointer transition-all hover:opacity-50'
            value='Sign up'
          />
        </div>
        <div className='w-full flex justify-end gap-1'>
          Si ya tienes cuenta,
          <a href='/subir' className='underline'>
            inicia sesión
          </a>
        </div>
      </form>
    </div>
  )
}
