import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10)

    // Check if user exists
    let user = await prisma.user.findUnique({
        where: { email: 'admin@diamondv.com' }
    })

    if (!user) {
        user = await prisma.user.create({
            data: {
                email: 'admin@diamondv.com',
                password: hashedPassword,
                name: 'Dr. Test',
                role: 'MEDECIN',
            }
        })
        console.log('User created:', user.email)
    } else {
        console.log('User already exists:', user.email)

        // Update password just in case
        await prisma.user.update({
            where: { email: 'admin@diamondv.com' },
            data: { password: hashedPassword }
        })
        console.log('Password reset to password123')
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
