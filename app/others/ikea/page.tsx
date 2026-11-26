import IkeaCatalogClient from "@/components/ikea-catalog-client"
import { searchIkeaProducts } from "@/lib/ikea-catalog"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function IkeaCatalogPage() {
  const initialResult = await searchIkeaProducts("sofa", 24)

  return (
    <IkeaCatalogClient
      initialQuery="sofa"
      initialProducts={initialResult.products}
      initialError={initialResult.status === "error" ? initialResult.error || null : null}
    />
  )
}
