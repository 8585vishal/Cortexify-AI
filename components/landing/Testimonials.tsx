
import React from 'react';
import { motion } from 'framer-motion';
import { StarIcon } from '../common/Icons';

interface TestimonialCardProps {
    quote: string;
    name: string;
    role: string;
    avatar: string;
    delay: number;
}

const Rating: React.FC = () => (
    <div className="flex items-center mb-4 space-x-1">
        {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        ))}
    </div>
);

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, name, role, avatar, delay }) => (
    <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay }}
        className="bg-gradient-to-b from-gray-800/60 to-gray-900/60 p-8 rounded-2xl border border-gray-700/50 hover:border-teal-500/30 flex flex-col h-full backdrop-blur-sm"
    >
        <Rating />
        <blockquote className="text-gray-300 text-lg leading-relaxed flex-grow mb-6 italic">"{quote}"</blockquote>
        <div className="flex items-center pt-6 border-t border-gray-700/50">
            <img className="w-12 h-12 rounded-full mr-4 border-2 border-gray-700 object-cover" src={avatar} alt={name} />
            <div>
                <p className="font-bold text-white">{name}</p>
                <p className="text-xs text-teal-400 font-medium uppercase tracking-wide">{role}</p>
            </div>
        </div>
    </motion.div>
);

const Testimonials: React.FC = () => {
    const testimonialsData = [
        {
            quote: "CORTEXIFY has revolutionized how our team collaborates. The AI understands context incredibly well and provides solutions that actually work.",
            name: 'Ananya Singh',
            role: 'Product Manager',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        {
            quote: "The response quality is outstanding. It feels like talking to a knowledgeable colleague who's always available. The 'Thinking Mode' is a game changer.",
            name: 'Arjun Mehta',
            role: 'Software Architect',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        {
            quote: "From brainstorming creative concepts to debugging complex code, CORTEXIFY helps me think through ideas more effectively than any other tool.",
            name: 'Isha Patel',
            role: 'Creative Director',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        }
    ];

    return (
        <section id="testimonials" className="py-24 md:py-32 bg-gray-900 relative">
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-900/10 via-gray-900 to-gray-900 pointer-events-none" />
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <span className="inline-block px-3 py-1 text-xs font-bold text-teal-300 bg-teal-900/30 rounded-full mb-6 border border-teal-500/20 tracking-wider uppercase">
                        Testimonials
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-white">What Our Users Say</h2>
                    <p className="text-lg text-gray-400">Join a community of professionals who trust CORTEXIFY.</p>
                </motion.div>
                
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonialsData.map((testimonial, index) => (
                        <TestimonialCard key={index} {...testimonial} delay={index * 0.15} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
