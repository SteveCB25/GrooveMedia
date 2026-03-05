import { useState } from "react";
import { Send, CheckCircle, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const services = [
  "Deck Building",
  "Fence Installation",
  "Landscaping",
  "Tree Removal",
  "Painting",
  "Roofing",
  "Other",
];

export default function LeadFormSection() {
  const [formData, setFormData] = useState({
    name: "",
    business_name: "",
    phone: "",
    email: "",
    website: "",
    service_type: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (value) => {
    setFormData((prev) => ({ ...prev, service_type: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(`${API}/leads`, formData);
      setIsSubmitted(true);
      toast.success("Got it! We'll be in touch within 15 minutes.");
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section
        id="lead-form"
        data-testid="lead-form-section"
        className="section-spacing bg-white"
      >
        <div className="container-custom">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
            <h2 className="heading-lg text-navy mb-4">
              Got it. We'll be in touch.
            </h2>
            <p className="text-neutral-800/70 font-body text-lg mb-6">
              Expect a call or text within 15 minutes during business hours.
            </p>
            <div className="inline-flex items-center gap-2 text-success font-body font-medium">
              <Clock className="w-5 h-5" />
              <span>Response within 15 minutes</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="lead-form"
      data-testid="lead-form-section"
      className="section-spacing bg-white"
    >
      <div className="container-custom">
        <div className="max-w-xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8">
            <p className="text-orange font-heading font-bold uppercase tracking-wider mb-3">
              Get Started
            </p>
            <h2 className="heading-lg text-navy mb-4">
              Request My Free Website Check
            </h2>
            <p className="text-neutral-800/70 font-body">
              We'll review your current setup and show you what you're missing.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-neutral-offWhite border border-gray-200 rounded-sm p-6 md:p-8 relative z-10"
            data-testid="lead-form"
          >
            <div className="space-y-5">
              {/* Name */}
              <div>
                <Label htmlFor="name" className="label-base">
                  Your Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input-base"
                  placeholder="John Smith"
                  data-testid="input-name"
                />
              </div>

              {/* Business Name */}
              <div>
                <Label htmlFor="business_name" className="label-base">
                  Business Name
                </Label>
                <Input
                  id="business_name"
                  name="business_name"
                  type="text"
                  required
                  value={formData.business_name}
                  onChange={handleChange}
                  className="input-base"
                  placeholder="Smith Decks & Fencing"
                  data-testid="input-business-name"
                />
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone" className="label-base">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-base"
                  placeholder="(301) 555-0123"
                  data-testid="input-phone"
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="label-base">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-base"
                  placeholder="john@smithdecks.com"
                  data-testid="input-email"
                />
              </div>

              {/* Website */}
              <div>
                <Label htmlFor="website" className="label-base">
                  Current Website (if any)
                </Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  className="input-base"
                  placeholder="https://smithdecks.com"
                  data-testid="input-website"
                />
              </div>

              {/* Service Type */}
              <div className="relative z-20">
                <Label htmlFor="service_type" className="label-base">
                  What do you do?
                </Label>
                <Select
                  value={formData.service_type}
                  onValueChange={handleServiceChange}
                >
                  <SelectTrigger
                    id="service_type"
                    className="input-base relative z-20"
                    data-testid="select-service-type"
                  >
                    <SelectValue placeholder="Select your trade" />
                  </SelectTrigger>
                  <SelectContent className="z-[100]">
                    {services.map((service) => (
                      <SelectItem key={service} value={service} data-testid={`service-option-${service.toLowerCase().replace(/\s+/g, '-')}`}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Submit Button - Large and Tappable */}
            <div className="mt-8 relative z-10">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full text-lg flex items-center justify-center gap-2 min-h-[56px] relative z-10"
                data-testid="submit-btn"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Get My Free Website Check
                  </>
                )}
              </Button>
            </div>

            {/* Response Time Note */}
            <p className="text-center text-neutral-800/60 font-body text-sm mt-4">
              Response within 15 minutes during business hours.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
