import React from 'react';

const CircleNumber = ({ number, size = 5, color = 'gray' }) => {

    const divColorVariants = {
        'gray': 'bg-gray-200 border-gray-400',
        'red': 'bg-red-200 border-red-400',
        'green': 'bg-green-200 border-green-400',
        'yellow': 'bg-yellow-200 border-yellow-400',
        'blue': 'bg-blue-200 border-blue-400',
        'indigo': 'bg-indigo-200 border-indigo-400',
        'purple': 'bg-purple-200 border-purple-400',
        'pink': 'bg-pink-200 border-pink-400',
    }

    const divColor = divColorVariants[color] ?? divColorVariants['gray'];

    const textColorVariants = {
        'gray': 'text-gray-600',
        'red': 'text-red-600',
        'green': 'text-green-600',
        'yellow': 'text-yellow-600',
        'blue': 'text-blue-600',
        'indigo': 'text-indigo-600',
        'purple': 'text-purple-600',
        'pink': 'text-pink-600',
    }

    const textColor = textColorVariants[color] ?? textColorVariants['gray'];

    return (
        <div className={`w-5 h-5 mx-1 rounded-full border-2 flex items-center justify-center ${divColor}`} >
            <span className={`font-bold text-sm ${textColor}`}>{number}</span>
        </div >
    );
};

export default CircleNumber;