import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiSend,
  FiChevronDown,
  FiChevronUp,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
} from "react-icons/fi";

function Contact() {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: "",
  });
  const [activeAccordion, setActiveAccordion] = useState(null);

  useEffect(
    () => {
      if (user && user.isAdmin) navigate("/admin");
    },
    [user, navigate]
  );

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Simulate form submission
    setFormStatus({
      submitted: true,
      success: true,
      message: "Thank you for your message! We'll get back to you soon.",
    });

    // Reset form after successful submission
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

    // In a real application, you would send the form data to your backend here
    console.log("Form submitted:", formData);
  };

  const toggleAccordion = index => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const faqs = [
    {
      question: "What are your shipping options?",
      answer:
        "We offer standard shipping (3-5 business days), express shipping (1-2 business days), and same-day delivery in select areas. Shipping costs are calculated at checkout based on your location and selected shipping method.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order ships, you'll receive a tracking number via email. You can use this number to track your package on our website or directly through the carrier's website.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We accept returns within 30 days of delivery. Items must be in original condition with tags attached. Please visit our Returns page for more information on how to initiate a return.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Yes, we ship to most countries worldwide. International shipping times and costs vary by location. Please note that customers are responsible for any customs fees or import taxes.",
    },
    {
      question: "How can I change or cancel my order?",
      answer:
        "You can modify or cancel your order within 1 hour of placing it by contacting our customer service team. After this window, we may not be able to make changes as orders are processed quickly.",
    },
  ];

  return (
    <div className="bg-base-200 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-primary-content py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
            We'd love to hear from you. Our team is always here to help with any
            questions or concerns.
          </p>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-base-content mb-8">
                Contact Information
              </h2>

              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <FiMapPin className="text-primary w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-base-content mb-1">
                      Our Location
                    </h3>
                    <p className="text-base-content/70">
                      123 Commerce Street<br />
                      Suite 500<br />
                      New York, NY 10001
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <FiPhone className="text-primary w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-base-content mb-1">
                      Phone Number
                    </h3>
                    <p className="text-base-content/70">
                      Customer Service: (800) 123-4567<br />
                      Support: (800) 765-4321
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <FiMail className="text-primary w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-base-content mb-1">
                      Email Address
                    </h3>
                    <p className="text-base-content/70">
                      Customer Service: support@luxecart.com<br />
                      Sales Inquiries: sales@luxecart.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <FiClock className="text-primary w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-base-content mb-1">
                      Business Hours
                    </h3>
                    <p className="text-base-content/70">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-12">
                <h3 className="font-semibold text-lg text-base-content mb-4">
                  Connect With Us
                </h3>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="bg-primary/10 p-3 rounded-full text-primary hover:bg-primary/20 transition-colors"
                  >
                    <FiFacebook className="w-6 h-6" />
                  </a>
                  <a
                    href="#"
                    className="bg-primary/10 p-3 rounded-full text-primary hover:bg-primary/20 transition-colors"
                  >
                    <FiTwitter className="w-6 h-6" />
                  </a>
                  <a
                    href="#"
                    className="bg-primary/10 p-3 rounded-full text-primary hover:bg-primary/20 transition-colors"
                  >
                    <FiInstagram className="w-6 h-6" />
                  </a>
                  <a
                    href="#"
                    className="bg-primary/10 p-3 rounded-full text-primary hover:bg-primary/20 transition-colors"
                  >
                    <FiLinkedin className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-base-100 rounded-xl shadow-sm p-8 border border-base-300">
                <h2 className="text-3xl font-bold text-base-content mb-6">
                  Send Us a Message
                </h2>

                {formStatus.submitted
                  ? <div
                      className={`p-4 rounded-lg mb-6 ${formStatus.success
                        ? "bg-success/10 text-success border border-success/20"
                        : "bg-error/10 text-error border border-error/20"}`}
                    >
                      {formStatus.message}
                    </div>
                  : null}

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-base-content/70 mb-2"
                      >
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-base-content/70 mb-2"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-base-content/70 mb-2"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="input input-bordered w-full"
                      placeholder="How can we help you?"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-base-content/70 mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      className="textarea textarea-bordered w-full"
                      placeholder="Tell us more about your inquiry..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-full gap-2"
                  >
                    Send Message <FiSend />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 bg-base-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-base-content mb-8 text-center">
            Find Us
          </h2>

          <div className="bg-base-200 rounded-xl overflow-hidden h-96 shadow-sm">
            {/* Replace with actual map component or iframe */}
            <div className="w-full h-full flex items-center justify-center bg-base-300">
              <div className="text-center">
                <FiMapPin className="w-12 h-12 text-base-content/40 mx-auto mb-4" />
                <p className="text-base-content/60">
                  Map placeholder - integrate Google Maps or your preferred map
                  service here
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-base-content mb-8 text-center">
            Frequently Asked Questions
          </h2>

          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) =>
              <div key={index} className="mb-4">
                <button
                  className="flex justify-between items-center w-full bg-base-100 p-5 rounded-lg shadow-sm border border-base-300 hover:border-primary/30 transition-colors"
                  onClick={() => toggleAccordion(index)}
                >
                  <span className="font-medium text-base-content text-left">
                    {faq.question}
                  </span>
                  {activeAccordion === index
                    ? <FiChevronUp className="text-primary w-5 h-5" />
                    : <FiChevronDown className="text-base-content/40 w-5 h-5" />}
                </button>

                {activeAccordion === index &&
                  <div className="bg-base-100 p-5 rounded-b-lg border-t-0 border border-base-300 shadow-sm -mt-1">
                    <p className="text-base-content/70">
                      {faq.answer}
                    </p>
                  </div>}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary text-primary-content">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Shop?</h2>
          <p className="text-lg max-w-2xl mx-auto mb-8 opacity-90">
            Explore our wide range of products and find exactly what you're
            looking for.
          </p>
          <a
            href="/product"
            className="btn btn-lg bg-base-100 hover:bg-base-200 text-base-content border-0"
          >
            Shop Now
          </a>
        </div>
      </section>
    </div>
  );
}

export default Contact;
