import { useEffect, useState } from 'react';
import { Quote, Star, Baby, Dog, Leaf, Award } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useReveal } from '@/hooks/useReveal';
import ReviewForm from '@/components/ReviewForm';
import PageLayout from '@/components/PageLayout';

const chefs = [
  {
    name: 'Marco Bellini',
    role: 'Head Chef',
    bio: 'Twelve years in Michelin-starred kitchens across Florence and Lyon. Marco believes every plate should taste like the season it came from.',
    image: 'https://images.pexels.com/photos/4253298/pexels-photo-4253298.jpeg',
  },
  {
    name: 'Amara Okonkwo',
    role: 'Pastry Chef',
    bio: 'Trained in Paris, rooted in Lagos. Amara brings a love of bold spices and delicate technique to every dessert.',
    image: 'https://images.pexels.com/photos/24252237/pexels-photo-24252237.jpeg',
  },
  {
    name: 'Sofia Lindqvist',
    role: 'Sous Chef',
    bio: 'Nordic precision meets Mediterranean warmth. Sofia runs the pass with calm hands and an eye for detail.',
    image: 'https://images.pexels.com/photos/32224391/pexels-photo-32224391.jpeg',
  },
];

const defaultReviews = [
  {
    text: 'The wagyu burger ruined all other burgers for me. The room feels like a friend\u2019s dining room — if that friend happened to be a brilliant chef.',
    author: 'James Whitfield',
    role: 'Food Critic, The Daily Plate',
    rating: 5,
  },
  {
    text: 'I came for coffee and stayed three hours. The avocado smash toast is the best brunch dish I\u2019ve had this year, and I\u2019ve had a lot.',
    author: 'Priya Nair',
    role: 'Local Food Blogger',
    rating: 5,
  },
  {
    text: 'Maison Sage is the kind of place where the chef remembers your name and your order. The panna cotta arrived and I forgot my own name.',
    author: 'Thomas Berg',
    role: 'Regular since 2019',
    rating: 5,
  },
  {
    text: 'We brought the whole family — two kids and our labrador. The kids got coloring pages, the dog got a biscuit, and I got the best flat white in town. Everyone left happy.',
    author: 'Rachel & Tom Okafor',
    role: 'Sunday regulars',
    rating: 5,
  },
];

type GuestReview = {
  id: string;
  author_name: string;
  rating: number;
  review_text: string;
};

