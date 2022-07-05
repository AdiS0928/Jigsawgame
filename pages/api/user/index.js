import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"

const prisma = new PrismaClient()

export default async (req, res) => {
    if (req.method !== 'POST'){
        return res.status(405).json({ message: 'Method not allowed' });

    }
    // res.status(200).json(user)
    // } else if(req.method ==='POST'){
    //     const name = req.body.name;
    //     const score = req.body.score;
    //     const newUser = {
    //         name: name,
    //         score: score
    //     }
    //     console.log(newUser);
    //     user.push(newUser);
    //     res.status(201).json(newUser);
    try {
        const userData = JSON.parse(req.body);
        const savedUser = await prisma.user.create({ data: userData });
        res.status(200).json(savedUser);
      } catch (err) {
        res.status(400).json({ message: 'Something went wrong' });
      }

  }
  