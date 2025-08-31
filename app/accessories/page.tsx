import CategoryPage from '@/components/category-page'

export default function AccessoriesPage() {
  return (
    <CategoryPage
      categorySlug="accessories"
      categoryDisplayName="Medical Accessories"
      categoryDescription="Essential accessories for healthcare professionals including badges, lanyards, caps, and other medical accessories to complete your professional look."
      iconName="package"
      features={[
        "Professional accessories",
        "Durable materials",
        "ID badge holders",
        "Medical caps"
      ]}
    />
  )
}