"use client"
import { apiService } from "@/services/api";
import { useEffect, useState } from "react";
import { UserProfile } from "@/types";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserProfile[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const result = await apiService.getUser();
                setUsers(result);

            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold my-4">All Users</h2>
            <div className="bg-white shadow-md rounded my-6 overflow-x-auto">
                <table className="min-w-full w-full table-auto">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">User</th>
                            <th className="py-3 px-6 text-left">Email</th>
                            <th className="py-3 px-6 text-left">Role</th>
                            <th className="py-3 px-6 text-left">Avatar</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {users.map((user) => (
                            <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left whitespace-nowrap">
                                    <div className="flex items-center">
                                        <span className="font-medium">{user.name}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-6 text-left">
                                    {user.email}
                                </td>
                                <td className="py-3 px-6 text-left">
                                    <span className={`py-1 px-3 rounded-full text-xs ${user.role === 'admin' ? 'bg-purple-200 text-purple-600' :
                                            user.role === 'instructor' ? 'bg-blue-200 text-blue-600' :
                                                'bg-gray-200 text-gray-600'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="py-3 px-6 text-left">
                                    {user.avatarUrl ? (
                                        <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                                            {user.name.charAt(0)}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
