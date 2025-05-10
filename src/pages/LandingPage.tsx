
import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Award, Users, ArrowRight, Dumbbell, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-black to-gray-900 text-white">
      {/* Navigation */}
      <header className="container mx-auto py-6 px-4 md:px-0 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Activity size={28} className="text-brand-secondary" />
          <h1 className="text-2xl font-bold">
            <span className="text-brand-primary">Fit</span>
            <span className="text-brand-secondary">Community</span>
          </h1>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="hover:text-brand-primary transition-colors">Home</Link>
          <Link to="/workouts" className="hover:text-brand-primary transition-colors">Workouts</Link>
          <Link to="/challenges" className="hover:text-brand-primary transition-colors">Challenges</Link>
          <Link to="/leaderboard" className="hover:text-brand-primary transition-colors">Community</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Button asChild variant="outline" className="hidden md:inline-flex border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white">
            <Link to="/login">Log In</Link>
          </Button>
          <Button asChild className="bg-brand-secondary hover:bg-brand-secondary/90 text-black">
            <Link to="/">Get Started</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto py-16 md:py-24 px-4 md:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col space-y-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-brand-primary/20 text-brand-primary text-sm font-medium">
              <Award className="mr-2" size={18} /> Join over 10,000 fitness enthusiasts
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              TRANSFORM YOUR <span className="text-brand-primary">BODY</span>, ELEVATE YOUR <span className="text-brand-secondary">LIFE</span>
            </h1>
            <p className="text-lg text-gray-300">
              Connect with a community of fitness enthusiasts, log your activities, participate in challenges, and climb the leaderboard.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
              <Button asChild size="lg" className="bg-brand-secondary hover:bg-brand-secondary/90 text-black font-bold">
                <Link to="/">Get Started Now <ArrowRight className="ml-2" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white hover:bg-white/10">
                <Link to="/workouts">Explore Workouts</Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
              <Stat number="5K+" label="Active Users" />
              <Stat number="200+" label="Workouts" />
              <Stat number="50+" label="Challenges" />
              <Stat number="24/7" label="Community" />
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-4 bg-brand-primary/20 rounded-full blur-xl"></div>
              <img 
                src="/lovable-uploads/65311c2c-4069-4d88-9452-1074d0756f3e.png" 
                alt="Fitness Character" 
                className="relative z-10 max-h-[500px] object-contain"
              />
              <div className="absolute top-0 right-0 z-20 bg-black/70 backdrop-blur-sm rounded-full py-2 px-4 flex items-center">
                <Heart className="text-red-500 mr-2" /> 95% Success Rate
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="bg-gray-900/70 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-0">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose <span className="text-brand-secondary">FitCommunity</span></h2>
            <p className="text-gray-300 max-w-2xl mx-auto">Join our platform to transform your fitness journey with community support and personalized challenges.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Dumbbell className="text-brand-secondary" size={32} />}
              title="Personalized Workouts"
              description="Access hundreds of personalized workout plans tailored to your fitness level and goals."
            />
            <FeatureCard 
              icon={<Award className="text-brand-secondary" size={32} />}
              title="Exciting Challenges"
              description="Join weekly and monthly challenges to stay motivated and earn rewards."
            />
            <FeatureCard 
              icon={<Users className="text-brand-secondary" size={32} />}
              title="Supportive Community"
              description="Connect with like-minded fitness enthusiasts who will support your journey."
            />
          </div>
          
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary/90">
              <Link to="/">Join Our Community Today <ArrowRight className="ml-2" /></Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="container mx-auto py-16 md:py-24 px-4 md:px-0">
        <div className="bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 rounded-3xl p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Your Fitness Journey Today</h2>
              <p className="text-gray-300 mb-6">Join thousands of users already transforming their lives through our supportive community platform.</p>
              <Button asChild size="lg" className="bg-brand-secondary hover:bg-brand-secondary/90 text-black font-bold">
                <Link to="/">Get Started For Free <ArrowRight className="ml-2" /></Link>
              </Button>
            </div>
            <div className="flex justify-center lg:justify-end space-x-8">
              <div className="flex flex-col items-center">
                <div className="h-24 w-24 rounded-full bg-brand-primary/20 flex items-center justify-center mb-2">
                  <Activity size={40} className="text-brand-primary" />
                </div>
                <span className="text-xl font-bold">Track</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-24 w-24 rounded-full bg-brand-primary/20 flex items-center justify-center mb-2">
                  <Users size={40} className="text-brand-primary" />
                </div>
                <span className="text-xl font-bold">Connect</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-24 w-24 rounded-full bg-brand-primary/20 flex items-center justify-center mb-2">
                  <Award size={40} className="text-brand-primary" />
                </div>
                <span className="text-xl font-bold">Achieve</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="container mx-auto px-4 md:px-0">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Activity size={24} className="text-brand-secondary" />
                <h2 className="text-xl font-bold">
                  <span className="text-brand-primary">Fit</span>
                  <span className="text-brand-secondary">Community</span>
                </h2>
              </div>
              <p className="text-gray-400">
                Your community-based fitness platform for tracking workouts, joining challenges, and connecting with fitness enthusiasts.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <div className="flex flex-col space-y-2">
                <Link to="/" className="text-gray-400 hover:text-brand-primary transition-colors">Home</Link>
                <Link to="/workouts" className="text-gray-400 hover:text-brand-primary transition-colors">Workouts</Link>
                <Link to="/challenges" className="text-gray-400 hover:text-brand-primary transition-colors">Challenges</Link>
                <Link to="/leaderboard" className="text-gray-400 hover:text-brand-primary transition-colors">Leaderboard</Link>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Community</h3>
              <div className="flex flex-col space-y-2">
                <Link to="/social" className="text-gray-400 hover:text-brand-primary transition-colors">Social Feed</Link>
                <Link to="/tips" className="text-gray-400 hover:text-brand-primary transition-colors">Tips & Tricks</Link>
                <a href="#" className="text-gray-400 hover:text-brand-primary transition-colors">FAQ</a>
                <a href="#" className="text-gray-400 hover:text-brand-primary transition-colors">Support</a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Subscribe</h3>
              <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest updates.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-gray-800 text-white px-4 py-2 rounded-l-lg focus:outline-none flex-grow"
                />
                <Button className="rounded-l-none bg-brand-secondary hover:bg-brand-secondary/90 text-black">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© {new Date().getFullYear()} FitCommunity. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-brand-primary transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-brand-primary transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-brand-primary transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const Stat = ({ number, label }: { number: string; label: string }) => (
  <div className="text-center p-3 bg-gray-800/50 rounded-xl backdrop-blur-sm">
    <div className="text-2xl md:text-3xl font-bold text-brand-secondary">{number}</div>
    <div className="text-sm text-gray-300">{label}</div>
  </div>
);

const FeatureCard = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string 
}) => (
  <Card className="bg-gray-800/50 border-gray-700 overflow-hidden">
    <CardContent className="p-6">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </CardContent>
  </Card>
);

export default LandingPage;
