import { useState, type FormEvent } from 'react'
import { toast, Toaster } from 'sonner'

export default function Register() {
  const [name, setName] = useState<string>()
  const [lastname, setLastname] = useState<string>()
  const [email, setEmail] = useState<string>()
  const [password, setPassword] = useState<string>()

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    fetch('/api/register', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, lastname, email, password }),
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
          Password
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id='password'
            type='password'
            autoComplete='off'
            className='border border-zinc-200 p-4 rounded-lg w-full mb-2'
          />
        </label>
        <div className='w-full flex justify-end'>
          <input
            type='submit'
            className='flex bg-black text-white items-center justify-center rounded-lg py-2 px-4 cursor-pointer transition-all hover:opacity-50'
            value='Sign up'
          ></input>
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
