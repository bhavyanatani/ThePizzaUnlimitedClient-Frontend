"use client";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Star, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { reviewsApi } from "@/lib/api";

const Reviews = () => {
    const { getToken } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    rating: 5,
    comment: "",
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    
    setLoading(true);
    try {
      const data = await reviewsApi.list();
      if (data.success) {
        setReviews(data.reviews || []);
      } else {
        toast.error("Failed to load reviews");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Something went wrong while fetching reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.name || !formData.comment) {
      toast.error("Please fill in all fields before submitting.");
      return;
    }
  
    let token;
    try {
      token = await getToken();
    } catch (err) {
      console.error("Error fetching token:", err);
    }
  
    if (!token) {
      toast.error("Please sign in to submit a review.");
      return;
    }
  
    setSubmitting(true);
  
    try {
      console.log("Submitting review:", formData);
  
      const data = await reviewsApi.create(formData, token);
  
      if (data.success) {
        toast.success("Review submitted!", {
          description: "Thank you for sharing your experience with us.",
        });
        setFormData({ name: "", rating: 5, comment: "" });
        fetchReviews();
      } else {
        toast.error(data.comment || "Failed to submit review.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-background to-secondary/20"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4 animate-fade-in">
            What Our Guests Say
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground animate-fade-in">
            Real experiences from our cherished diners
          </p>
        </div>
      </section>

      <section className="py-12 px-4 max-w-4xl mx-auto">
        <Card className="p-8 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] transition-all duration-300 border-border/50 bg-card">
          <h2 className="text-3xl font-semibold text-foreground mb-6">
            Share Your Experience
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Your Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="border-border bg-background/50 focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() =>
                      setFormData({ ...formData, rating: star })
                    }
                    className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary rounded"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoveredRating || formData.rating)
                          ? "fill-accent stroke-accent"
                          : "fill-none stroke-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="comment"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Your Review
              </label>
              <Textarea
                id="comment"
                placeholder="Tell us about your experience..."
                value={formData.comment}
                onChange={(e) =>
                  setFormData({ ...formData, comment: e.target.value })
                }
                rows={5}
                className="border-border bg-background/50 focus:border-primary transition-colors resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 shadow-md hover:shadow-lg transition-all duration-300"
            >
              {submitting ? (
                "Submitting..."
              ) : (
                <>
                  Submit Review
                  <Send className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        </Card>
      </section>

      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-foreground text-center mb-12">
          Guest Reviews
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 animate-pulse bg-card">
                <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                <div className="h-3 bg-muted rounded w-full mb-2"></div>
                <div className="h-3 bg-muted rounded w-4/5"></div>
              </Card>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No reviews yet. Be the first to share your experience!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <Card
                key={review._id}
                className="p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card group animate-fade-in"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {review.name}
                  </h3>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? "fill-accent stroke-accent"
                            : "fill-none stroke-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  "{review.comment}"
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Reviews;
