import { useStore } from "@/hooks";
import { Helmet } from "react-helmet";

export default function Meta() {
  const store = useStore();

  return (
    <Helmet>
      <title>{store?.name}</title>
      <meta name="description" content={store?.tagline} />
    </Helmet>
  );
}
