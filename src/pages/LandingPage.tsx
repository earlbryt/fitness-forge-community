
import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Award, Users, ArrowRight, Dumbbell, Heart, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-gray-50 text-gray-800">
      {/* Navigation */}
      <header className="container mx-auto py-6 px-4 md:px-0 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Activity size={28} className="text-brand-primary" />
          <h1 className="text-2xl font-bold">
            <span className="text-brand-primary">Fit</span>
            <span className="text-yellow-500">Community</span>
          </h1>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="hover:text-brand-primary transition-colors">Home</Link>
          <Link to="/app/workouts" className="hover:text-brand-primary transition-colors">Workouts</Link>
          <Link to="/app/challenges" className="hover:text-brand-primary transition-colors">Challenges</Link>
          <Link to="/app/leaderboard" className="hover:text-brand-primary transition-colors">Community</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Button asChild variant="outline" className="hidden md:inline-flex border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white">
            <Link to="/login">Log In</Link>
          </Button>
          <Button asChild className="bg-brand-primary hover:bg-brand-primary/90 text-white">
            <Link to="/app">Get Started</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto py-16 md:py-24 px-4 md:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col space-y-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-brand-primary/20 text-brand-primary text-sm font-medium">
              <Users className="mr-2" size={18} /> Join our fitness community today
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              TRANSFORM YOUR <span className="text-brand-primary">FITNESS</span>, BUILD YOUR <span className="text-yellow-500">COMMUNITY</span>
            </h1>
            <p className="text-lg text-gray-700">
              Connect with fellow fitness enthusiasts, track your workouts, participate in challenges, and climb the leaderboard. Stay motivated with verified workouts and friendly competition.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
              <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-white font-bold">
                <Link to="/app">Join Our Community <ArrowRight className="ml-2" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-brand-primary text-brand-primary hover:bg-brand-primary/10">
                <Link to="/app/workouts">Explore Workouts</Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-brand-primary/30 to-yellow-500/30 rounded-2xl blur-xl"></div>
              <div className="absolute -inset-1 bg-white rounded-2xl shadow-lg"></div>
              <img 
                src="/lovable-uploads/65311c2c-4069-4d88-9452-1074d0756f3e.png" 
                alt="Fitness Character" 
                className="relative z-10 max-h-[500px] object-contain p-4"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="bg-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gray-50 to-transparent"></div>
        <div className="container mx-auto px-4 md:px-0">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose <span className="text-yellow-500">FitCommunity</span></h2>
            <p className="text-gray-700 max-w-2xl mx-auto">Join our platform to transform your fitness journey with community support and verified workouts.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<CheckCircle className="text-brand-primary" size={32} />}
              title="Verified Workouts"
              description="Log your workouts and verify them with photos or videos. No more doubts about each other's progress."
            />
            <FeatureCard 
              icon={<Award className="text-yellow-500" size={32} />}
              title="Exciting Challenges"
              description="Create and join one-on-one or group challenges to stay motivated and compete with friends."
            />
            <FeatureCard 
              icon={<Users className="text-brand-primary" size={32} />}
              title="Supportive Community"
              description="Connect with like-minded fitness enthusiasts who will support your journey and keep you accountable."
            />
          </div>
          
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-white">
              <Link to="/app">Join Our Community Today <ArrowRight className="ml-2" /></Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Second Character Image Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500/30 to-brand-primary/30 rounded-2xl blur-xl"></div>
                <div className="absolute -inset-1 bg-white rounded-2xl shadow-lg"></div>
                <img 
                  src="/lovable-uploads/591a081d-225b-4696-9729-4550d70fdd61.png" 
                  alt="Fitness Workout" 
                  className="relative z-10 max-h-[500px] object-contain p-4"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2 flex flex-col space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Log Workouts &amp; <span className="text-brand-primary">Track</span> Your Progress
              </h2>
              <p className="text-lg text-gray-700">
                With our workout verification system, you can log your exercises and prove your consistency. Upload photos or videos of your workout to earn the "Verified" badge and build trust with your fitness community.
              </p>
              <ul className="space-y-3">
                <FeatureListItem text="Log different workout types, duration, and intensity" />
                <FeatureListItem text="Upload photo or video proof of your workout" />
                <FeatureListItem text="Earn verification badges for completed workouts" />
                <FeatureListItem text="Keep track of your progress over time" />
              </ul>
              <div className="pt-4">
                <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-white">
                  <Link to="/app/workouts">Start Logging Workouts <ArrowRight className="ml-2" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="container mx-auto py-16 md:py-24 px-4 md:px-0">
        <div className="bg-gradient-to-r from-brand-primary/10 to-yellow-500/10 rounded-3xl p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Your Fitness Journey Today</h2>
              <p className="text-gray-700 mb-6">Join thousands of users already transforming their lives through our supportive community platform.</p>
              <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-white font-bold">
                <Link to="/app">Get Started For Free <ArrowRight className="ml-2" /></Link>
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
                <div className="h-24 w-24 rounded-full bg-yellow-500/20 flex items-center justify-center mb-2">
                  <Users size={40} className="text-yellow-500" />
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
      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-0">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Activity size={24} className="text-brand-primary" />
                <h2 className="text-xl font-bold">
                  <span className="text-brand-primary">Fit</span>
                  <span className="text-yellow-500">Community</span>
                </h2>
              </div>
              <p className="text-gray-600">
                Your community-based fitness platform for tracking workouts, joining challenges, and connecting with fitness enthusiasts.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <div className="flex flex-col space-y-2">
                <Link to="/" className="text-gray-600 hover:text-brand-primary transition-colors">Home</Link>
                <Link to="/app/workouts" className="text-gray-600 hover:text-brand-primary transition-colors">Workouts</Link>
                <Link to="/app/challenges" className="text-gray-600 hover:text-brand-primary transition-colors">Challenges</Link>
                <Link to="/app/leaderboard" className="text-gray-600 hover:text-brand-primary transition-colors">Leaderboard</Link>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Community</h3>
              <div className="flex flex-col space-y-2">
                <Link to="/app/social" className="text-gray-600 hover:text-brand-primary transition-colors">Social Feed</Link>
                <Link to="/app/tips" className="text-gray-600 hover:text-brand-primary transition-colors">Tips & Tricks</Link>
                <a href="#" className="text-gray-600 hover:text-brand-primary transition-colors">FAQ</a>
                <a href="#" className="text-gray-600 hover:text-brand-primary transition-colors">Support</a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Subscribe</h3>
              <p className="text-gray-600 mb-4">Subscribe to our newsletter for the latest updates.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-gray-100 text-gray-800 px-4 py-2 rounded-l-lg focus:outline-none flex-grow"
                />
                <Button className="rounded-l-none bg-brand-primary hover:bg-brand-primary/90 text-white">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600">© {new Date().getFullYear()} FitCommunity. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-600 hover:text-brand-primary transition-colors">Terms</a>
              <a href="#" className="text-gray-600 hover:text-brand-primary transition-colors">Privacy</a>
              <a href="#" className="text-gray-600 hover:text-brand-primary transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureListItem = ({ text }: { text: string }) => (
  <li className="flex items-center">
    <CheckCircle className="mr-3 text-brand-primary" size={20} />
    <span className="text-gray-700">{text}</span>
  </li>
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
  <Card className="bg-white border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
    <CardContent className="p-6">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </CardContent>
  </Card>
);

export default LandingPage;
