import CategoryPage from '@/components/category-page'

export default function FootwearPage() {
  return (
    <CategoryPage
      categorySlug="footwear"
      categoryDisplayName="Medical Footwear"
      categoryDescription="Comfortable and supportive footwear designed for healthcare professionals who spend long hours on their feet. Non-slip soles and easy-clean materials."
      iconName="footprints"
      features={[
        "Non-slip soles",
        "All-day comfort",
        "Easy to clean",
        "Arch support"
      ]}
    />
  )
}