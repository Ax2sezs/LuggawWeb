import React from 'react'
import { motion } from "framer-motion";

function Loading() {
    return (
        <motion.div
            className="flex flex-col items-center mt-8"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
        >
            <img src="/loading.gif" alt="Loading..." className="w-52 h-auto" />
            <p className="text-main-green font-semibold mt-2">Loading ...</p>
        </motion.div>
    )
}

export default Loading;
