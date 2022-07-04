import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Router from 'next/router'

export default function Home () {
  const [Name, setName] = useState('');
  const [Email, setEmail] = useState('');
  const [Phone, setPhone] = useState('');


  const handleSubmit = (event) => {
    event.preventDefault();
    Router.push(Router.push({
      pathname: '/game',
      query: { name: Name}
  })
  );
  }

  return (
    <div>
      <form className='form'onSubmit = {handleSubmit}>
        <input className='card'  placeholder="NAME"   onChange={event => setName(event.target.value)} required />
        <input className='card'  placeholder="EMAIL"  type="email" required />
        <input className='card' placeholder="MOBILE NO"  type="phone" required />
        <button type="submit" className='but'>Submit</button>
      </form>
    </div>
  )
}
