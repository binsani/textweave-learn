import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Users, 
  Trophy, 
  HelpCircle, 
  Lightbulb, 
  Code, 
  Briefcase, 
  Heart,
  ArrowRight,
  ExternalLink,
  Calendar,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const forumCategories = [
  {
    icon: HelpCircle,
    title: 'Q&A',
    description: 'Get help with your coursework and learning challenges',
    topics: 1234,
    posts: 8567,
  },
  {
    icon: Lightbulb,
    title: 'Study Tips',
    description: 'Share and discover effective learning strategies',
    topics: 456,
    posts: 2341,
  },
  {
    icon: Code,
    title: 'Technical Help',
    description: 'Programming questions and coding challenges',
    topics: 789,
    posts: 4521,
  },
  {
    icon: Briefcase,
    title: 'Career Discussion',
    description: 'Job hunting, interviews, and career growth',
    topics: 321,
    posts: 1876,
  },
  {
    icon: Trophy,
    title: 'Showcase',
    description: 'Share your projects and achievements',
    topics: 234,
    posts: 987,
  },
  {
    icon: Heart,
    title: 'Off-Topic',
    description: 'Connect with fellow learners on any topic',
    topics: 567,
    posts: 3214,
  },
];

const topContributors = [
  { name: 'Alex Kim', avatar: '', points: 12450, badge: 'Expert' },
  { name: 'Sarah Chen', avatar: '', points: 10230, badge: 'Mentor' },
  { name: 'Michael Park', avatar: '', points: 8760, badge: 'Helper' },
  { name: 'Emma Wilson', avatar: '', points: 7540, badge: 'Rising Star' },
  { name: 'David Lee', avatar: '', points: 6320, badge: 'Contributor' },
];

const upcomingEvents = [
  {
    title: 'Web Development Workshop',
    date: '2025-02-15',
    time: '2:00 PM EST',
    type: 'Workshop',
    attendees: 234,
  },
  {
    title: 'Career AMA with Tech Leaders',
    date: '2025-02-20',
    time: '6:00 PM EST',
    type: 'AMA',
    attendees: 567,
  },
  {
    title: 'Study Group: Data Science',
    date: '2025-02-22',
    time: '10:00 AM EST',
    type: 'Study Group',
    attendees: 45,
  },
];

const recentDiscussions = [
  {
    title: 'Best resources for learning React in 2025?',
    author: 'newbie_coder',
    replies: 23,
    views: 456,
    category: 'Q&A',
    hot: true,
  },
  {
    title: 'Just landed my first developer job!',
    author: 'success_story',
    replies: 89,
    views: 1234,
    category: 'Showcase',
    hot: true,
  },
  {
    title: 'How do you stay motivated while learning?',
    author: 'curious_learner',
    replies: 45,
    views: 678,
    category: 'Study Tips',
    hot: false,
  },
  {
    title: 'Python vs JavaScript for beginners?',
    author: 'undecided_dev',
    replies: 67,
    views: 890,
    category: 'Technical Help',
    hot: true,
  },
];

export default function Community() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4">Join 50,000+ learners</Badge>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            MasashiLearn Community
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with fellow learners, share your knowledge, ask questions, and grow together in our supportive community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              <MessageSquare className="mr-2 h-5 w-5" />
              Join the Discussion
            </Button>
            <Button variant="outline" size="lg">
              <Users className="mr-2 h-5 w-5" />
              Find Study Groups
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-foreground">50K+</p>
              <p className="text-sm text-muted-foreground">Members</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">3.5K+</p>
              <p className="text-sm text-muted-foreground">Active Topics</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">21K+</p>
              <p className="text-sm text-muted-foreground">Posts This Month</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">95%</p>
              <p className="text-sm text-muted-foreground">Questions Answered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Forum Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-8">Discussion Forums</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forumCategories.map((category) => (
              <Card key={category.title} className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <category.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {category.title}
                      </CardTitle>
                      <CardDescription className="mt-1">{category.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{category.topics.toLocaleString()} topics</span>
                    <span>•</span>
                    <span>{category.posts.toLocaleString()} posts</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent & Contributors */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Discussions */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl font-bold text-foreground">Recent Discussions</h2>
                <Button variant="ghost" size="sm">
                  View all <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                {recentDiscussions.map((discussion, index) => (
                  <Card key={index} className="hover:shadow-sm transition-shadow cursor-pointer">
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {discussion.hot && (
                              <Badge variant="destructive" className="text-xs">Hot</Badge>
                            )}
                            <Badge variant="outline" className="text-xs">{discussion.category}</Badge>
                          </div>
                          <h3 className="font-medium text-foreground hover:text-primary transition-colors">
                            {discussion.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            by {discussion.author} • {discussion.replies} replies • {discussion.views} views
                          </p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Top Contributors */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Top Contributors</h2>
              <Card>
                <CardContent className="py-4">
                  <div className="space-y-4">
                    {topContributors.map((contributor, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-lg font-bold text-muted-foreground w-6">
                          {index + 1}
                        </span>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={contributor.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {contributor.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{contributor.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {contributor.points.toLocaleString()} points
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {contributor.badge}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl font-bold text-foreground">Upcoming Events</h2>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              View Calendar
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {upcomingEvents.map((event, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <Badge variant="outline" className="w-fit">{event.type}</Badge>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {event.time} • Online
                    </p>
                    <p className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {event.attendees} attending
                    </p>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    RSVP
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
            Ready to Join the Conversation?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Create your free account and become part of our growing community of learners.
          </p>
          <Button asChild size="lg">
            <Link to="/signup">Get Started Free</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
