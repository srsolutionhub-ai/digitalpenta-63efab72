import Layout from "@/components/layout/Layout";

export default function Terms() {
  return (
    <Layout>
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-display font-extrabold text-4xl md:text-5xl text-foreground mb-8">
              Terms of <span className="text-gradient">Service</span>
            </h1>
            <p className="text-xs font-mono text-muted-foreground mb-10">Last updated: April 1, 2026</p>

            <div className="space-y-8 text-muted-foreground text-[15px] leading-relaxed">
              <div>
                <h2 className="font-display font-bold text-xl text-foreground mb-3">1. Acceptance of Terms</h2>
                <p>By accessing or using Digital Penta's website and services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our services.</p>
              </div>
              <div>
                <h2 className="font-display font-bold text-xl text-foreground mb-3">2. Services</h2>
                <p>Digital Penta provides digital marketing, public relations, software development, AI solutions, and automation services. Specific terms for each engagement are outlined in individual service agreements and statements of work.</p>
              </div>
              <div>
                <h2 className="font-display font-bold text-xl text-foreground mb-3">3. Intellectual Property</h2>
                <p>All content on this website, including text, graphics, logos, and software, is the property of Digital Penta and protected by intellectual property laws. Client deliverables are transferred upon full payment as specified in service agreements.</p>
              </div>
              <div>
                <h2 className="font-display font-bold text-xl text-foreground mb-3">4. Payment Terms</h2>
                <p>Payment terms are specified in individual service agreements. Standard terms require 50% upfront and 50% upon project completion. Monthly retainers are billed at the beginning of each service period.</p>
              </div>
              <div>
                <h2 className="font-display font-bold text-xl text-foreground mb-3">5. Limitation of Liability</h2>
                <p>Digital Penta's liability is limited to the amount paid for services in the preceding 12 months. We are not liable for indirect, incidental, or consequential damages arising from the use of our services.</p>
              </div>
              <div>
                <h2 className="font-display font-bold text-xl text-foreground mb-3">6. Confidentiality</h2>
                <p>Both parties agree to maintain the confidentiality of proprietary information shared during the engagement. This obligation survives termination of the service agreement.</p>
              </div>
              <div>
                <h2 className="font-display font-bold text-xl text-foreground mb-3">7. Governing Law</h2>
                <p>These terms are governed by the laws of India. Any disputes shall be resolved through arbitration in New Delhi, India, in accordance with the Arbitration and Conciliation Act.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
