import PageLayout from '@/components/PageLayout';
import ReservationSection from '@/components/ReservationSection';
import ContactSection from '@/components/ContactSection';
import NewsletterSection from '@/components/NewsletterSection';

export default function ReservePage() {
  return (
    <PageLayout>
      <div className="pt-20">
        <ReservationSection />
        <ContactSection />
        <NewsletterSection />
      </div>
    </PageLayout>
  );
}
