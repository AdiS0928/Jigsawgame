import {useRouter} from 'next/router'
import { useEffect, useState } from 'react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getServerSideProps() {
    const user= await prisma.user.findMany({
        take: 5,
        orderBy: {
        score: 'desc',
        },
      });
    return {
      props: {
        initialUser: user
      }
    };
  }


export default function Leaderboard({ initialUser }){


    const [User, setUser] = useState(initialUser);

    const handleSubmit = (event) => {
        event.preventDefault();
        Router.push('/').then(() => window.location.reload());
      }
    var Router = useRouter();

    //   useEffect( () =>{
    //     // const fetchUser = async () => {
    //     // const res = await fetch('/api/user');
    //     // const users = await res.json();  
        
    //     // setUser(users)
    //     // console.log(users)
    //     // }

    //     // const name = Router.query.name;
    //     // const score = Router.query.score;        
    //     // fetchUser();
    //     // console.log(User)
    // }, []
    //   );

    if(Router.query.score > 0){

    return(
        <div className='flex flex-row'>
            <form className='form block-inline' onSubmit={handleSubmit}>
                <label className=' ml-[100px] text-[20px] overflow-hidden'> Congratulations {Router.query.name}! </label>
                
                <label  className=' ml-[130px]'>Your Score is {Router.query.score}</label>
               
                <label className='leader overflow-hidden' type="text">
                <span className=' ml-auto'>Name </span> <span className=' ml-[80px]'>Score</span>
                    {
                        User.map(user => {
                            return(
                                <div key={user.name}>
                                   <span className=' pr-[100px]'> {user.name}</span> <span className='pr-auto'>{user.score}</span>
                                </div>
                            )
                        })
                    }
                
                </label>

                <button type="submit" className='but'>Home</button>
            </form>   
        </div>
    )}
    else{
        return( <div >
            <form className='form ' onSubmit={handleSubmit}>
                <label className='mx-auto text-[20px] '> Better Luck Next Time! </label>
               
                <label className='leader overflow-hidden' type="text">
                    <div >
                <h3>Name Score</h3>
                    { 
                        User.map(user => {
                            return(
                                <div  key={user.id}>
                                    {user.name}   {user.score}

                                </div>
                                
                            )
                        })
                    }
                    </div>
                
                </label>

                <button type="submit" className='but'>Home</button>
            </form>   
        </div>)
    }
}
