'use client';

import { trpc } from '@/lib/trpc/client';

export default function AdminPage() {
    const { data: admins, isLoading, error } = trpc.admin.getAll.useQuery();

    if (isLoading) return <div className="p-6">Chargement des administrateurs...</div>;
    if (error) return <div className="p-6 text-red-500">Erreur : {error.message}</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Liste des Administrateurs</h1>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Département</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {admins?.map((admin: any) => (
                            <tr key={admin.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {admin.firstName} {admin.lastName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.role}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.department}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.phone}</td>
                            </tr>
                        ))}
                        {admins?.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                    Aucun administrateur trouvé.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
