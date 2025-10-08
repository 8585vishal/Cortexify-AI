import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { toast } from '../hooks/use-toast';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  MessageSquare,
  Users,
  Shield,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: ''
      });
    }, 2000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Get in touch via email",
      contact: "hello@cortexify.ai",
      link: "mailto:hello@cortexify.ai"
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak with our team",
      contact: "+1 (555) 123-4567",
      link: "tel:+15551234567"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Our headquarters",
      contact: "San Francisco, CA",
      link: "#"
    },
    {
      icon: Clock,
      title: "Business Hours",
      description: "We're here to help",
      contact: "Mon-Fri 9AM-6PM PST",
      link: "#"
    }
  ];

  const reasons = [
    {
      icon: MessageSquare,
      title: "Product Questions",
      description: "Learn more about CORTEXIFY's features and capabilities"
    },
    {
      icon: Users,
      title: "Enterprise Solutions",
      description: "Discuss custom plans and enterprise integrations"
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      description: "Questions about data privacy and security measures"
    },
    {
      icon: Zap,
      title: "Technical Support",
      description: "Get help with implementation and troubleshooting"
    }
  ];

  return (
    <div className="min-h-screen pt-20" data-testid="contact-page">
      
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
              📞 Contact Us
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Let's Start a
              <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Conversation
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Have questions about CORTEXIFY? Want to explore enterprise solutions? 
              Our team is here to help you unlock the power of AI conversations.
            </p>
          </motion.div>

          {/* Contact Info Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="text-center p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur border-0 shadow-md hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {info.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                        {info.description}
                      </p>
                      <a 
                        href={info.link}
                        className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                      >
                        {info.contact}
                      </a>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Send Us a Message
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      className="h-12"
                      data-testid="contact-name-input"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className="h-12"
                      data-testid="contact-email-input"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company (Optional)
                  </label>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Your company name"
                    className="h-12"
                    data-testid="contact-company-input"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject *
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="What's this about?"
                    className="h-12"
                    data-testid="contact-subject-input"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us more about your needs..."
                    rows={6}
                    data-testid="contact-message-input"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white h-12 text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                  data-testid="contact-submit-button"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </motion.div>

            {/* Why Contact Us */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Why Contact Us?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Whether you're curious about features, need enterprise solutions, or have technical questions, we're here to help.
              </p>

              <div className="space-y-6">
                {reasons.map((reason, index) => {
                  const Icon = reason.icon;
                  return (
                    <motion.div
                      key={index}
                      className="flex items-start space-x-4"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {reason.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {reason.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Quick Contact Options */}
              <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Need Immediate Help?
                </h3>
                <div className="space-y-3">
                  <a 
                    href="mailto:hello@cortexify.ai"
                    className="flex items-center text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Email: hello@cortexify.ai
                  </a>
                  <a 
                    href="tel:+15551234567"
                    className="flex items-center text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Call: +1 (555) 123-4567
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Quick Answers
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Common questions we get from our users
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: "How quickly do you respond to inquiries?",
                answer: "We aim to respond to all inquiries within 24 hours during business days. Urgent matters are prioritized and may receive faster responses."
              },
              {
                question: "Do you offer custom enterprise solutions?",
                answer: "Yes! We offer custom enterprise solutions including white-label options, custom integrations, and dedicated support. Contact our sales team to learn more."
              },
              {
                question: "Can I schedule a demo?",
                answer: "Absolutely! Mention in your message that you'd like to schedule a demo, and we'll set up a personalized demonstration of CORTEXIFY's features."
              },
              {
                question: "What information should I include in my message?",
                answer: "Please include your use case, team size (if applicable), any specific features you're interested in, and your timeline. This helps us provide the most relevant information."
              }
            ].map((faq, index) => (
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
                    <p className="text-gray-600 dark:text-gray-400">
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
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Experience CORTEXIFY?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              While you're waiting for our response, why not try CORTEXIFY right now?
            </p>
            
            <a href="/chat">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                data-testid="contact-cta-try-now"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Try CORTEXIFY Now
              </Button>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;