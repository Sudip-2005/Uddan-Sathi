import {
  Phone,
  Mail,
  Clock,
  Building2,
  CreditCard,
  Hotel,
  Car,
  Headphones,
  MessageSquare,
  ExternalLink,
  Shield,
  Users,
  Plane,
  MapPin,
  AlertCircle,
  CheckCircle,
  Zap,
  Heart,
  Star,
  ArrowRight,
  MessageCircle,
  Calendar,
  Ticket,
  Globe,
  Wifi,
  Coffee,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const AssistancePage = () => {
  const [activeTab, setActiveTab] = useState('support');

  const supportCategories = [
    {
      icon: Headphones,
      title: "24/7 Customer Support",
      description: "Round-the-clock assistance for all your travel needs",
      status: "Online",
      color: "from-green-500 to-emerald-600",
      bgColor: "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20"
    },
    {
      icon: MessageCircle,
      title: "Live Chat Support",
      description: "Instant chat with our support agents",
      status: "Available",
      color: "from-blue-500 to-indigo-600",
      bgColor: "from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Detailed assistance via email",
      status: "24h response",
      color: "from-purple-500 to-violet-600",
      bgColor: "from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our experts",
      status: "Priority line",
      color: "from-orange-500 to-red-600",
      bgColor: "from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20"
    }
  ];

  const assistanceServices = [
    {
      icon: CreditCard,
      title: "Refund Management",
      description: "Track and manage your refund requests",
      features: ["Real-time status updates", "Instant processing", "Direct bank transfer"],
      action: "Track Refund",
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: Plane,
      title: "Flight Rebooking",
      description: "Alternative flights at no extra cost",
      features: ["Same-day alternatives", "Flexible scheduling", "Priority boarding"],
      action: "Rebook Now",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Hotel,
      title: "Hotel Accommodation",
      description: "Complimentary stays for delays",
      features: ["5-star hotels", "Meal vouchers", "Airport transfers"],
      action: "Book Hotel",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Car,
      title: "Ground Transport",
      description: "Airport pickup and drop services",
      features: ["Premium vehicles", "GPS tracking", "Professional drivers"],
      action: "Book Transport",
      color: "from-amber-500 to-orange-600"
    }
  ];

  const faqCategories = [
    { title: "Booking & Cancellation", count: 12, icon: Ticket },
    { title: "Flight Information", count: 8, icon: Plane },
    { title: "Baggage & Fees", count: 15, icon: Zap },
    { title: "Check-in & Boarding", count: 6, icon: MapPin },
    { title: "Travel Documents", count: 9, icon: Shield },
    { title: "Special Assistance", count: 7, icon: Heart }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-background dark:to-primary/5">
      <div className="space-y-8 max-w-6xl mx-auto p-6 lg:p-8 pb-10">
        {/* Animated Page Header */}
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full text-primary font-medium text-sm animate-pulse">
            <Headphones className="h-4 w-4" />
            Customer Support Center
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            How Can We Help You?
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Our dedicated support team is here to ensure your journey is smooth and memorable.
            Get instant assistance for all your travel needs.
          </p>
        </div>

        {/* Support Status Banner */}
        <Card className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 dark:from-green-500/5 dark:via-emerald-500/5 dark:to-teal-500/5 border-green-200/50 dark:border-green-800/50 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75"></div>
                </div>
                <div>
                  <p className="font-semibold text-green-700 dark:text-green-400">All Support Channels Active</p>
                  <p className="text-sm text-green-600 dark:text-green-500">Average response time: 2 minutes</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-600" />
                  <span className="text-green-700 dark:text-green-400">247 agents online</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span className="text-green-700 dark:text-green-400">24/7 available</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          {supportCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card key={category.title} className={`group relative overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br ${category.bgColor} border-border/50 dark:border-border/30`}>
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <CardContent className="p-6 relative z-10">
                  <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${category.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-foreground">{category.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {category.status}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions Section */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Quick Assistance Services</h2>
            <p className="text-muted-foreground">Get immediate help with common travel issues</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {assistanceServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={service.title} className="group relative overflow-hidden hover:shadow-2xl dark:hover:shadow-black/50 transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-card to-card/80 dark:from-card/80 dark:to-card/30 backdrop-blur-sm border-border/50 dark:border-border/30">
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${service.color}`}></div>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${service.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-xl mb-2 text-foreground">{service.title}</h3>
                        <p className="text-muted-foreground mb-4 leading-relaxed">{service.description}</p>

                        <div className="space-y-2 mb-6">
                          {service.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span className="text-muted-foreground">{feature}</span>
                            </div>
                          ))}
                        </div>

                        <Button className={`w-full bg-gradient-to-r ${service.color} hover:opacity-90 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}>
                          {service.action}
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="bg-gradient-to-br from-card to-card/80 dark:from-card/80 dark:to-card/30 backdrop-blur-sm border-border/50 dark:border-border/30 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Frequently Asked Questions
            </CardTitle>
            <p className="text-muted-foreground">Find answers to common questions instantly</p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {faqCategories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <Button
                    key={category.title}
                    variant="outline"
                    className="h-auto p-6 flex-col gap-3 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] group"
                  >
                    <div className="p-3 rounded-xl bg-primary/10 dark:bg-primary/20 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors duration-300">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-foreground">{category.title}</p>
                      <p className="text-sm text-muted-foreground">{category.count} articles</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-900">
          <Card className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/50 dark:border-blue-800/50">
            <div className="p-4 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white w-fit mx-auto mb-4">
              <Globe className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-foreground">Global Network</h3>
            <p className="text-muted-foreground text-sm">Support in 50+ countries with local language assistance</p>
          </Card>

          <Card className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200/50 dark:border-green-800/50">
            <div className="p-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white w-fit mx-auto mb-4">
              <Wifi className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-foreground">Digital Support</h3>
            <p className="text-muted-foreground text-sm">Mobile app, web portal, and SMS notifications</p>
          </Card>

          <Card className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200/50 dark:border-purple-800/50">
            <div className="p-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white w-fit mx-auto mb-4">
              <Coffee className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-foreground">Personal Touch</h3>
            <p className="text-muted-foreground text-sm">Dedicated relationship managers for frequent travelers</p>
          </Card>
        </div>

        {/* Emergency Contact Footer */}
        <Card className="bg-gradient-to-r from-red-500/10 via-orange-500/10 to-red-500/10 dark:from-red-500/5 dark:via-orange-500/5 dark:to-red-500/5 border-red-200/50 dark:border-red-800/50 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 text-white">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-lg text-foreground">Emergency Support</p>
                  <p className="text-muted-foreground">For urgent situations and medical emergencies</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="destructive" className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Phone className="h-4 w-4 mr-2" />
                  Emergency Line
                </Button>
                <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/20">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Crisis Chat
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssistancePage;
