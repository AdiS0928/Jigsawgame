export const user = [

]

export default function handler(req, res) {
    if (req.method === 'GET'){
    res.status(200).json(user)
    } else if(req.method ==='POST'){
        const name = req.body.name;
        const score = req.body.score;
        const newUser = {
            name: name,
            score: score
        }
        console.log(newUser);
        user.push(newUser);
        res.status(201).json(newUser);
        
    }


  }
  