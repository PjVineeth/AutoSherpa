import { motion } from 'framer-motion';

export function MessageBubble({ message }: { message: { id: string; type: string; content: string } }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`p-3 rounded-lg max-w-[70%] ${
        message.type === 'bot' ? 'bg-blue-100 self-start' : 'bg-green-100 self-end'
      }`}
    >
      {message.content}
    </motion.div>
  );
}
