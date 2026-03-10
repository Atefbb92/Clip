import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { admin } from "better-auth/plugins";
import { APIError } from "better-auth/api";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: false, // Prevent automatic sign-in after registration
    },
    user: {
        additionalFields: {
            profession: {
                type: "string",
                required: false,
            },
            address: {
                type: "string",
                required: false,
            },
            zipCode: {
                type: "string",
                required: false,
            },
            city: {
                type: "string",
                required: false,
            },
            country: {
                type: "string",
                required: false,
            },
            agreeMarketing: {
                type: "boolean",
                required: false,
            }
        }
    },
    plugins: [
        admin(),
    ],
    databaseHooks: {
        session: {
            create: {
                before: async (session) => {
                    const dbUser = await prisma.user.findUnique({
                        where: { id: session.userId },
                    });

                    if (!dbUser?.isApproved) {
                        throw APIError.from("UNAUTHORIZED", {
                            code: "NOT_APPROVED",
                            message: "Votre compte est en attente de validation par un administrateur."
                        });
                    }

                    return { data: session };
                },
            },
        },
    },
});
