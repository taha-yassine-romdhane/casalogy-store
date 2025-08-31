import CategoryPage from '@/components/category-page'

export default function OuterwearPage() {
  return (
    <CategoryPage
      categorySlug="outerwear"
      categoryDisplayName="Medical Outerwear"
      categoryDescription="Professional medical outerwear including warm-up jackets, fleece vests, and medical hoodies designed for healthcare professionals."
      iconName="layers"
      features={[
        "Weather protection",
        "Professional styling",
        "Comfort fit",
        "Easy movement"
      ]}
    />
  )
}