interface UserAvatarProps {
    userId: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const UserAvatar = ({ userId, size = 'md', className = '' }: UserAvatarProps) => {
    const getInitials = (id: string) => {
        return id.substring(0, 2).toUpperCase();
    };

    const getAvatarColor = (id: string) => {
        const colors = [
            'bg-blue-500',
            'bg-green-500',
            'bg-purple-500',
            'bg-pink-500',
            'bg-indigo-500',
            'bg-yellow-500',
            'bg-red-500',
            'bg-teal-500',
        ];
        const index = id.charCodeAt(0) % colors.length;
        return colors[index];
    };

    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base',
    };

    return (
        <div
            className={`${sizeClasses[size]} ${getAvatarColor(userId)} rounded-full flex items-center justify-center text-white font-bold shadow-md ${className}`}
            title={userId}
        >
            {getInitials(userId)}
        </div>
    );
};

export default UserAvatar;
