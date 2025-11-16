import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Facebook, Instagram, Mail, MapPin, Phone, Leaf } from "lucide-react";
import { AnimatedText } from "@/components/AnimatedText";
import { Separator } from "@/components/ui/separator";
const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center py-20 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-40 right-20 w-40 h-40 bg-accent rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-primary rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content - Left Side */}
            <div className="space-y-8 animate-fade-in">
              <h1 className="text-4xl md:text-7xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent leading-tight">
                Welcome to the Pizza Unlimited!
              </h1>
              <div className="text-2xl md:text-3xl text-muted-foreground min-h-[100px] font-light">
                <AnimatedText
                  phrases={[
                    "Unlimited Meals, Unbeatable Prices – Indulge in the Best of Italian & Chinese Cuisine!",
                    "Freshly Crafted Flavors That Make Every Bite Worth It.",
                    "Where Cravings Meet Authentic Taste and Quality.",
                    "Your Favorite Pizza, Pasta, Noodles & More — Served Hot and Delicious."
                  ]}                  
                />
              </div>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                >
                  Order Now
                </Button>
              </div>
            </div>

            {/* Image with Decorative Leaves - Right Side */}
            <div className="flex justify-center lg:justify-end animate-fade-in">
              <div className="relative w-[400px] h-[400px] md:w-[500px] md:h-[500px]">
                {/* Glowing Background */}
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>

                {/* Decorative Leaves */}
                <Leaf className="absolute -top-8 -left-8 w-16 h-16 text-primary rotate-45 animate-pulse opacity-70" />
                <Leaf className="absolute -top-4 right-12 w-12 h-12 text-primary/60 -rotate-12 animate-pulse opacity-60 delay-300" />
                <Leaf className="absolute top-20 -right-10 w-20 h-20 text-primary rotate-90 animate-pulse opacity-50 delay-500" />
                <Leaf className="absolute bottom-24 -left-12 w-14 h-14 text-primary/60 -rotate-45 animate-pulse opacity-65 delay-700" />
                <Leaf className="absolute -bottom-6 right-16 w-16 h-16 text-primary rotate-12 animate-pulse opacity-55 delay-1000" />
                <Leaf className="absolute bottom-12 -right-8 w-10 h-10 text-primary/60 rotate-180 animate-pulse opacity-60 delay-200" />

                {/* Main Image */}
                <img
                  src="pizzaleft.jpg"
                  alt="Delicious pizza showcasing our culinary expertise"
                  className="relative w-full h-full object-cover rounded-full shadow-2xl border-8 border-card ring-4 ring-primary/30 hover:ring-primary/50 transition-all duration-500 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* About Us Section */}
      <section className="py-24 bg-muted/30 relative">
        <div className="absolute inset-0 opacity-5">
          <Leaf className="absolute top-10 right-20 w-24 h-24 text-primary rotate-12 animate-pulse" />
          <Leaf className="absolute bottom-20 left-16 w-20 h-20 text-accent -rotate-45 animate-pulse delay-500" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent mb-6">
              About Us
            </h2>
            <div className="w-20 h-1 bg-[linear-gradient(to_right,rgba(148,95,95,1)_0%,rgba(207,0,0,1)_19%,rgba(196,77,37,1)_87%)] mx-auto mb-8 rounded-full" />
            <p className="text-lg text-muted-foreground leading-relaxed">
            Since 2013, The Pizza Unlimited has been serving the finest Italian and Chinese cuisine, offering an unlimited dining experience at unbeatable prices. As the No.1 Pizza Unlimited brand in Rajasthan, we have grown from a single outlet into a beloved national name, bringing joy to food lovers across the country. Whether you’re in the mood for a cheesy pizza, a hearty pasta, or bold and flavorful Chinese delights, we have something for everyone. Come indulge in a feast like no other!
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 bg-background relative">
        <div className="absolute inset-0 opacity-5">
          <Leaf className="absolute top-32 left-10 w-20 h-20 text-primary -rotate-12 animate-pulse" />
          <Leaf className="absolute top-40 right-24 w-16 h-16 text-accent rotate-45 animate-pulse delay-300" />
          <Leaf className="absolute bottom-32 right-10 w-24 h-24 text-primary rotate-90 animate-pulse delay-700" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent mb-4">
            Our Gallery
          </h2>
          <div className="w-20 h-1 bg-[linear-gradient(to_right,rgba(148,95,95,1)_0%,rgba(207,0,0,1)_19%,rgba(196,77,37,1)_87%)] mx-auto mb-16 rounded-full" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            ].map((image, index) => (
              <Card
                key={index}
                className="overflow-hidden group cursor-pointer border-none shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-gradient-to-br from-card to-card/80"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden aspect-square">
                    <img
                      src={image}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-secondary text-secondary-foreground py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <Leaf className="absolute top-10 left-20 w-32 h-32 text-primary rotate-12 animate-pulse" />
          <Leaf className="absolute bottom-10 right-20 w-28 h-28 text-accent -rotate-45 animate-pulse delay-500" />
          <Leaf className="absolute top-1/2 left-1/2 w-24 h-24 text-primary/50 rotate-90 animate-pulse delay-1000" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
            {/* Contact Info */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-primary">Contact Us</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-secondary-foreground/90">info@restaurant.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-secondary-foreground/90">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-secondary-foreground/90">
                      123 Restaurant Street<br />
                      Food City, FC 12345
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-primary">Hours</h3>
              <div className="space-y-2 text-secondary-foreground/90">
                <p><span className="font-semibold">Mon-Thu:</span> 11:00 AM - 10:00 PM</p>
                <p><span className="font-semibold">Fri-Sat:</span> 11:00 AM - 11:00 PM</p>
                <p><span className="font-semibold">Sunday:</span> 12:00 PM - 9:00 PM</p>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-primary">Follow & Order</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="w-12 h-12 rounded-full bg-accent hover:bg-accent/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-6 h-6 text-accent-foreground" />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 rounded-full bg-accent hover:bg-accent/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-6 h-6 text-accent-foreground" />
                  </a>
                </div>
                <div className="space-y-2 pt-2">
                  <p className="text-secondary-foreground text-sm font-semibold">Order Online:</p>
                  <div className="flex gap-3">
                    <a
                      href="https://www.zomato.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-accent hover:bg-accent/80 backdrop-blur-sm rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-sm font-semibold text-accent-foreground"
                    >
                      Zomato
                    </a>
                    <a
                      href="https://www.swiggy.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-accent hover:bg-accent/80 backdrop-blur-sm rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-sm font-semibold text-accent-foreground"
                    >
                      Swiggy
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-secondary-foreground/20 pt-8 text-center">
              <p className="text-secondary-foreground text-sm">
                Made with ❤️ by Bhavya Natani
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
