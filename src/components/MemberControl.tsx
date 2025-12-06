import { useState } from 'react';
import { addMember, removeMember } from '../services/api';
import UserAvatar from './UserAvatar';

interface MemberControlProps {
    projectId: string;
    members: string[];
    onUpdate: () => void;
}

const MemberControl = ({ projectId, members = [], onUpdate }: MemberControlProps) => {
    const [newMemberId, setNewMemberId] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMemberId.trim()) return;

        setLoading(true);
        try {
            await addMember(projectId, newMemberId);
            setNewMemberId('');
            onUpdate();
        } catch (error) {
            console.error('Failed to add member:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        if (!confirm('Are you sure you want to remove this member?')) return;

        try {
            await removeMember(projectId, memberId);
            onUpdate();
        } catch (error) {
            console.error('Failed to remove member:', error);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <h3 className="text-lg font-bold text-white flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Team Members
                </h3>
            </div>

            <div className="p-6">
                <form onSubmit={handleAddMember} className="mb-6">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Enter Member ID"
                            className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                            value={newMemberId}
                            onChange={(e) => setNewMemberId(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={loading || !newMemberId.trim()}
                            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Add</span>
                        </button>
                    </div>
                </form>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {members.map((memberId) => (
                        <div
                            key={memberId}
                            className="group flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 hover:from-blue-50 hover:to-blue-100/50 rounded-xl transition-all duration-200 border border-gray-100"
                        >
                            <div className="flex items-center gap-3">
                                <UserAvatar userId={memberId} size="md" />
                                <span className="text-sm font-medium text-gray-700">{memberId}</span>
                            </div>
                            <button
                                onClick={() => handleRemoveMember(memberId)}
                                className="text-red-500 hover:text-red-700 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center space-x-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span>Remove</span>
                            </button>
                        </div>
                    ))}

                    {members.length === 0 && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <p className="text-gray-500 text-sm">No team members yet</p>
                            <p className="text-gray-400 text-xs mt-1">Add members to collaborate</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MemberControl;
