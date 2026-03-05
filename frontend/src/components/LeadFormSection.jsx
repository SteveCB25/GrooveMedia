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
  "Roofing",
  "Landscaping",
  "Painting",
  "HVAC",
  "Plumbing",
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
      toast.success("Form submitted successfully! We'll be in touch soon.");
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
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
            <h2 className="heading-lg text-navy mb-4">
              Thanks! We Got Your Info.
            </h2>
            <p className="text-neutral-800/70 font-body text-lg mb-6">
              We'll review your business and get back to you within 15 minutes
              during business hours. Keep an eye on your phone!
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
        <div className="max-w-2xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-10">
            <p className="text-orange font-heading font-bold uppercase tracking-wider mb-3">
              Get Started
            </p>
            <h2 className="heading-lg text-navy mb-4">
              Get a Free 10-Minute Audit
            </h2>
            <p className="text-neutral-800/70 font-body text-lg">
              Tell us about your business and we'll show you exactly how to
              capture more leads.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="card-base p-6 md:p-10 relative z-10"
            data-testid="lead-form"
          >
            {/* Live Status Badge */}
            <div
              className="flex items-center gap-3 bg-success/10 border border-success/20 rounded-sm px-4 py-3 mb-8"
              data-testid="form-live-status"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
              </span>
              <span className="text-success font-body font-medium text-sm">
                Automation Active: Instant Text-Back Enabled
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <Label htmlFor="name" className="label-base">
                  Your Name *
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
                  Business Name *
                </Label>
                <Input
                  id="business_name"
                  name="business_name"
                  type="text"
                  required
                  value={formData.business_name}
                  onChange={handleChange}
                  className="input-base"
                  placeholder="Smith Roofing LLC"
                  data-testid="input-business-name"
                />
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone" className="label-base">
                  Phone Number *
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
                  Email Address *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-base"
                  placeholder="john@smithroofing.com"
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
                  placeholder="https://smithroofing.com"
                  data-testid="input-website"
                />
              </div>

              {/* Service Type */}
              <div className="relative z-20">
                <Label htmlFor="service_type" className="label-base">
                  Service Type *
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
                      <SelectItem key={service} value={service} data-testid={`service-option-${service.toLowerCase()}`}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 relative z-10">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full text-lg flex items-center justify-center gap-2 relative z-10"
                data-testid="submit-btn"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Get My Free Audit
                  </>
                )}
              </Button>
            </div>

            {/* Response Time Badge */}
            <div className="flex justify-center mt-6">
              <div className="inline-flex items-center gap-2 text-neutral-800/60 font-body text-sm">
                <Clock className="w-4 h-4" />
                <span>Response within 15 minutes</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
