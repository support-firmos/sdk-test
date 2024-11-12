import { ProductSelectionComponent } from '@/components/src-app-page';
import { TokenGate } from '@/components/TokenGate';
import { getSession } from '@/utils/session';


/**
 * The revalidate property determine's the cache TTL for this page and
 * all fetches that occur within it. This value is in seconds.
 */
export const revalidate = 180;

async function Content({ searchParams }: { searchParams: SearchParams }) {
  const data = await getSession(searchParams);
  // Console log the data to see what's available
  // You can see these logs in the terminal where
  // you run `yarn dev`
  console.log({ data });
  return (
    <main>
<h1>Hello & Welcome, <br></br><code>{data.client ? data.client.givenName : data.company?.name}</code></h1>
<ProductSelectionComponent/> 
    </main>
  );
}
export default function Page({ searchParams }: { searchParams: SearchParams }) {
  return (
    <TokenGate searchParams={searchParams}>
      <Content searchParams={searchParams} />
    </TokenGate>
  );
}
