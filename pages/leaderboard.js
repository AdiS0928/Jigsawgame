import Router from 'next/router'
import { useEffect, useState } from 'react';
import { user } from '../data/user';
export default function Leaderboard(){

    const [User, setUser] = useState([]);

    const handleSubmit = (event) => {
        event.preventDefault();
        Router.push('/').then(() => window.location.reload());
      }

      useEffect( () =>{
        const fetchUser = async () => {
        const res = await fetch('/api/user');
        const users = await res.json();  
        
        setUser(users)
        console.log(users)
        }

        const name = Router.query.name;
        const score = Router.query.score;

        const submitLeader = async () => {
            const res = await fetch('/api/user', {
                method: 'POST',
                body: JSON.stringify({name,score}),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const data = await res.json();
            console.log(data);
        }
        submitLeader();
        fetchUser();
        console.log(User)
    }, []
      );


    return(
        <div >
            <form className='form ' onSubmit={handleSubmit}>
                <label className='mx-auto text-[20px] '> Congratulations {Router.query.name}! </label>
                
                <label className='mx-auto '>Your Score is {Router.query.score}</label>
               
                <label className='leader overflow-hidden' type="text">
                    {
                        User.map(user => {
                            return(
                                <div key={user.name}>
                                    {user.name} {user.score}
                                </div>
                            )
                        })
                    }
                
                </label>

                <button type="submit" className='but'>Home</button>
            </form>   
        </div>
    )
}
