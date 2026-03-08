import ContactHero from "../components/contact/ontactHero";
import ContactInfo from "../components/contact/ContactInfo";
import ContactForm from "../components/contact/ContactForm";
import ContactMap from "../components/contact/ContactMap";

const ContactPage = () => {
  return (
    <main className="bg-theme-bg">
      <ContactHero />

      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 py-10 lg:py-12 grid lg:grid-cols-2 gap-5 lg:gap-6">
        <ContactInfo />
        <ContactForm />
      </section>

      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 pb-14 lg:pb-16">
        <ContactMap />
      </section>
    </main>
  );
};

export default ContactPage;
