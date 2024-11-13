import { BlockPage} from '@/components/src-app-page';
import { TokenGate } from '@/components/TokenGate';
import { getSession } from '@/utils/session';
import Head from 'next/head';


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

<h1>Hello & Welcome, &nbsp; &nbsp; <code>{data.client ? data.client.givenName : data.company?.name}</code></h1>
<BlockPage/> 
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
