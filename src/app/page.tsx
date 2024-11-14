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
  return (
    <main>
      <h1>Hello & Welcome, &nbsp; &nbsp; <code>{data.client ? data.client.givenName : data.company?.name}</code></h1>
      <BlockPage sessionData={{
        client: data.client ? {
          givenName: data.client.givenName || '',
          lastName: data.client.familyName || ''  // Map familyName to lastName
        } : undefined,
        company: data.company ? {
          name: data.company.name || ''  // Ensure name is a non-nullable string
        } : undefined
      }}/> 
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
