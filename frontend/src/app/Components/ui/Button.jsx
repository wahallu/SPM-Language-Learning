"use client";

import React from 'react';
import { motion } from 'motion/react';

const Button = ({
    children,
    onClick,
    type = 'button',
    disabled = false,
    variant = 'primary',
    size = 'md',
    className = '',
    ...props
}) => {
    const baseClasses = 'font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
        primary: 'bg-[#FF7D29] hover:bg-[#FF9D5C] text-white focus:ring-orange-200 shadow-[0px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[0px_2px_0px_0px_rgba(0,0,0,0.3)] active:transform active:translate-y-1',
        secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-200 shadow-[0px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[0px_2px_0px_0px_rgba(0,0,0,0.1)] active:transform active:translate-y-1',
        outline: 'border-2 border-[#FF7D29] text-[#FF7D29] hover:bg-[#FF7D29] hover:text-white focus:ring-orange-200'
    };

    const sizeClasses = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg'
    };

    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={classes}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default Button;