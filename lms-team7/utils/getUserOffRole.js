import { clerkClient } from '@clerk/nextjs/server'

export const getUserOffRole = async () => {
    const client = await clerkClient();
    const rawUsers = (await client.users.getUserList()).data;
    // Serialize users to plain objects
    const users = rawUsers.map(user => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)?.emailAddress,
        role: user.publicMetadata.role || 'student'
    }));

    // Divide users into students and teachers
    const admins = users.filter(user => user.role === 'admin');
    const teachers = users.filter(user => user.role === 'teacher');
    const students = users.filter(user => user.role === 'student' || !user.role);
    return { admins, teachers, students };
}