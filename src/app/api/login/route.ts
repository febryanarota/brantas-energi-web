// export async function POST (req: Request, res: Response) {
//   const { username, password } = req.body
//   const user = await User.findOne
//     if (!user) {
//         return res.status(404).json({ message: 'User not found' })
//     }
//     const isMatch = await bcrypt.compare(password, user.password)
