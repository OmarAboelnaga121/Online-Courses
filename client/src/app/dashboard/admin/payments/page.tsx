"use client"
import { apiService } from "@/services/api";
import { useEffect, useState } from "react";
import { Payment } from "@/types";

export default function AdminPaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const results = await apiService.getPayments();
                setPayments(results);
            } catch (error) {
                console.error('Error fetching payments:', error);
            }
        };
        fetchPayments();
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold my-4">All Payments</h2>
            <div className="bg-white shadow-md rounded my-6 overflow-x-auto">
                <table className="min-w-full w-full table-auto">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">Amount</th>
                            <th className="py-3 px-6 text-left">Date</th>
                            <th className="py-3 px-6 text-left">Status</th>
                            <th className="py-3 px-6 text-left">Method</th>
                            <th className="py-3 px-6 text-left">User ID</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {payments.map((payment) => (
                            <tr key={payment.id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left whitespace-nowrap">
                                    <span className="font-medium">${payment.amount}</span>
                                </td>
                                <td className="py-3 px-6 text-left">
                                    {new Date(payment.date).toLocaleDateString()}
                                </td>
                                <td className="py-3 px-6 text-left">
                                    <span className={`py-1 px-3 rounded-full text-xs ${payment.status === 'succeeded' ? 'bg-green-200 text-green-600' :
                                            payment.status === 'pending' ? 'bg-yellow-200 text-yellow-600' :
                                                'bg-red-200 text-red-600'
                                        }`}>
                                        {payment.status}
                                    </span>
                                </td>
                                <td className="py-3 px-6 text-left">
                                    <span className="bg-blue-100 text-blue-600 py-1 px-3 rounded-full text-xs uppercase">
                                        {payment.method}
                                    </span>
                                </td>
                                <td className="py-3 px-6 text-left">
                                    <span className="text-xs">{payment.userId}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
