import CategoryPage from '@/components/category-page'

export default function LabCoatsPage() {
  return (
    <CategoryPage
      categorySlug="lab-coats"
      categoryDisplayName="Lab Coats"
      categoryDescription="Professional lab coats designed for medical professionals, students, and healthcare workers. Perfect for Tunisia's medical community."
      iconName="stethoscope"
      features={[
        "Antimicrobial fabric",
        "Professional appearance", 
        "Durable construction",
        "Multiple pocket options"
      ]}
    />
  )
}