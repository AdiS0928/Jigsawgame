import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"

const prisma = new PrismaClient()

export default async (req, res) => {
    if (req.method !== 'POST'){
        return res.status(405).json({ message: 'Method not allowed' });

    }

    try {
        const userData = JSON.parse(req.body);
        const savedUser = await prisma.user.create({ data: userData });
        res.status(200).json(savedUser);
      } catch (err) {
        res.status(400).json({ message: 'Something went wrong' });
      }

  }
  