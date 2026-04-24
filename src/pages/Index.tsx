import HeroSection from "../components/HeroSection";
import ProductShowcase from "../components/ProductShowcase";
import CategoriesSection from "../components/CategoriesSection";
import BannerCarousel from "../components/BannerCarousel";
import InstagramReels from "../components/InstagramReels";
import PromotionSection from "../components/PromotionSection";

const Index = () => {
  return (
    <div className="min-h-screen overflow-hidden">
      <HeroSection />
      <CategoriesSection />
      <ProductShowcase />
      {/* <PromotionSection /> */}
      <BannerCarousel />
      <InstagramReels />
    </div>
  );
};

export default Index;