export default function AboutPage() {
  const { ref: heroRef, visible: heroVisible } = useReveal<HTMLDivElement>();
  const { ref: chefsRef, visible: chefsVisible } = useReveal<HTMLDivElement>();
  const { ref: reviewsRef, visible: reviewsVisible } = useReveal<HTMLDivElement>();
  const { ref: familyRef, visible: familyVisible } = useReveal<HTMLDivElement>();
  const [guestReviews, setGuestReviews] = useState<GuestReview[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data } = await supabase
        .from('guest_reviews')
        .select('id, author_name, rating, review_text')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(6);
      if (data) setGuestReviews(data as GuestReview[]);
    };
    fetchReviews();
  }, []);

  return (
    <PageLayout>
      <section className="bg-[#f7f3ee] pt-32 pb-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {/* Restaurant story */}
          <div
            ref={heroRef}
            className={`reveal ${heroVisible ? 'is-visible' : ''} grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center`}
          >
            <div className="relative order-2 lg:order-1">
              <div className="overflow-hidden rounded-3xl">
                <img
                  src="https://images.pexels.com/photos/14590691/pexels-photo-14590691.jpeg"
                  alt="Maison Sage interior"
                  className="h-[440px] lg:h-[520px] w-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute -top-5 -right-5 hidden sm:flex h-24 w-24 flex-col items-center justify-center rounded-full bg-[#c8a96a] text-[#2b1d16] shadow-xl">
                <span className="font-serif-display text-2xl leading-none">10</span>
                <span className="font-body text-[10px] tracking-wide mt-1">YEARS</span>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <span className="font-body text-xs tracking-[0.3em] uppercase text-[#b5563a]">
                Our Story
              </span>
              <h2 className="mt-4 font-serif-display text-4xl lg:text-5xl text-[#2b1d16] leading-tight">
                A neighbourhood kitchen with a seasonal heart
              </h2>
              <div className="mt-6 space-y-4 font-body text-[#6b4f3a] leading-relaxed">
                <p>
                  Maison Sage opened in 2014 as a tiny six-table cafe on Garden
                  Street. The idea was simple: cook with whatever the farmers
                  brought that morning, and let the menu write itself.
                </p>
                <p>
                  A decade later, we still change the menu with every harvest.
                  Our kitchen works directly with twelve local farms and two
                  coffee roasters, and every dish starts with what is freshest
                  that day.
                </p>
                <p>
                  We believe a good meal is not just about the food — it is about
                  the room, the light, the person pouring your coffee. That is
                  why we keep the tables small, the music low, and the door open.
                </p>
              </div>
              <div className="mt-8 flex gap-8">
                <div>
                  <p className="font-serif-display text-3xl text-[#c8a96a]">12</p>
                  <p className="font-body text-xs text-[#6b4f3a] mt-1">Local farms</p>
                </div>
                <div>
                  <p className="font-serif-display text-3xl text-[#c8a96a]">30+</p>
                  <p className="font-body text-xs text-[#6b4f3a] mt-1">Seasonal dishes</p>
                </div>
                <div>
                  <p className="font-serif-display text-3xl text-[#c8a96a]">4.9</p>
                  <p className="font-body text-xs text-[#6b4f3a] mt-1">Average rating</p>
                </div>
              </div>
            </div>
          </div>

          {/* Top chefs */}
          <div className="mt-28">
            <div
              ref={chefsRef}
              className={`reveal ${chefsVisible ? 'is-visible' : ''} text-center max-w-2xl mx-auto`}
            >
              <span className="font-body text-xs tracking-[0.3em] uppercase text-[#b5563a]">
                The Team
              </span>
              <h2 className="mt-4 font-serif-display text-4xl lg:text-5xl text-[#2b1d16]">
                Today's top chefs
              </h2>
              <p className="mt-4 font-body text-[#6b4f3a] leading-relaxed">
                The hands behind every plate. Each brings a different story, and
                all of them share a love of honest cooking.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
              {chefs.map((chef, idx) => (
                <article
                  key={chef.name}
                  className="group text-center animate-fade-up"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="relative mx-auto h-64 w-64 overflow-hidden rounded-full ring-4 ring-[#efe7db] shadow-lg">
                    <img
                      src={chef.image}
                      alt={chef.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2b1d16]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <h3 className="mt-6 font-serif-display text-2xl text-[#2b1d16]">
                    {chef.name}
                  </h3>
                  <p className="mt-1 font-body text-sm tracking-wide text-[#c8a96a]">
                    {chef.role}
                  </p>
                  <p className="mt-4 max-w-xs mx-auto font-body text-sm text-[#6b4f3a] leading-relaxed">
                    {chef.bio}
                  </p>
                </article>
              ))}
            </div>
          </div>

          {/* Family & dog friendly */}
          <div className="mt-28">
            <div
              ref={familyRef}
              className={`reveal ${familyVisible ? 'is-visible' : ''} text-center max-w-2xl mx-auto`}
            >
              <span className="font-body text-xs tracking-[0.3em] uppercase text-[#b5563a]">
                Everyone is welcome
              </span>
              <h2 className="mt-4 font-serif-display text-4xl lg:text-5xl text-[#2b1d16]">
                A place for the whole family
              </h2>
              <p className="mt-4 font-body text-[#6b4f3a] leading-relaxed">
                Maison Sage is not just for date nights. We built this room for
                everyone — toddlers, teenagers, grandparents, and the four-legged
                friends who never miss a walk.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8">
              <article className="group overflow-hidden rounded-3xl bg-[#efe7db] border border-[#6b4f3a]/10 animate-fade-up">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/7504344/pexels-photo-7504344.jpeg"
                    alt="Children enjoying a meal at Maison Sage"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#c8a96a] text-[#2b1d16] shadow-lg">
                    <Baby className="h-5 w-5" />
                  </div>
                </div>
                <div className="p-7">
                  <h3 className="font-serif-display text-2xl text-[#2b1d16]">
                    Little foodies welcome
                  </h3>
                  <p className="mt-3 font-body text-sm text-[#6b4f3a] leading-relaxed">
                    Every child gets a mini menu with coloring pages and a small
                    surprise at the end of the meal. Our kids plates are made
                    from the same seasonal ingredients as the grown-up menu,
                    just smaller and a little less spicy.
                  </p>
                  <ul className="mt-4 space-y-2 font-body text-sm text-[#6b4f3a]">
                    <li className="flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-[#8a9a6b]" />
                      Fresh fruit and veggie sides
                    </li>
                    <li className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-[#c8a96a]" />
                      Mini chef certificate for every visit
                    </li>
                    <li className="flex items-center gap-2">
                      <Baby className="h-4 w-4 text-[#b5563a]" />
                      High chairs and a changing table
                    </li>
                  </ul>
                </div>
              </article>

              <article className="group overflow-hidden rounded-3xl bg-[#efe7db] border border-[#6b4f3a]/10 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                <div className="relative h-56 overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/35629974/pexels-photo-35629974.jpeg"
                    alt="A dog relaxing at the outdoor patio"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#c8a96a] text-[#2b1d16] shadow-lg">
                    <Dog className="h-5 w-5" />
                  </div>
                </div>
                <div className="p-7">
                  <h3 className="font-serif-display text-2xl text-[#2b1d16]">
                    Dogs on the patio
                  </h3>
                  <p className="mt-3 font-body text-sm text-[#6b4f3a] leading-relaxed">
                    Our garden patio is open to well-behaved dogs and their
                    humans. Ask for the house dog biscuit at the counter, and a
                    fresh water bowl comes out before you even sit down. We keep
                    a few shaded spots so nobody gets too warm on sunny days.
                  </p>
                  <ul className="mt-4 space-y-2 font-body text-sm text-[#6b4f3a]">
                    <li className="flex items-center gap-2">
                      <Dog className="h-4 w-4 text-[#b5563a]" />
                      Water bowls and house biscuits, always free
                    </li>
                    <li className="flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-[#8a9a6b]" />
                      Shaded seats on the garden patio
                    </li>
                    <li className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-[#c8a96a]" />
                      Dog of the Month photo wall inside
                    </li>
                  </ul>
                </div>
              </article>
            </div>
          </div>

          {/* Customer reviews */}
          <div className="mt-28">
            <div
              ref={reviewsRef}
              className={`reveal ${reviewsVisible ? 'is-visible' : ''} text-center max-w-2xl mx-auto`}
            >
              <span className="font-body text-xs tracking-[0.3em] uppercase text-[#b5563a]">
                Guest Words
              </span>
              <h2 className="mt-4 font-serif-display text-4xl lg:text-5xl text-[#2b1d16]">
                What people are saying
              </h2>
            </div>

            <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
              {defaultReviews.map((review, idx) => (
                <article
                  key={idx}
                  className="relative rounded-2xl bg-[#efe7db] border border-[#6b4f3a]/10 p-7 animate-fade-up"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <Quote className="h-8 w-8 text-[#c8a96a]/40" />
                  <div className="mt-3 flex gap-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#c8a96a] text-[#c8a96a]" />
                    ))}
                  </div>
                  <p className="mt-4 font-body text-sm text-[#6b4f3a] leading-relaxed italic">
                    {review.text}
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2b1d16] text-[#c8a96a] font-serif-display text-lg">
                      {review.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-body text-sm font-medium text-[#2b1d16]">
                        {review.author}
                      </p>
                      <p className="font-body text-xs text-[#6b4f3a]">
                        {review.role}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {guestReviews.length > 0 && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {guestReviews.map((review, idx) => (
                  <article
                    key={review.id}
                    className="relative rounded-2xl bg-[#efe7db] border border-[#c8a96a]/20 p-7 animate-fade-up"
                    style={{ animationDelay: `${idx * 0.08}s` }}
                  >
                    <Quote className="h-8 w-8 text-[#c8a96a]/40" />
                    <div className="mt-3 flex gap-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-[#c8a96a] text-[#c8a96a]" />
                      ))}
                    </div>
                    <p className="mt-4 font-body text-sm text-[#6b4f3a] leading-relaxed italic">
                      {review.review_text}
                    </p>
                    <div className="mt-6 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2b1d16] text-[#c8a96a] font-serif-display text-lg">
                        {review.author_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-body text-sm font-medium text-[#2b1d16]">
                          {review.author_name}
                        </p>
                        <p className="font-body text-xs text-[#6b4f3a]">
                          Verified guest
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <ReviewForm />
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
