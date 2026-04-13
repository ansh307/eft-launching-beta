// /unsubscribe/page.tsx

import { Suspense } from "react";
import UnsubscribeClient from "./UnsubscribeClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UnsubscribeClient />
    </Suspense>
  );
}
