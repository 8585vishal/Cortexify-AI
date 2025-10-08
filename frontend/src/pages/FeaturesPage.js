import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Bot, 
  MessageSquare, 
  Zap, 
  Shield, 
  Brain, 
  Globe, 
  Star, 
  Clock,
  Users,
  Code,
  Mic,
  Image,
  BarChart,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const FeaturesPage = () => {
  const mainFeatures = [
    {
      icon: Brain,
      title: "Advanced AI Intelligence",
      description: "Powered by GPT-4o, the most advanced language model available, providing intelligent, contextual, and nuanced responses to complex queries.",
      benefits: ["Natural conversation flow", "Context awareness", "Multi-step reasoning", "Creative problem solving"]
    },
    {
      icon: Zap,
      title: "Lightning Fast Responses",
      description: "Experience near-instantaneous AI responses with real-time typing indicators and optimized processing for seamless conversations.",
      benefits: ["Sub-second response times", "Real-time typing animation", "Optimized performance", "Minimal latency"]
    },
    {
      icon: MessageSquare,
      title: "Persistent Conversations",
      description: "Your chat history is automatically saved and organized, allowing you to continue conversations across sessions and devices.",
      benefits: ["Session management", "Chat history", "Cross-device sync", "Easy navigation"]
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Enterprise-grade security ensures your conversations remain private and secure with end-to-end encryption and data protection.",
      benefits: ["End-to-end encryption", "Data protection", "Privacy controls", "Secure storage"]
    }
  ];

  const additionalFeatures = [
    {
      icon: Globe,
      title: "Multilingual Support",
      description: "Communicate in 100+ languages with natural conversation flow and cultural understanding."
    },
    {
      icon: Code,
      title: "Code Generation",
      description: "Generate, debug, and explain code in multiple programming languages with detailed explanations."
    },
    {
      icon: Mic,
      title: "Voice Integration",
      description: "Coming soon: Voice-to-text and text-to-voice capabilities for hands-free conversations."
    },
    {
      icon: Image,
      title: "Image Analysis",
      description: "Upload and analyze images, get descriptions, and ask questions about visual content."
    },
    {
      icon: BarChart,
      title: "Analytics Dashboard",
      description: "Track your conversation patterns, topics, and AI interaction insights over time."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share conversations with team members and collaborate on AI-assisted projects."
    }
  ];

  const useCases = [
    {
      title: "Content Creation",
      description: "Generate articles, social media posts, marketing copy, and creative content with AI assistance.",
      icon: "✍️"
    },
    {
      title: "Learning & Education",
      description: "Get explanations, tutorials, and educational content tailored to your learning style and pace.",
      icon: "📚"
    },
    {
      title: "Problem Solving",
      description: "Break down complex problems, explore solutions, and get step-by-step guidance on implementation.",
      icon: "🧩"
    },
    {
      title: "Research & Analysis",
      description: "Conduct research, analyze data, summarize information, and generate insights on any topic.",
      icon: "🔍"
    },
    {
      title: "Coding & Development",
      description: "Write code, debug issues, explain algorithms, and get architectural advice for your projects.",
      icon: "💻"
    },
    {
      title: "Business Strategy",
      description: "Develop business plans, analyze markets, create presentations, and explore growth opportunities.",
      icon: "📈"
    }
  ];

  return (
    <div className="min-h-screen pt-20" data-testid="features-page">
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
              ⚡ Features
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Powerful Features for
              <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Intelligent Conversations
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover the advanced capabilities that make CORTEXIFY the most sophisticated AI conversation platform available today.
            </p>
          </motion.div>

          <motion.div 
            className="relative max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1694878981888-7a526050b455?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHxjaGF0JTIwaW50ZXJmYWNlfGVufDB8fHx8MTc1OTkzNTQwNnww&ixlib=rb-4.1.0&q=85"
              alt="Chat Interface"
              className="rounded-2xl shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Main Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Core Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              The foundation of intelligent AI conversations
            </p>
          </motion.div>

          <div className="space-y-16">
            {mainFeatures.map((feature, index) => {
              const Icon = feature.icon;
              const isEven = index % 2 === 0;
              
              return (
                <motion.div 
                  key={index}
                  className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex-1">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mr-4">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                    </div>
                    
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                      {feature.description}
                    </p>
                    
                    <ul className="space-y-3">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex-1 max-w-md">
                    <div className="bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-2xl p-8 h-64 flex items-center justify-center">
                      <Icon className="w-32 h-32 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Advanced Capabilities
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Explore the extended features that make CORTEXIFY even more powerful
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full p-6 hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 border-0 shadow-md">
                    <CardContent className="p-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
              🎯 Use Cases
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Endless Possibilities
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              See how CORTEXIFY can transform your workflow across different domains
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full p-6 text-center hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur border-0 shadow-md">
                  <CardContent className="p-0">
                    <div className="text-4xl mb-4">{useCase.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      {useCase.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {useCase.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Experience All Features Today
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of users who are already leveraging the power of CORTEXIFY's advanced features
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/chat">
                <Button 
                  size="lg" 
                  className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                  data-testid="features-cta-chat"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Start Exploring Now
                </Button>
              </Link>
              
              <Link to="/pricing">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-4 text-lg transition-all duration-300"
                  data-testid="features-cta-pricing"
                >
                  View Pricing Plans
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;