import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { 
  CheckCircle, 
  X, 
  Star,
  MessageSquare,
  Zap,
  Shield,
  Users,
  Crown,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Starter",
      description: "Perfect for individuals getting started with AI conversations",
      icon: MessageSquare,
      monthlyPrice: 0,
      annualPrice: 0,
      popular: false,
      features: [
        "100 messages per month",
        "Basic AI responses",
        "Limited chat history",
        "Community support",
        "Standard response time"
      ],
      limitations: [
        "No advanced features",
        "Limited customization",
        "Basic integrations only"
      ],
      cta: "Start Free",
      ctaVariant: "outline"
    },
    {
      name: "Professional",
      description: "Ideal for professionals and power users",
      icon: Zap,
      monthlyPrice: 19,
      annualPrice: 15,
      popular: true,
      features: [
        "Unlimited messages",
        "Advanced AI responses (GPT-4o)",
        "Full chat history & search",
        "Priority support",
        "Fast response times",
        "Custom conversation templates",
        "Export conversations",
        "Advanced analytics"
      ],
      limitations: [],
      cta: "Start Professional",
      ctaVariant: "default"
    },
    {
      name: "Enterprise",
      description: "For teams and organizations with advanced needs",
      icon: Crown,
      monthlyPrice: 49,
      annualPrice: 39,
      popular: false,
      features: [
        "Everything in Professional",
        "Team collaboration tools",
        "Advanced security features",
        "Custom integrations",
        "Dedicated account manager",
        "99.9% uptime SLA",
        "Custom AI model training",
        "White-label options",
        "Advanced API access",
        "Enterprise SSO"
      ],
      limitations: [],
      cta: "Contact Sales",
      ctaVariant: "outline"
    }
  ];

  const faqs = [
    {
      question: "Can I switch between plans?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences."
    },
    {
      question: "What happens to my data if I cancel?",
      answer: "Your data remains accessible for 30 days after cancellation. You can export your conversations and data before permanent deletion."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, we'll provide a full refund."
    },
    {
      question: "Is there a free trial for paid plans?",
      answer: "Yes, all paid plans come with a 14-day free trial. No credit card required to start your trial."
    },
    {
      question: "How secure is my data?",
      answer: "We use enterprise-grade security with end-to-end encryption. Your conversations are private and never used to train our models."
    },
    {
      question: "Can I use CORTEXIFY for my team?",
      answer: "Yes, our Professional and Enterprise plans support team features including shared conversations and collaboration tools."
    }
  ];

  const getPrice = (plan) => {
    return isAnnual ? plan.annualPrice : plan.monthlyPrice;
  };

  const getSavings = (plan) => {
    if (plan.monthlyPrice === 0) return 0;
    return Math.round(((plan.monthlyPrice * 12) - (plan.annualPrice * 12)) / (plan.monthlyPrice * 12) * 100);
  };

  return (
    <div className="min-h-screen pt-20" data-testid="pricing-page">
      
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
              💰 Pricing
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Simple, Transparent
              <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Pricing Plans
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Choose the perfect plan for your AI conversation needs. Start free and scale as you grow.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4">
              <span className={`text-lg ${!isAnnual ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500'}`}>
                Monthly
              </span>
              <Switch
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
                className="data-[state=checked]:bg-emerald-500"
              />
              <span className={`text-lg ${isAnnual ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500'}`}>
                Annual
              </span>
              {isAnnual && (
                <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                  Save up to 25%
                </Badge>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              const price = getPrice(plan);
              const savings = getSavings(plan);
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative ${plan.popular ? 'scale-105' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2">
                        <Star className="w-4 h-4 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <Card className={`h-full p-8 ${
                    plan.popular 
                      ? 'border-2 border-emerald-500 dark:border-emerald-400 shadow-xl bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-900/20 dark:to-gray-800' 
                      : 'bg-white dark:bg-gray-800 border-0 shadow-lg'
                  }`}>
                    <CardContent className="p-0">
                      {/* Header */}
                      <div className="text-center mb-8">
                        <div className={`w-16 h-16 ${
                          plan.popular 
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-600' 
                            : 'bg-gray-100 dark:bg-gray-700'
                        } rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                          <Icon className={`w-8 h-8 ${
                            plan.popular ? 'text-white' : 'text-gray-600 dark:text-gray-300'
                          }`} />
                        </div>
                        
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {plan.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                          {plan.description}
                        </p>
                        
                        {/* Pricing */}
                        <div className="mb-6">
                          <div className="flex items-baseline justify-center">
                            <span className="text-5xl font-bold text-gray-900 dark:text-white">
                              ${price}
                            </span>
                            <span className="text-xl text-gray-500 dark:text-gray-400 ml-2">
                              /{isAnnual ? 'month' : 'month'}
                            </span>
                          </div>
                          {isAnnual && savings > 0 && (
                            <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2">
                              Save {savings}% with annual billing
                            </p>
                          )}
                          {isAnnual && plan.monthlyPrice > 0 && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-through">
                              ${plan.monthlyPrice}/month billed monthly
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Features */}
                      <div className="space-y-4 mb-8">
                        {plan.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                          </div>
                        ))}
                        
                        {plan.limitations.map((limitation, limitationIndex) => (
                          <div key={limitationIndex} className="flex items-center">
                            <X className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                            <span className="text-gray-500 dark:text-gray-400">{limitation}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      <Link to={plan.name === "Enterprise" ? "/contact" : "/chat"}>
                        <Button 
                          className={`w-full py-3 text-lg ${
                            plan.popular
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl'
                              : plan.ctaVariant === 'outline'
                              ? 'border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-emerald-500 hover:text-emerald-600'
                              : 'bg-gray-900 dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600'
                          } transition-all duration-300`}
                          data-testid={`pricing-cta-${plan.name.toLowerCase()}`}
                        >
                          {plan.cta}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
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
              Why Choose CORTEXIFY?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Advanced features that set us apart from the competition
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "Bank-level encryption and security protocols protect your conversations and data."
              },
              {
                icon: Zap,
                title: "Lightning Performance",
                description: "Optimized infrastructure ensures sub-second response times and 99.9% uptime."
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Share conversations, collaborate on projects, and work together seamlessly."
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center p-8 bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
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

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Everything you need to know about CORTEXIFY pricing
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 bg-white dark:bg-gray-800 border-0 shadow-md">
                  <CardContent className="p-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {faq.answer}
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
            <Sparkles className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of users who are already experiencing the future of AI conversation
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/chat">
                <Button 
                  size="lg" 
                  className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                  data-testid="pricing-cta-start"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Start Free Trial
                </Button>
              </Link>
              
              <Link to="/contact">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-4 text-lg transition-all duration-300"
                  data-testid="pricing-cta-contact"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;