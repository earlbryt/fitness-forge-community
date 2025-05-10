import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Award, Users, ArrowRight, Dumbbell, Heart, CheckCircle, Bell, MessageSquare, BarChart2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/lib/auth';

const LandingPage = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-gray-100 text-gray-900">
      {/* Navigation */}
      <header className="container mx-auto py-6 px-4 md:px-6 lg:px-12 xl:px-24 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Activity size={28} className="text-brand-secondary" />
          <h1 className="text-2xl font-bold">
            <span className="text-brand-primary">Fit</span>
            <span className="text-brand-secondary">Community</span>
          </h1>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-800 hover:text-brand-primary transition-colors">Home</Link>
          <Link to="/app/workouts" className="text-gray-800 hover:text-brand-primary transition-colors">Workouts</Link>
          <Link to="/app/challenges" className="text-gray-800 hover:text-brand-primary transition-colors">Challenges</Link>
          <Link to="/app/leaderboard" className="text-gray-800 hover:text-brand-primary transition-colors">Community</Link>
        </nav>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <div className="hidden md:block text-sm text-gray-600">
                {user.email}
              </div>
              <Button asChild className="bg-brand-primary hover:bg-brand-primary/90 text-white">
                <Link to="/app">Dashboard</Link>
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                className="hidden md:flex border-gray-300"
                onClick={handleSignOut}
              >
                <LogOut size={18} />
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="outline" className="hidden md:inline-flex border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white">
                <Link to="/login">Log In</Link>
              </Button>
              <Button asChild className="bg-brand-primary hover:bg-brand-primary/90 text-white">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto py-16 md:py-24 px-4 md:px-6 lg:px-12 xl:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col space-y-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-brand-primary/20 text-brand-primary text-sm font-medium">
              <Users className="mr-2" size={18} /> Join our weekly workout community
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              STAY <span className="text-brand-primary">MOTIVATED</span>, BUILD YOUR <span className="text-brand-secondary">COMMUNITY</span>
            </h1>
            <p className="text-lg text-gray-600">
              Connect with your weekly workout group, verify your progress, and stay accountable between meetups. Track workouts, join challenges, and climb the leaderboard together.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
              {user ? (
                <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-white font-bold">
                  <Link to="/app">Go to Dashboard <ArrowRight className="ml-2" /></Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-white font-bold">
                    <Link to="/signup">Join Your Workout Group <ArrowRight className="ml-2" /></Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-brand-primary text-brand-primary hover:bg-brand-primary/10">
                    <Link to="/login">Log In</Link>
                  </Button>
                </>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4 pt-8">
              <Stat number="80%" label="Higher Consistency" />
              <Stat number="3x" label="Weekly Motivation" />
              <Stat number="95%" label="Community Support" />
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-4 bg-brand-primary/20 rounded-full blur-xl"></div>
              <img 
                src="/img/workout-removebg-preview.png" 
                alt="Fitness workout" 
                className="relative z-10 max-h-[500px] object-contain"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="bg-white py-16 md:py-24 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 lg:px-12 xl:px-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose <span className="text-brand-secondary">FitCommunity</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Keep the momentum going between your weekly group workouts with our community-driven platform.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<CheckCircle className="text-brand-secondary" size={32} />}
              title="Verified Workouts"
              description="Log workouts with photo/video verification so your group knows you're staying consistent. No more doubts about progress."
            />
            <FeatureCard 
              icon={<Award className="text-brand-secondary" size={32} />}
              title="Group Challenges"
              description="Create one-on-one or group challenges with your workout buddies to maintain motivation throughout the week."
            />
            <FeatureCard 
              icon={<Bell className="text-brand-secondary" size={32} />}
              title="Workout Reminders"
              description="Set custom reminders to keep your workout schedule on track between group sessions."
            />
            <FeatureCard 
              icon={<MessageSquare className="text-brand-secondary" size={32} />}
              title="Share Tips & Tricks"
              description="Exchange fitness advice, nutrition tips, and motivation with your community in a dedicated space."
            />
            <FeatureCard 
              icon={<BarChart2 className="text-brand-secondary" size={32} />}
              title="Leaderboards"
              description="Climb challenge-specific and global leaderboards to fuel friendly competition within your group."
            />
            <FeatureCard 
              icon={<Users className="text-brand-secondary" size={32} />}
              title="Supportive Community"
              description="Build accountability and support through a close-knit community of friends who meet weekly for workouts."
            />
          </div>
          
          <div className="mt-12 text-center">
            {user ? (
              <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary/90">
                <Link to="/app">Go to Dashboard <ArrowRight className="ml-2" /></Link>
              </Button>
            ) : (
              <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary/90">
                <Link to="/signup">Join Your Workout Group Today <ArrowRight className="ml-2" /></Link>
              </Button>
            )}
          </div>
        </div>
      </section>
      
      {/* Testimonial Section with Standing Image */}
      <section className="container mx-auto py-16 md:py-24 px-4 md:px-6 lg:px-12 xl:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center lg:justify-start order-2 lg:order-1">
            <div className="relative">
              <div className="absolute -inset-4 bg-brand-secondary/20 rounded-full blur-xl"></div>
              <img 
                src="/img/Adobe Express - file (1).png" 
                alt="Fitness pose" 
                className="relative z-10 max-h-[550px] object-contain rounded-xl"
              />
            </div>
          </div>
          <div className="flex flex-col space-y-6 order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-bold">
              Stay <span className="text-brand-secondary">Accountable</span> Between Meetups
            </h2>
            <p className="text-lg text-gray-600">
              "Our weekly outdoor workout group was amazing, but we struggled to stay consistent during the week. FitCommunity changed that by keeping us connected, motivated, and accountable between our face-to-face sessions."
            </p>
            <div className="flex items-center pt-4">
              <div className="h-12 w-12 rounded-full bg-brand-primary/20 flex items-center justify-center mr-4">
                <Users size={24} className="text-brand-primary" />
              </div>
              <div>
                <div className="font-bold">Sarah Johnson</div>
                <div className="text-sm text-gray-500">Group Workout Leader</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-8">
              <Stat number="5x" label="Weekly Workouts" />
              <Stat number="86%" label="Group Consistency" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="container mx-auto py-16 md:py-24 px-4 md:px-6 lg:px-12 xl:px-24">
        <div className="bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-3xl p-8 md:p-12 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Keep Your Group Motivated All Week</h2>
              <p className="text-gray-600 mb-6">Join your workout buddies on our platform to maintain the energy between weekly meetups and achieve your fitness goals together.</p>
              {user ? (
                <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-white font-bold">
                  <Link to="/app">Go to Dashboard <ArrowRight className="ml-2" /></Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-white font-bold">
                  <Link to="/signup">Get Started For Free <ArrowRight className="ml-2" /></Link>
                </Button>
              )}
            </div>
            <div className="flex justify-center lg:justify-end space-x-8">
              <div className="flex flex-col items-center">
                <div className="h-24 w-24 rounded-full bg-brand-primary/20 flex items-center justify-center mb-2">
                  <CheckCircle size={40} className="text-brand-primary" />
                </div>
                <span className="text-xl font-bold">Verify</span>
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
                <span className="text-xl font-bold">Compete</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-100 py-12 border-t border-gray-200">
        <div className="container mx-auto px-4 md:px-6 lg:px-12 xl:px-24">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Activity size={24} className="text-brand-secondary" />
                <h2 className="text-xl font-bold">
                  <span className="text-brand-primary">Fit</span>
                  <span className="text-brand-secondary">Community</span>
                </h2>
              </div>
              <p className="text-gray-600">
                Keeping your workout group motivated and accountable between weekly meetups with verified workouts, challenges, and community support.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <div className="flex flex-col space-y-2">
                <Link to="/" className="text-gray-600 hover:text-brand-primary transition-colors">Home</Link>
                <Link to="/app/workouts" className="text-gray-600 hover:text-brand-primary transition-colors">Log Workout</Link>
                <Link to="/app/challenges" className="text-gray-600 hover:text-brand-primary transition-colors">Challenges</Link>
                <Link to="/app/leaderboard" className="text-gray-600 hover:text-brand-primary transition-colors">Leaderboard</Link>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Community</h3>
              <div className="flex flex-col space-y-2">
                <Link to="/app/social" className="text-gray-600 hover:text-brand-primary transition-colors">Community</Link>
                <Link to="/app/tips" className="text-gray-600 hover:text-brand-primary transition-colors">Tips & Tricks</Link>
                <Link to="/app/reminders" className="text-gray-600 hover:text-brand-primary transition-colors">Reminders</Link>
                <a href="#" className="text-gray-600 hover:text-brand-primary transition-colors">Support</a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Subscribe</h3>
              <p className="text-gray-600 mb-4">Get weekly workout tips and motivation.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-brand-primary flex-grow"
                />
                <Button className="rounded-l-none bg-brand-primary hover:bg-brand-primary/90 text-white">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
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

const Stat = ({ number, label }: { number: string; label: string }) => (
  <div className="text-center p-3 bg-gray-100 border border-gray-200 rounded-xl shadow-sm">
    <div className="text-2xl md:text-3xl font-bold text-brand-secondary">{number}</div>
    <div className="text-sm text-gray-600">{label}</div>
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
  <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
    <CardContent className="p-6">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </CardContent>
  </Card>
);

export default LandingPage;
