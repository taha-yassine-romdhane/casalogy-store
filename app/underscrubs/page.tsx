import CategoryPage from '@/components/category-page'

export default function UnderScrubsPage() {
  return (
    <CategoryPage
      categorySlug="underscrubs"
      categoryDisplayName="Underscrubs"
      categoryDescription="Comfortable and breathable underscrubs designed to be worn under your medical scrubs for added comfort and protection."
      iconName="shirt"
      features={[
        "Moisture-wicking fabric",
        "Seamless comfort",
        "Temperature regulation",
        "Easy care"
      ]}
    />
  )
}