import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import HeroCarousel from '@/components/HeroCarousel';
import AwardCategoriesGrid from '@/components/AwardCategoriesGrid';
import About from '@/components/About';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <>
      <Helmet>
        <title>The Funnys</title>
        <meta 
          name="description" 
          content="The Funny Awards 2026 honors the funniest in comedy across film, TV, stage, and digital. Join us for the biggest night in funny." 
        />
      </Helmet>

      <div className="min-h-screen bg-dark flex flex-col">
        <Header />
        <main className="flex-grow">
          <HeroCarousel />
          <AwardCategoriesGrid />
          <About />
        </main>
        <Footer />
        <Toaster />
      </div>
    </>
  );
}

export default App;